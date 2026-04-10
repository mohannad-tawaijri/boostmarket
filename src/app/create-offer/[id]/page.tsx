"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Sparkles, Gamepad2, DollarSign, Clock, FileText, Package, ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameCategory, ServiceCategory, GAME_NAMES, CATEGORY_NAMES } from "@/types";
import { useAuth } from "@/contexts/auth-context";
import { API_URL } from "@/lib/config";

export default function EditOfferPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
    active: true,
  });

  useEffect(() => {
    if (!params.id) return;
    const fetchService = async () => {
      try {
        const response = await fetch(`${API_URL}/services/${params.id}`);
        if (!response.ok) throw new Error();
        const data = await response.json();

        // Verify ownership
        if (user && data.boosterId !== user.id) {
          router.push("/dashboard?tab=offers");
          return;
        }

        setFormData({
          title: data.title || "",
          description: data.description || "",
          game: data.game || "",
          gameDetails: data.gameDetails || "",
          category: data.category || "",
          price: data.price?.toString() || "",
          deliveryTime: data.deliveryTime || "",
          stock: data.stock !== null && data.stock !== undefined ? data.stock.toString() : "",
          allowDirectPurchase: data.allowDirectPurchase !== false,
          active: data.active !== false,
        });
      } catch {
        router.push("/dashboard?tab=offers");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [params.id, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push("/login");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/services/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          game: formData.game,
          gameDetails: formData.gameDetails,
          category: formData.category,
          price: parseFloat(formData.price),
          deliveryTime: formData.deliveryTime,
          stock: formData.category === 'ITEMS' && formData.stock ? parseInt(formData.stock) : null,
          allowDirectPurchase: formData.allowDirectPurchase,
          active: formData.active,
        }),
      });

      if (response.ok) {
        router.push("/dashboard?tab=offers");
      } else {
        alert("فشل في تحديث العرض. يرجى المحاولة مرة أخرى.");
      }
    } catch {
      alert("حدث خطأ. يرجى المحاولة مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/services/${params.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        router.push("/dashboard?tab=offers");
      } else {
        alert("فشل في حذف العرض.");
      }
    } catch {
      alert("حدث خطأ. يرجى المحاولة مرة أخرى.");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-900 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 rounded-full border border-violet-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-300">تعديل الخدمة</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            عدّل <span className="text-violet-400">خدمتك</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            حدّث تفاصيل خدمتك أو غيّر السعر
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/[0.07] rounded-2xl border border-white/[0.18] shadow-2xl overflow-hidden">
          <div className="bg-violet-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">تعديل الخدمة</h2>
                  <p className="text-indigo-200 text-sm">حدّث البيانات</p>
                </div>
              </div>
              {/* Active/Inactive toggle */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-indigo-200">{formData.active ? 'نشط' : 'متوقف'}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.active}
                  onClick={() => setFormData({ ...formData, active: !formData.active })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.active ? 'bg-green-500' : 'bg-zinc-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.active ? 'translate-x-1.5' : 'translate-x-6'
                    }`}
                  />
                </button>
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
                placeholder="صف خدمتك بالتفصيل."
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
                role="switch"
                aria-checked={formData.allowDirectPurchase}
                onClick={() => setFormData({ ...formData, allowDirectPurchase: !formData.allowDirectPurchase })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.allowDirectPurchase ? 'bg-violet-600' : 'bg-zinc-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.allowDirectPurchase ? 'translate-x-1.5' : 'translate-x-6'
                  }`}
                />
              </button>
            </div>

            {/* Submit & Delete Buttons */}
            <div className="flex gap-4 pt-6 border-t border-white/[0.18]">
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-6 rounded-xl font-semibold text-lg shadow-lg shadow-violet-500/15"
                size="lg"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    جاري الحفظ...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    حفظ التعديلات
                  </span>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={saving || deleting}
                className="px-6 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl"
                size="lg"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={saving}
                className="px-8 border-white/[0.18] text-zinc-300 hover:bg-zinc-700 hover:text-white rounded-xl"
                size="lg"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/[0.18] rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">حذف الخدمة؟</h3>
              <p className="text-zinc-400 mb-6">هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.</p>
              <div className="flex gap-3">
                <Button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white"
                >
                  {deleting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      جاري الحذف...
                    </span>
                  ) : (
                    'نعم، احذف'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="flex-1 border-white/[0.18] text-zinc-300"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
