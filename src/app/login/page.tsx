"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import Logo from "@/components/logo";
import { API_URL } from "@/lib/config";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.refreshToken, data.user);
        router.push("/");
      } else {
        setError(data.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("خطأ في الاتصال. إذا كنت تستخدم Brave، جرب تعطيل Shields لهذا الموقع.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-900 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -end-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -start-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 flex justify-center">
          <Logo size="lg" />
        </div>

        {/* Login Card */}
        <div className="bg-white/[0.07] rounded-2xl border border-white/[0.18] shadow-2xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-white text-center mb-2">مرحباً بعودتك</h1>
            <p className="text-zinc-400 text-center mb-8">سجل دخولك إلى حسابك</p>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                  <Mail className="w-4 h-4 text-violet-400" />
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="example@email.com"
                  className="w-full bg-slate-700/50 border border-white/[0.18] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                  <Lock className="w-4 h-4 text-violet-400" />
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-700/50 border border-white/[0.18] rounded-xl px-4 py-3 pe-12 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-end">
                <Link href="/forgot-password" className="text-sm text-violet-400 hover:text-violet-300">
                  نسيت كلمة المرور؟
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 text-lg"
                size="lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    جاري تسجيل الدخول...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    تسجيل الدخول
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* Register Link */}
          <div className="px-8 py-6 bg-white/[0.09] border-t border-white/[0.18] text-center">
            <p className="text-zinc-400">
              ليس لديك حساب؟{" "}
              <Link href="/register" className="text-violet-400 hover:text-violet-300 font-medium">
                أنشئ حساباً مجاناً
              </Link>
            </p>
          </div>
        </div>

        {/* Demo credentials hint */}
        <p className="text-center text-zinc-500 text-sm mt-6">
          تجريبي: استخدم أي بريد إلكتروني وكلمة مرور للاختبار
        </p>
      </div>
    </div>
  );
}
