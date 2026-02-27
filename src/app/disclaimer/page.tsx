"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-transparent py-16" dir="rtl">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-zinc-400 hover:text-white">
            <ArrowRight className="w-4 h-4 ms-2" />
            العودة للرئيسية
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">إخلاء المسؤولية</h1>
        <p className="text-sm text-zinc-500 mb-10">آخر تحديث: فبراير 2026</p>
        
        <div className="space-y-8 text-[15px] leading-relaxed text-zinc-400">
          <p>
            بعض الأشياء التي تستحق أن نكون صريحين بشأنها قبل استخدامك لـ BoostMarket.
          </p>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">نحن سوق، وليس مزود خدمة</h2>
            <p>
              BoostMarket يربط المشترين ببائعين مستقلين يقدمون خدمات التعزيز. نحن لا نوظف البوسترز، ولا نقوم بأي تعزيز بأنفسنا. جودة كل خدمة تعتمد على البائع الفردي — رغم أننا نبذل قصارى جهدنا للتحقق منهم والتعامل مع النزاعات عندما تسوء الأمور.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">قواعد اللعبة ومخاطر الحساب</h2>
            <p className="mb-3">
              لنكن صريحين: العديد من ناشري الألعاب يعتبرون التعزيز انتهاكاً لشروط الخدمة الخاصة بهم. استخدام BoostMarket قد يعرض حساب لعبتك لخطر العقوبات، بما في ذلك الحظر المؤقت أو التعليق الدائم من قبل مطور اللعبة.
            </p>
            <p>
              هذا قرار عليك اتخاذه بنفسك. لا يمكننا ضمان أن حساب لعبتك لن يواجه عواقب، ولسنا مسؤولين إذا حدث ذلك.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">مشاركة الحساب</h2>
            <p>
              بعض الخدمات تتضمن مشاركة بيانات تسجيل دخول حساب لعبتك مع البوستر. نشجع استخدام الخدمات التي لا تتطلب ذلك كلما أمكن. إذا شاركت بياناتك، غيّر كلمة المرور بعدها وفعّل التحقق بخطوتين. لا يمكن تحميلنا المسؤولية عما يحدث للحسابات التي تشارك الوصول إليها طواعية.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">لا نتائج مضمونة</h2>
            <p>
              الألعاب تُحدَّث، والميتا يتغير، وخوارزميات التوفيق تتبدل. قد يواجه البوستر صعوبة غير متوقعة أو يستغرق وقتاً أطول من المتوقع. بينما معظم الطلبات تسير بسلاسة، لا يمكننا الوعد بنتائج محددة — فقط أن البائعين مطالبون ببذل جهد حقيقي لتسليم ما أدرجوه.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">تحديد المسؤولية</h2>
            <p>
              BoostMarket غير مسؤول عن الأضرار غير المباشرة أو العرضية أو التبعية الناتجة عن استخدام المنصة. يشمل ذلك حسابات الألعاب المفقودة، أو مكافآت الرتب الضائعة، أو أي شيء آخر ينتج عن الخدمات المشتراة هنا. مسؤوليتنا الإجمالية تجاهك محدودة بالمبلغ الذي دفعته للطلب المحدد المعني.
            </p>
          </div>

          <div className="pt-4 border-t border-white/[0.15]">
            <p className="text-zinc-500 text-sm">
              أسئلة؟ <a href="mailto:support@boostmarket.com" className="text-violet-400 hover:underline">support@boostmarket.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
