"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { API_URL } from "@/lib/config";

export default function ResetPasswordPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const token = (params?.token as string) || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    if (password !== confirm) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data?.message ||
            "الرابط غير صالح أو منتهي الصلاحية. يرجى طلب رابط جديد."
        );
      }

      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
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
          <Logo lockup size="lg" className="mb-6" />
          <h1 className="text-3xl font-bold text-white mb-2">
            تعيين كلمة مرور جديدة
          </h1>
          <p className="text-zinc-400">أدخل كلمة المرور الجديدة لحسابك</p>
        </div>

        <div className="bg-white/[0.07] rounded-2xl border border-white/[0.18] p-8">
          {done ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                تم تغيير كلمة المرور
              </h2>
              <p className="text-zinc-400 mb-6">
                سيتم توجيهك إلى صفحة تسجيل الدخول...
              </p>
              <Link href="/login">
                <Button className="w-full bg-violet-600 hover:bg-indigo-500">
                  تسجيل الدخول الآن
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
                  كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-5 h-5" />
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pr-10 pl-10 py-3 bg-slate-700/50 border border-white/[0.18] rounded-xl text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-2 focus:ring-violet-500/20"
                    placeholder="6 أحرف على الأقل"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    aria-label="إظهار كلمة المرور"
                  >
                    {show ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-5 h-5" />
                  <input
                    type={show ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pr-10 pl-4 py-3 bg-slate-700/50 border border-white/[0.18] rounded-xl text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-2 focus:ring-violet-500/20"
                    placeholder="أعد إدخال كلمة المرور"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-violet-600 hover:bg-indigo-500 py-3"
              >
                {loading ? "جاري الحفظ..." : "حفظ كلمة المرور الجديدة"}
              </Button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-violet-400 hover:text-violet-300 text-sm"
                >
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
