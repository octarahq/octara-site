"use client";

import { useCallback, useEffect, useState } from "react";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Gradient from "@/app/background/shadergradients/06";

interface ClientInfo {
  name: string;
  description?: string;
  logoData?: string;
}

export default function AuthorizePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const client_id = searchParams.get("client_id");
  const redirect_uri = searchParams.get("redirect_uri");
  const response_type = searchParams.get("response_type");
  const scope = searchParams.get("scope") || "";
  const state = searchParams.get("state") || "";
  const code_challenge = searchParams.get("code_challenge") || "";
  const code_challenge_method = searchParams.get("code_challenge_method") || "";

  const handleConsent = useCallback(async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/oauth/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id,
          redirect_uri,
          response_type,
          scope,
          state,
          code_challenge,
          code_challenge_method,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to authorize");
      }

      const data = await res.json();
      window.location.assign(data.redirect_url);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : String(e));
      setSubmitting(false);
    }
  }, [
    client_id,
    redirect_uri,
    response_type,
    scope,
    state,
    code_challenge,
    code_challenge_method,
  ]);

  useEffect(() => {
    if (user === null) {
      const currentUrl = encodeURIComponent(
        window.location.pathname + window.location.search,
      );
      router.push(`/login?redirectUrl=${currentUrl}`);
      return;
    }

    if (user && client_id && redirect_uri) {
      const fetchInfo = async () => {
        try {
          const res = await fetch(
            `/api/v1/oauth/client-info?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=${response_type}`,
          );
          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Invalid request");
          }
          const data = await res.json();
          setClientInfo(data.client);

          if (data.skip_consent) {
            handleConsent();
          } else {
            setLoading(false);
          }
        } catch (e: unknown) {
          toast.error(e instanceof Error ? e.message : String(e));
          setLoading(false);
        }
      };
      fetchInfo();
    }
  }, [user, client_id, redirect_uri, router, response_type, handleConsent]);

  const handleCancel = () => {
    let url = redirect_uri + "?error=access_denied";
    if (state) url += "&state=" + state;
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(url);
  };

  if (user === null) return null;

  if (loading) {
    return (
      <main className="relative min-h-screen flex items-center justify-center p-4">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="w-full h-full opacity-60">
            <Gradient />
          </div>
        </div>
        <Card className="w-full max-w-lg z-10 shadow-2xl border-primary/20 bg-background/60 backdrop-blur-md">
          <CardContent className="py-12 flex justify-center">
            <p className="text-muted-foreground animate-pulse">
              Loading authorization request...
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!clientInfo) {
    return (
      <main className="relative min-h-screen flex items-center justify-center p-4">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="w-full h-full opacity-60">
            <Gradient />
          </div>
        </div>
        <Card className="w-full max-w-lg z-10 shadow-2xl border-primary/20 bg-background/60 backdrop-blur-md">
          <CardContent className="py-12 flex flex-col items-center text-center gap-4">
            <ShieldAlert className="size-12 text-red-500" />
            <p className="text-red-400 font-semibold">
              Invalid Authorization Request
            </p>
            <p className="text-sm text-muted-foreground">
              The request parameters are invalid or the client does not exist.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const VALID_SCOPES: Record<string, string> = {
    identify: "Access your basic profile information (username, ID)",
    "read:profile": "Access your complete profile information",
    "read:search_history": "Read your Octara Search history",
    "write:search_history": "Modify or clear your Octara Search history",
    "read:search_settings": "View your search engine settings",
    "write:search_settings": "Modify your search engine settings",
    "read:search_domains": "View your verified domains for Octara Search",
    "write:search_domains": "Manage your verified domains",
  };

  const rawScopes = scope ? scope.split(" ") : ["identify"];
  const validRequestedScopes = rawScopes.filter((s) => VALID_SCOPES[s]);

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="w-full h-full opacity-60">
          <Gradient />
        </div>
      </div>
      <Card className="w-full max-w-lg z-10 shadow-2xl border-primary/20 bg-background/60 backdrop-blur-md">
        <CardHeader className="space-y-3 pb-4">
          <div className="flex justify-center mb-4">
            <div className="size-16 bg-zinc-800 rounded-2xl flex items-center justify-center border border-zinc-700 shadow-inner">
              <ShieldCheck className="size-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">
            Authorize <span className="text-primary">{clientInfo.name}</span>
          </CardTitle>
          <CardDescription className="text-center text-base">
            This application would like to access your Octara account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {clientInfo.description && (
            <div className="p-4 bg-black/20 rounded-lg text-sm text-zinc-300 border border-white/5">
              {clientInfo.description}
            </div>
          )}

          <div>
            <h3 className="font-semibold text-zinc-200 mb-3 text-sm uppercase tracking-wider">
              Requested Access
            </h3>
            <ul className="space-y-2">
              {validRequestedScopes.length > 0 ? (
                validRequestedScopes.map((s) => (
                  <li
                    key={s}
                    className="flex items-center gap-2 text-sm text-zinc-400"
                  >
                    <div className="size-1.5 rounded-full bg-primary" />
                    {VALID_SCOPES[s]}
                  </li>
                ))
              ) : (
                <li className="text-sm text-zinc-500 italic">
                  No valid permissions requested.
                </li>
              )}
            </ul>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Button
              size="lg"
              className="w-full font-semibold"
              onClick={handleConsent}
              disabled={submitting}
            >
              {submitting ? "Authorizing..." : "Authorize Application"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/50 pt-6 mt-2">
          <p className="text-muted-foreground text-xs text-center px-4">
            By authorizing, you allow this application to use your account in
            accordance with their terms of service and privacy policies.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
