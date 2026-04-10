"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Sparkles, Gamepad2, DollarSign, Clock, FileText, Package, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameCategory, ServiceCategory, GAME_NAMES, CATEGORY_NAMES } from "@/types";
import { useAuth } from "@/contexts/auth-context";
import { API_URL } from "@/lib/config";

export default function CreateOfferPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    game: "" as GameCategory | "",
    gameDetails: "",
    category: "" as ServiceCategory | "",
    price: "",
    deliveryTime: "",
    stock: "",
    allowDirectPurchase: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: formData.category === 'ITEMS' && formData.stock ? parseInt(formData.stock) : null,
          images: [],
        }),
      });

      if (response.ok) {
        const service = await response.json();
        router.push(`/services/${service.id}`);
      } else {
        alert("فشل في إنشاء العرض. يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      console.error("Error creating offer:", error);
      alert("حدث خطأ. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-900 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 rounded-full border border-violet-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-300">أضف خدمتك</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            حوّل مهاراتك إلى <span className="text-violet-400">دخل</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            انشئ خدمتك الآن واستقبل طلبات من اللاعبين في ثواني
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/[0.07] rounded-2xl border border-white/[0.18] shadow-2xl overflow-hidden">
          <div className="bg-violet-600 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">خدمة جديدة</h2>
                <p className="text-indigo-200 text-sm">عبّي البيانات</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Title */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                <FileText className="w-4 h-4 text-violet-400" />
                عنوان الخدمة *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="مثال: تعزيز رتبة League of Legends من Silver إلى Gold"
                className="w-full bg-slate-700/50 border border-white/[0.18] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            {/* Game & Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Game Selection */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                  <Gamepad2 className="w-4 h-4 text-purple-400" />
                  اللعبة *
                </label>
                <select
                  name="game"
                  value={formData.game}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-700/50 border border-white/[0.18] rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:ring-2 focus:ring-violet-500/20 appearance-none cursor-pointer"
                >
                  <option value="" className="bg-zinc-800">اختر لعبة</option>
                  {Object.entries(GAME_NAMES).map(([key, name]) => (
                    <option key={key} value={key} className="bg-zinc-800">
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  نوع الخدمة *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-700/50 border border-white/[0.18] rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:ring-2 focus:ring-violet-500/20 appearance-none cursor-pointer"
                >
                  <option value="" className="bg-zinc-800">اختر فئة</option>
                  {Object.entries(CATEGORY_NAMES).map(([key, name]) => (
                    <option key={key} value={key} className="bg-zinc-800">
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Game Details */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                تفاصيل إضافية (اختياري)
              </label>
              <input
                type="text"
                name="gameDetails"
                value={formData.gameDetails}
                onChange={handleChange}
                placeholder="مثال: سيرفر EUW، أي دور، خبرة دايموند+"
                className="w-full bg-slate-700/50 border border-white/[0.18] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                <FileText className="w-4 h-4 text-cyan-400" />
                الوصف *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                placeholder="صف خدمتك بالتفصيل. ما الذي يتضمنه؟ ما هي المتطلبات؟ ما الذي يميز خدمتك؟"
                className="w-full bg-slate-700/50 border border-white/[0.18] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-2 focus:ring-violet-500/20 resize-none"
              />
            </div>

            {/* Price and Delivery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  السعر (ر.س) *
                </label>
                <div className="relative">
                  <span className="absolute end-4 top-1/2 -translate-y-1/2 text-green-400 font-semibold text-sm">ر.س</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="1"
                    step="0.01"
                    placeholder="100"
                    className="w-full bg-slate-700/50 border border-white/[0.18] rounded-xl ps-4 pe-14 py-3 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                  <Clock className="w-4 h-4 text-orange-400" />
                  مدة التنفيذ *
                </label>
                <input
                  type="text"
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleChange}
                  required
                  placeholder="مثال: 2-3 أيام"
                  className="w-full bg-slate-700/50 border border-white/[0.18] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
            </div>

            {/* Stock (only for ITEMS category) */}
            {formData.category === 'ITEMS' && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                  <Package className="w-4 h-4 text-amber-400" />
                  الكمية المتوفرة (اختياري)
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  placeholder="مثال: 50 — اتركه فارغ لكمية غير محدودة"
                  className="w-full bg-slate-700/50 border border-white/[0.18] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-2 focus:ring-violet-500/20"
                />
                <p className="text-zinc-500 text-xs">عدد الأغراض المتوفرة للبيع. الكمية تنقص تلقائياً مع كل طلب.</p>
              </div>
            )}

            {/* Direct Purchase Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-white/[0.18]">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-violet-400" />
                <div>
                  <p className="text-white font-medium text-sm">الشراء المباشر</p>
                  <p className="text-zinc-500 text-xs">السماح للعملاء بالشراء مباشرة بدون محادثة</p>
                </div>
              </div>
              <button
                type="button"
                dir="ltr"
                role="switch"
                aria-checked={formData.allowDirectPurchase}
                onClick={() => setFormData({ ...formData, allowDirectPurchase: !formData.allowDirectPurchase })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.allowDirectPurchase ? 'bg-violet-600' : 'bg-zinc-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.allowDirectPurchase ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-white/[0.18]">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-6 rounded-xl font-semibold text-lg shadow-lg shadow-violet-500/15 "
                size="lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    جاري النشر...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    نشر الخدمة
                  </span>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
                className="px-8 border-white/[0.18] text-zinc-300 hover:bg-zinc-700 hover:text-white rounded-xl"
                size="lg"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-violet-900/30 rounded-2xl border border-indigo-500/20 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-violet-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-xl text-white">نصائح للنجاح</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: "✨", text: "اختر عنوان واضح ويلفت الانتباه" },
              { icon: "📝", text: "وصّف خدمتك بالتفصيل" },
              { icon: "💰", text: "حط سعر منافس" },
              { icon: "⏰", text: "حط وقت تنفيذ واقعي" },
              { icon: "📋", text: "وضّح المتطلبات من العميل" },
              { icon: "🏆", text: "أبرز خبرتك ونسبة نجاحك" },
            ].map((tip, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/[0.07] rounded-xl border border-white/[0.18]">
                <span className="text-xl">{tip.icon}</span>
                <span className="text-zinc-300 text-sm">{tip.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
