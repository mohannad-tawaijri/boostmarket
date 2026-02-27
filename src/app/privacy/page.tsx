"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-transparent py-16" dir="rtl">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-zinc-400 hover:text-white">
            <ArrowRight className="w-4 h-4 ms-2" />
            العودة للرئيسية
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">سياسة الخصوصية</h1>
        <p className="text-sm text-zinc-500 mb-10">آخر تحديث: فبراير 2026</p>
        
        <div className="space-y-8 text-[15px] leading-relaxed text-zinc-400">
          <p>
            نعلم أن سياسات الخصوصية عادة ما تكون جدران نصية لا يقرأها أحد. سنحاول إبقاء هذه مختصرة ومكتوبة بلغة واضحة.
          </p>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">ما نجمعه</h2>
            <p className="mb-3">
              عند التسجيل، نخزن عنوان بريدك الإلكتروني واسم العرض ونسخة مشفرة من كلمة المرور (لا نرى الأصلية أبداً). إذا اشتريت أو بعت شيئاً، نحتفظ أيضاً بسجلات المعاملات — المبالغ والتواريخ والحسابات المعنية.
            </p>
            <p>
              نجمع تحليلات أساسية (الصفحات المزارة، الموقع التقريبي من عنوان IP الخاص بك، نوع الجهاز) لفهم كيفية استخدام الناس للموقع. نحن لا نتتبع بصمتك الرقمية ولا نبني ملفات إعلانية.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">كيف نستخدمها</h2>
            <ul className="space-y-2 list-disc list-inside text-zinc-400">
              <li>لتشغيل حسابك ومعالجة الطلبات</li>
              <li>لإرسال تحديثات الطلبات والإيصالات (ليس رسائل تسويقية مزعجة)</li>
              <li>للتحقيق في النزاعات إذا حدث خطأ بين المشتري والبائع</li>
              <li>لاكتشاف الاحتيال والحفاظ على أمان المنصة</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">من يرى بياناتك</h2>
            <p className="mb-3">نحن لا نبيع بياناتك. نقطة. نشارك الحد الأدنى مع:</p>
            <ul className="space-y-2 list-disc list-inside text-zinc-400">
              <li><strong className="text-zinc-300">معالج الدفع لدينا</strong> — يحتاجون لتفاصيل الدفع الخاصة بك لتحصيل الرسوم (نحن لا نخزن أرقام البطاقات أبداً)</li>
              <li><strong className="text-zinc-300">مزودو الاستضافة</strong> — خوادمنا تعمل على بنية تحتية لطرف ثالث، لذا تقنياً يمكنهم الوصول للبيانات، رغم أنه ليس لديهم سبب لذلك</li>
              <li><strong className="text-zinc-300">جهات إنفاذ القانون</strong> — فقط إذا كان مطلوباً قانونياً، وسنعارض الطلبات الواسعة بشكل مفرط</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">ملفات تعريف الارتباط</h2>
            <p>
              نستخدم ملف تعريف ارتباط للجلسة لإبقائك مسجل الدخول وبعض ملفات تعريف الارتباط التحليلية. لا متتبعات إعلانية من طرف ثالث. انظر <Link href="/cookies" className="text-violet-400 hover:underline">سياسة ملفات تعريف الارتباط</Link> للتفاصيل الكاملة.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">حقوقك</h2>
            <p>
              يمكنك تنزيل أو حذف بياناتك في أي وقت. راسلنا على <a href="mailto:privacy@boostmarket.com" className="text-violet-400 hover:underline">privacy@boostmarket.com</a> وسنتعامل مع الأمر خلال أيام عمل قليلة. إذا كنت في الاتحاد الأوروبي، لديك مجموعة حقوق GDPR الكاملة — الوصول، التصحيح، المحو، النقل، وكل شيء.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">الأمان</h2>
            <p>
              كلمات المرور مشفرة بـ bcrypt، والاتصالات مشفرة بـ TLS، ونستخدم مصادقة قائمة على الرموز. لا يوجد نظام محصن تماماً، لكننا نتخذ احتياطات معقولة وسنُخطر المستخدمين المتأثرين فوراً في حال حدوث أي اختراق.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-zinc-500 text-sm">
              أسئلة؟ تواصل معنا على <a href="mailto:privacy@boostmarket.com" className="text-violet-400 hover:underline">privacy@boostmarket.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
