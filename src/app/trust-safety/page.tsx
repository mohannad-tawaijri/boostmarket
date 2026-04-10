"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TrustSafetyPage() {
  return (
    <div className="min-h-screen bg-transparent py-16" dir="rtl">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-zinc-400 hover:text-white">
            <ArrowRight className="w-4 h-4 ms-2" />
            العودة للرئيسية
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">الثقة والأمان</h1>
        <p className="text-sm text-zinc-500 mb-10">كيف نحاول إبقاء الأمور عادلة وآمنة هنا.</p>

        <div className="space-y-8 text-[15px] leading-relaxed text-zinc-400">
          <p>
            نحن سوق، مما يعني أننا بقدر جودة الثقة بين المشترين والبائعين.
            إليك ما نفعله من جانبنا لكسب تلك الثقة — وما نتوقعه منك.
          </p>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">المدفوعات محتجزة، وليست فورية</h2>
            <p>
              عندما يقدم المشتري طلباً، نحتفظ بالدفع حتى يتم تسليم الخدمة
              وتأكيدها. لا يحصل البوستر على أجره مقدماً — يحصل عليه عند إتمام العمل.
              إذا حدث خطأ ما قبل ذلك، يمكن للمشتري فتح نزاع
              وسنراجعه.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">التقييمات حقيقية</h2>
            <p>
              فقط الأشخاص الذين أكملوا طلباً يمكنهم ترك تقييم. نحن لا نزيل
              التقييمات السلبية لأن البائع طلب منا ذلك. سنزيل التقييمات التي
              تحتوي على رسائل مزعجة أو تهديدات أو معلومات شخصية — لكن النقد الصادق يبقى،
              حتى لو لم يكن مُرضياً.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">النزاعات</h2>
            <p>
              إذا لم يتمكن المشتري والبائع من الاتفاق، يمكن لأي طرف فتح نزاع. ينظر فريق الدعم لدينا
              في تفاصيل الطلب وسجل الدردشة وأي أدلة يقدمها الطرفان.
              نحاول أن نكون عادلين — لا ننحاز تلقائياً للمشترين أو البائعين. الحل
              عادة يستغرق من 24 إلى 72 ساعة حسب التعقيد.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">أمان الحساب</h2>
            <p className="mb-3">
              نشفر كلمات المرور بـ bcrypt ونقدم كل شيء عبر HTTPS. نحن لا نخزن
              بيانات حسابات الألعاب — إذا تطلبت الخدمة مشاركة الحساب، يحدث ذلك
              مباشرة بين المشتري والبائع عبر الدردشة المشفرة.
            </p>
            <p>
              ومع ذلك، مشاركة بيانات تسجيل دخول لعبتك مع أي شخص ينطوي على مخاطر. ننصح بتغيير
              كلمة المرور بعد أي خدمة تتضمن الوصول للحساب، وتفعيل التحقق بخطوتين دائماً.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">ما يؤدي للحظر</h2>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span className="text-zinc-600"></span>
                <span>الاحتيال على المشترين أو البائعين (أخذ الدفع دون التسليم، أو تقديم نزاعات كاذبة)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-600"></span>
                <span>إنشاء تقييمات مزيفة أو التلاعب بالتصنيفات</span>
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-600"></span>
                <span>المضايقة أو التهديدات في الدردشة</span>
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-600"></span>
                <span>محاولة نقل المعاملات خارج المنصة لتجنب حماية الدفع</span>
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-600"></span>
                <span>حسابات متعددة للتلاعب بالنظام</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">الإبلاغ عن مشاكل</h2>
            <p>
              إذا صادفت شيئاً مشبوهاً — إعلان احتيالي، سلوك مسيء، أو
              أي شيء لا يبدو صحيحاً — راسلنا على{" "}
              <a href="mailto:help@boostmarket.app" className="text-violet-400 hover:underline">
                help@boostmarket.app
              </a>. نراجع كل بلاغ يدوياً.
            </p>
          </div>

          <div className="pt-4 border-t border-white/[0.15]">
            <p className="text-zinc-500 text-sm">
              لسنا مثاليين، ولا يمكن لأي منصة منع كل شخص سيء. لكننا ننتبه
              ونحسن الأمور باستمرار.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
