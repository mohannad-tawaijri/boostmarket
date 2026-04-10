"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import Logo from "@/components/logo";
import { API_URL } from "@/lib/config";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }

    if (formData.password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.access_token, data.refresh_token, data.user);
        router.push("/");
      } else {
        setError(data.message || "فشل التسجيل. يرجى المحاولة مرة أخرى.");
      }
    } catch (err) {
      setError("حدث خطأ. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 flex justify-center">
          <Logo size="lg" />
        </div>

        {/* Register Card */}
        <div className="bg-white/[0.07] rounded-2xl border border-white/[0.18] shadow-2xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-white text-center mb-2">إنشاء حساب</h1>
            <p className="text-zinc-400 text-center mb-8">انضم لمجتمع تعزيز الألعاب</p>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                  <User className="w-4 h-4 text-violet-400" />
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="محمد أحمد"
                  className="w-full bg-slate-700/50 border border-white/[0.18] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

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

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                  <Lock className="w-4 h-4 text-violet-400" />
                  تأكيد كلمة المرور
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-700/50 border border-white/[0.18] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 text-lg mt-2"
                size="lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    جاري إنشاء الحساب...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    إنشاء حساب
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>

              {/* Terms */}
              <p className="text-xs text-zinc-500 text-center">
                بإنشاء حساب، أنت توافق على{" "}
                <Link href="/terms" className="text-violet-400 hover:underline">شروط الخدمة</Link>
                {" "}و{" "}
                <Link href="/privacy" className="text-violet-400 hover:underline">سياسة الخصوصية</Link>
              </p>
            </form>
          </div>

          {/* Login Link */}
          <div className="px-8 py-6 bg-white/[0.09] border-t border-white/[0.18] text-center">
            <p className="text-zinc-400">
              لديك حساب بالفعل؟{" "}
              <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
