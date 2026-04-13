"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Logo from "@/components/logo";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const token = params.get("token");
    const refreshToken = params.get("refreshToken");
    const userRaw = params.get("user");
    const error = params.get("error");

    if (error) {
      router.replace(`/login?error=${encodeURIComponent(error)}`);
      return;
    }

    if (!token || !refreshToken || !userRaw) {
      router.replace("/login?error=google_auth_failed");
      return;
    }

    try {
      const user = JSON.parse(userRaw);
      login(token, refreshToken, user);
      router.replace("/");
    } catch (e) {
      console.error("Failed to parse Google auth callback", e);
      router.replace("/login?error=google_auth_failed");
    }
  }, [params, router, login]);

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6">
        <Logo size="lg" />
        <div className="flex items-center gap-3 text-zinc-300">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>جاري تسجيل الدخول عبر Google...</span>
        </div>
      </div>
    </div>
  );
}
