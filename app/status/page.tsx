"use client";

import { useEffect, useState } from "react";
import { HeroBackground } from "@/app/(home)/_components/hero";
import { motion } from "motion/react";
import { CheckCircle2, AlertTriangle, XCircle, Loader2 } from "lucide-react";

interface OrionMetric {
  timestamp: number;
  online_count: number;
  sample_count: number;
  cpu_avg: number;
  memory_avg: number;
}

interface ServiceStatusResponse {
  id: string;
  label: string;
  url: string;
  metrics: OrionMetric[];
}

interface ProjectStatusResponse {
  id: string;
  name: string;
  services: ServiceStatusResponse[];
}

interface EnhancedService {
  id: string;
  label: string;
  url: string;
  metrics: OrionMetric[];
  status: "Operational" | "Degraded" | "Down" | "Unknown";
}

interface EnhancedProject {
  id: string;
  name: string;
  services: EnhancedService[];
}

export default function StatusPage() {
  const [projects, setProjects] = useState<EnhancedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/v1/status");
        if (!res.ok) throw new Error("Failed to fetch status");
        
        const data: ProjectStatusResponse[] = await res.json();
        
        const enhanced: EnhancedProject[] = data.map(project => {
          return {
            id: project.id,
            name: project.name,
            services: project.services.map(svc => {
              let currentStatus: "Operational" | "Degraded" | "Down" | "Unknown" = "Operational";
              if (svc.metrics.length > 0) {
                const latest = svc.metrics[svc.metrics.length - 1];
                if (latest.online_count === 0) {
                  currentStatus = "Down";
                } else if (latest.cpu_avg > 80 || latest.memory_avg > 1000000000) {
                  currentStatus = "Degraded";
                }
              } else {
                currentStatus = "Unknown";
              }

              return {
                id: svc.id,
                label: svc.label,
                url: svc.url,
                metrics: svc.metrics,
                status: currentStatus
              };
            })
          };
        });
        
        setProjects(enhanced);
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const totalBars = 84; 

  return (
    <main className="min-h-screen relative bg-[#0a0a0a] text-zinc-50 overflow-hidden font-sans">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
        className="fixed inset-0 z-0 pointer-events-none opacity-40"
      >
        <HeroBackground />
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 py-24 max-w-4xl flex justify-center">
        <div className="w-full bg-[#111111] border border-zinc-800/80 rounded-xl p-8 md:p-12 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              System Status
            </h1>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="size-8 animate-spin text-zinc-500" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 text-zinc-400">
              No public services tracked at the moment.
            </div>
          ) : (
            <div className="space-y-16">
              {projects.map((project) => (
                <div key={project.id} className="space-y-6">
                  {/* Project Header */}
                  <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
                    {project.services.some(s => s.status === "Down") ? (
                      <XCircle className="size-6 text-[#ef4444]" />
                    ) : project.services.some(s => s.status === "Degraded") ? (
                      <AlertTriangle className="size-6 text-[#eab308]" />
                    ) : (
                      <CheckCircle2 className="size-6 text-[#22c55e]" />
                    )}
                    <h2 className="text-2xl font-extrabold text-white tracking-wide">
                      {project.name}
                    </h2>
                  </div>
                  
                  {/* Services List for this Project */}
                  <div className="space-y-8 pl-1">
                    {project.services.map((svc) => {
                      const paddedMetrics = [...svc.metrics];
                      while (paddedMetrics.length < totalBars) {
                        paddedMetrics.unshift({
                          timestamp: 0,
                          online_count: -1, 
                          sample_count: 0,
                          cpu_avg: 0,
                          memory_avg: 0
                        });
                      }
                      
                      const displayMetrics = paddedMetrics.slice(-totalBars);
                      
                      const lastValidMetric = [...svc.metrics].reverse().find(m => m.timestamp > 0);
                      const lastDateStr = lastValidMetric 
                        ? new Date(lastValidMetric.timestamp).toISOString().split('T')[0]
                        : "N/A";

                      return (
                        <div key={svc.id} className="flex flex-col gap-3">
                          <div className="flex justify-between items-end">
                            <div className="flex items-center gap-2">
                              {svc.status === "Operational" ? (
                                <CheckCircle2 className="size-4 text-[#22c55e]" />
                              ) : svc.status === "Degraded" ? (
                                <AlertTriangle className="size-4 text-[#eab308]" />
                              ) : (
                                <XCircle className="size-4 text-[#ef4444]" />
                              )}
                              <h3 className="text-lg font-semibold text-zinc-200 tracking-wide">
                                {svc.url ? (
                                  <a href={svc.url} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-white transition-colors">
                                    {svc.label}
                                  </a>
                                ) : (
                                  <>{svc.label}</>
                                )}
                              </h3>
                              <span className="text-xs font-medium text-zinc-500 ml-2">
                                {svc.status}
                              </span>
                            </div>
                            <div className="text-xs font-medium text-zinc-500">
                              Last: {lastDateStr}
                            </div>
                          </div>

                          <div className="flex gap-[3px] h-6 items-end w-full">
                            {displayMetrics.map((m, i) => {
                              let bgColor = "bg-zinc-800"; 
                              let title = "No data";
                              
                              if (m.timestamp > 0) {
                                title = `${new Date(m.timestamp).toLocaleString()} - ${m.online_count > 0 ? 'Online' : 'Offline'}`;
                                if (m.online_count === 0) {
                                  bgColor = "bg-[#ef4444]";
                                } else if (m.cpu_avg > 80) {
                                  bgColor = "bg-[#eab308]";
                                } else {
                                  bgColor = "bg-[#22c55e]";
                                }
                              }

                              return (
                                <div
                                  key={i}
                                  title={title}
                                  className={`flex-1 rounded-sm transition-all hover:opacity-80 ${bgColor}`}
                                  style={{ minWidth: "2px", height: "100%" }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
