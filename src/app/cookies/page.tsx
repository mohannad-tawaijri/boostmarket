"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-transparent py-16" dir="rtl">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للرئيسية
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">سياسة ملفات تعريف الارتباط</h1>
        <p className="text-sm text-zinc-500 mb-10">آخر تحديث: فبراير 2026</p>
        
        <div className="space-y-8 text-[15px] leading-relaxed text-zinc-400">
          <p>
            نستخدم عدداً صغيراً من ملفات تعريف الارتباط. إليك بالضبط ما هي ولماذا.
          </p>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">ملفات تعريف الارتباط الأساسية</h2>
            <p className="mb-3">هذه تبقي الموقع يعمل. لا يمكنك إلغاء الاشتراك فيها دون أن يتعطل الموقع.</p>
            <div className="rounded-lg border border-white/[0.06] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] text-zinc-300">
                    <th className="text-right px-4 py-2.5 font-medium">ملف تعريف الارتباط</th>
                    <th className="text-right px-4 py-2.5 font-medium">الغرض</th>
                    <th className="text-right px-4 py-2.5 font-medium">المدة</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-400">
                  <tr className="border-b border-white/[0.06]/40">
                    <td className="px-4 py-2.5 font-mono text-xs text-zinc-300">session_token</td>
                    <td className="px-4 py-2.5">يبقيك مسجل الدخول</td>
                    <td className="px-4 py-2.5">7 أيام</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono text-xs text-zinc-300">csrf_token</td>
                    <td className="px-4 py-2.5">يمنع تزوير الطلبات عبر المواقع</td>
                    <td className="px-4 py-2.5">الجلسة</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">ملفات تعريف الارتباط التحليلية</h2>
            <p className="mb-3">
              نستخدم تحليلات أساسية لفهم أنماط حركة المرور — أي الصفحات تُزار، ومدة بقاء الزوار، والأجهزة المستخدمة. هذا يساعدنا في تحديد أولويات ما نبنيه بعد ذلك. نحن لا نستخدم Google Analytics أو أي متتبع مرتبط بالإعلانات.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">ما لا نفعله</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>لا ملفات تعريف ارتباط إعلانية من طرف ثالث</li>
              <li>لا تتبع عبر المواقع</li>
              <li>لا بيع بيانات ملفات تعريف الارتباط لأي شخص</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">إدارة ملفات تعريف الارتباط</h2>
            <p>
              يتيح لك متصفحك حظر أو حذف ملفات تعريف الارتباط في أي وقت. فقط اعلم أنه إذا حظرت ملف تعريف الارتباط الخاص بالجلسة، ستُسجَّل خروجك وستحتاج لتسجيل الدخول مرة أخرى في كل زيارة.
            </p>
          </div>

          <div className="pt-4 border-t border-white/[0.06]">
            <p className="text-zinc-500 text-sm">
              أسئلة؟ <a href="mailto:privacy@boostmarket.com" className="text-violet-400 hover:underline">privacy@boostmarket.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
