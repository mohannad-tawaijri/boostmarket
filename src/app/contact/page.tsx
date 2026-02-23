"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-transparent py-16" dir="rtl">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-zinc-400 hover:text-white">
            <ArrowRight className="w-4 h-4 ms-2" />
            العودة للرئيسية
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">اتصل بنا</h1>
        <p className="text-zinc-500 text-sm mb-10">
          لديك سؤال أو مشكلة أو اقتراح؟ أرسل لنا رسالة وسنرد عليك
          خلال 24 ساعة. للمشاكل المتعلقة بالطلبات، يمكنك أيضاً استخدام نظام النزاعات من
          صفحة طلبك.
        </p>

        <div className="flex items-center gap-3 mb-8 text-sm text-zinc-400">
          <Mail className="w-4 h-4 text-violet-400" />
          <span>أو راسلنا مباشرة على{" "}
            <a href="mailto:support@boostmarket.com" className="text-violet-400 hover:underline">
              support@boostmarket.com
            </a>
          </span>
        </div>

        {submitted ? (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-8 text-center">
            <h2 className="text-xl font-semibold text-white mb-2">تم إرسال الرسالة</h2>
            <p className="text-zinc-400 text-sm">سنرد عليك في أقرب وقت ممكن.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">الاسم</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-violet-600 transition-colors"
                  placeholder="اسمك"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-violet-600 transition-colors"
                  placeholder="you@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">الموضوع</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-violet-600 transition-colors"
                placeholder="ما الموضوع؟"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">الرسالة</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-violet-600 transition-colors resize-none"
                placeholder="أعطنا التفاصيل..."
              />
            </div>
            <Button type="submit" className="w-full">
              إرسال الرسالة
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
