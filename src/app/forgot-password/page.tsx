"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { API_URL } from "@/lib/config";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "حدث خطأ أثناء إرسال الطلب");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-900 flex items-center justify-center py-12 px-4"
      dir="rtl"
    >
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <Logo size="lg" />
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">
            إعادة تعيين كلمة المرور
          </h1>
          <p className="text-zinc-400">
            أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين
          </p>
        </div>

        <div className="bg-white/[0.07] rounded-2xl border border-white/[0.18] p-8">
          {submitted ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                تحقق من بريدك الإلكتروني
              </h2>
              <p className="text-zinc-400 mb-6">
                إذا كان البريد{" "}
                <span className="text-white">{email}</span> مسجلاً لدينا،
                فسنرسل لك رابط إعادة التعيين خلال لحظات. يرجى مراجعة مجلد
                البريد العشوائي (Spam) أيضاً.
              </p>
              <Link href="/login">
                <Button className="w-full bg-violet-600 hover:bg-indigo-500">
                  العودة لتسجيل الدخول
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pr-10 pl-4 py-3 bg-slate-700/50 border border-white/[0.18] rounded-xl text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-2 focus:ring-violet-500/20"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-violet-600 hover:bg-indigo-500 py-3"
              >
                {loading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
              </Button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-violet-400 hover:text-violet-300 text-sm flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  العودة لتسجيل الدخول
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
