"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/I18nProvider";

export default function PlaygroundPage() {
  const { t } = useI18n();
  const [token, setToken] = useState("");
  const [url, setUrl] = useState("/api/v1/search/history");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("request");

  useEffect(() => {
    const savedToken = localStorage.getItem("playground_token");
    if (savedToken) setToken(savedToken);
  }, []);

  const saveToken = (val: string) => {
    setToken(val);
    localStorage.setItem("playground_token", val);
  };

  const handleSend = async () => {
    setLoading(true);
    setResponse(null);
    setStatus(null);

    try {
      const options: RequestInit = {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      if (method !== "GET" && method !== "DELETE" && body) {
        options.body = body;
      }

      const res = await fetch(url, options);
      setStatus(res.status);
      const data = await res.json();
      setResponse(data);
    } catch (error: any) {
      setResponse({ error: error.message || "Failed to fetch" });
      setStatus(500);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (code: number | null) => {
    if (!code) return "text-gray-400";
    if (code >= 200 && code < 300) return "text-green-400";
    if (code >= 400 && code < 500) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {t("title")}
            </h1>
            <p className="text-gray-400 mt-2">{t("description")}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest border border-white/10 px-2 py-1 rounded">
              v1.0.0-stable
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12 xl:col-span-5 space-y-6">
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -z-1"></div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                {t("auth.title")}
              </h2>
              <div className="space-y-2">
                <label className="text-xs uppercase text-gray-500 font-bold tracking-wider">
                  {t("auth.token_label")}
                </label>
                <input
                  type="password"
                  value={token}
                  onChange={(e) => saveToken(e.target.value)}
                  placeholder={t("auth.token_placeholder")}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors font-mono"
                />
              </div>
            </div>

            <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                {t("endpoint.title")}
              </h2>
              <div className="flex gap-2">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors font-bold text-purple-400 appearance-none text-center min-w-24"
                >
                  <option>GET</option>
                  <option>POST</option>
                  <option>DELETE</option>
                  <option>PATCH</option>
                  <option>PUT</option>
                </select>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors font-mono"
                />
              </div>

              {method !== "GET" && method !== "DELETE" && (
                <div className="mt-6 space-y-2">
                  <label className="text-xs uppercase text-gray-500 font-bold tracking-wider">
                    {t("endpoint.body_label")}
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder='{ "query": "octara search" }'
                    className="w-full h-40 bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors font-mono resize-none"
                  />
                </div>
              )}

              <button
                onClick={handleSend}
                disabled={loading}
                className={`w-full mt-6 py-3 rounded-xl font-bold transition-all relative overflow-hidden group ${
                  loading
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                }`}
              >
                <span className="relative z-10">
                  {loading ? t("endpoint.loading") : t("endpoint.submit")}
                </span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </div>

          <div className="lg:col-span-12 xl:col-span-7">
            <div className="bg-[#141414] border border-white/5 rounded-2xl min-h-[400px] lg:h-[750px] flex flex-col shadow-xl overflow-hidden relative">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveTab("request")}
                    className={`text-sm font-bold pb-1 transition-all ${
                      activeTab === "request"
                        ? "text-white border-b-2 border-blue-500"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {t("response.title")}
                  </button>
                </div>
                {status && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-bold uppercase">
                      {t("response.status_label")}:
                    </span>
                    <span
                      className={`text-sm font-bold font-mono ${getStatusColor(status)}`}
                    >
                      {status}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-auto p-0 font-mono text-sm custom-scrollbar">
                {response ? (
                  <pre className="p-6 text-blue-300 selection:bg-blue-500/30 whitespace-pre-wrap break-all">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-600 italic py-20">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 opacity-20"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    {t("response.waiting")}
                  </div>
                )}
              </div>

              <div className="p-4 bg-white/5 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] text-gray-500 uppercase font-mono tracking-tighter">
                  Octara Developer Tools
                </span>
                <button
                  onClick={() => setResponse(null)}
                  className="text-[10px] text-gray-500 hover:text-gray-300 uppercase font-bold"
                >
                  {t("response.clear")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #141414;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2a2a2a;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3a3a3a;
        }
      `}</style>
    </div>
  );
}
