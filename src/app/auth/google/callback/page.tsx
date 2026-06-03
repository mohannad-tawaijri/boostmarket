"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { API_URL } from "@/lib/config";
import Logo from "@/components/logo";

function GoogleCallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const code = params.get("code");
    const error = params.get("error");

    if (error) {
      router.replace(`/login?error=${encodeURIComponent(error)}`);
      return;
    }

    if (!code) {
      router.replace("/login?error=google_auth_failed");
      return;
    }

    // Exchange the one-time code for tokens (tokens are never placed in the URL).
    (async () => {
      try {
        const res = await fetch(`${API_URL}/auth/google/exchange`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });
        if (!res.ok) {
          router.replace("/login?error=google_auth_failed");
          return;
        }
        const data = await res.json();
        if (!data?.token || !data?.refreshToken || !data?.user) {
          router.replace("/login?error=google_auth_failed");
          return;
        }
        login(data.token, data.refreshToken, data.user);
        router.replace("/");
      } catch (e) {
        console.error("Failed to complete Google auth", e);
        router.replace("/login?error=google_auth_failed");
      }
    })();
  }, [params, router, login]);

  return (
    <div className="flex items-center gap-3 text-zinc-300">
      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      <span>جاري تسجيل الدخول عبر Google...</span>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6">
        <Logo lockup size="lg" />
        <Suspense fallback={
          <div className="flex items-center gap-3 text-zinc-300">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>جاري تسجيل الدخول عبر Google...</span>
          </div>
        }>
          <GoogleCallbackContent />
        </Suspense>
      </div>
    </div>
  );
}
