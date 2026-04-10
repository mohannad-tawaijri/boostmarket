"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-transparent py-16" dir="rtl">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-zinc-400 hover:text-white">
            <ArrowRight className="w-4 h-4 ms-2" />
            العودة للرئيسية
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">شروط الخدمة</h1>
        <p className="text-sm text-zinc-500 mb-10">آخر تحديث: فبراير 2026</p>
        
        <div className="space-y-8 text-[15px] leading-relaxed text-zinc-400">
          <p>
            هذه الشروط هي الاتفاقية بينك وبين BoostMarket. باستخدام الموقع، فإنك توافق عليها. إذا لم توافق، فلا بأس — فقط لا تستخدم المنصة.
          </p>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">ما هو BoostMarket</h2>
            <p>
              نحن سوق. يعرض البائعون خدمات التعزيز، ويشتريها المشترون، ونحن نسهل المعاملة. نحن لسنا من يقوم بالتعزيز — البائعون الأفراد هم من يفعل. فكر بنا كمنصة تربط الطرفين وتتولى الدفع بينهما.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">حسابك</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>استخدم معلومات حقيقية عند التسجيل. الحسابات المزيفة تُزال.</li>
              <li>أنت مسؤول عن الحفاظ على أمان كلمة المرور. ننصح بشيء فريد.</li>
              <li>حساب واحد لكل شخص. لا تنشئ حسابات متعددة للتلاعب بنظام التقييمات أو التهرب من الحظر.</li>
              <li>يجب أن يكون عمرك 18 عاماً على الأقل (أو السن القانوني في بلدك) لاستخدام BoostMarket.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">للمشترين</h2>
            <p className="mb-3">
              عند تقديم طلب، نحتفظ بالدفع حتى يسلم البائع. إذا حدث خطأ ما — لم يسلم البائع، أو النتيجة لم تكن كما وُعد — يمكنك فتح نزاع وسنراجعه.
            </p>
            <p>
              الاسترداد ليس تلقائياً. ننظر في كل حالة بشكل فردي. إذا سلم البائع ما هو مدرج وغيرت رأيك فقط، فهذا عموماً ليس سبباً للاسترداد.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">للبائعين</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>أدرج خدماتك بصدق. لا تعد بأشياء لا تستطيع تقديمها.</li>
              <li>سلّم ضمن الإطار الزمني الذي حددته. إذا احتجت وقتاً أكثر، تواصل مع المشتري.</li>
              <li>كن متجاوباً. المشترون الذين لا يستطيعون الوصول إليك سيفتحون نزاعات، وهذا سيء للجميع.</li>
              <li>نأخذ رسوم منصة صغيرة من كل طلب مكتمل. النسبة المحددة تظهر قبل الإدراج.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">أشياء لا يمكنك فعلها</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>الاحتيال أو الغش أو خداع المستخدمين الآخرين</li>
              <li>استخدام المنصة لأي شيء غير قانوني</li>
              <li>مضايقة المستخدمين الآخرين عبر الدردشة أو التقييمات</li>
              <li>محاولة نقل المعاملات خارج المنصة لتجنب الرسوم</li>
              <li>استخدام الروبوتات أو البرامج النصية أو الأتمتة للتفاعل مع الموقع</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">المسؤولية</h2>
            <p>
              نبذل قصارى جهدنا للحفاظ على تشغيل المنصة بسلاسة، لكن لا يمكننا ضمان وقت تشغيل 100% أو أن كل بائع سيكون مثالياً. نحن سوق، لسنا شركة تأمين. استخدم المنصة بتقديرك الخاص، خاصة عندما يتعلق الأمر بمشاركة بيانات حسابات الألعاب.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">التغييرات على هذه الشروط</h2>
            <p>
              قد نحدث هذه الشروط أحياناً. إذا أجرينا تغييرات جوهرية، سنعلمك عبر البريد الإلكتروني أو إشعار على الموقع. الاستمرار في الاستخدام بعد التغييرات يعني قبولك لها.
            </p>
          </div>

          <div className="pt-4 border-t border-white/[0.15]">
            <p className="text-zinc-500 text-sm">
              أسئلة؟ <a href="mailto:help@boostmarket.app" className="text-violet-400 hover:underline">help@boostmarket.app</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
