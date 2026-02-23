"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const faqs = [
  {
    question: "كيف يعمل BoostMarket؟",
    answer: "هو سوق. يعرض البائعون خدمات التعزيز (تعزيز الرتب، التدريب، الإنجازات، إلخ) ويحددون أسعارهم الخاصة. يتصفح المشترون، ويختارون بائعاً، ويقدمون طلباً. نحتفظ بالدفع حتى يتم تسليم الخدمة وتأكيدها. فكر بنا كوسيط يحافظ على نزاهة الطرفين."
  },
  {
    question: "هل التعزيز آمن لحساب لعبتي؟",
    answer: "يعتمد على اللعبة ونوع الخدمة. اللعب الثنائي والتدريب لا يحتاجان أبداً لبيانات تسجيل دخولك. خدمات مشاركة الحساب تحمل مخاطر أكبر — سواء من وصول البوستر لحسابك أو من احتمال رصد ناشر اللعبة لنشاط غير عادي. لا يمكننا ضمان أن حسابك لن يواجه عواقب من مطور اللعبة. هذا قرار عليك أن تزنه بنفسك."
  },
  {
    question: "كيف أصير بوستر؟",
    answer: "أنشئ حساباً مجانياً، ثم اذهب إلى \"إنشاء عرض\" لإدراج خدمتك الأولى. لا توجد عملية موافقة — يمكنك البدء فوراً. ومع ذلك، سينظر المشترون إلى تقييماتك وملفك الشخصي قبل الطلب، لذا ابذل جهداً في أوصاف إعلاناتك وسلّم ما تعد به."
  },
  {
    question: "ما طرق الدفع التي تقبلونها؟",
    answer: "بطاقات الائتمان والخصم الرئيسية عبر معالج الدفع لدينا. نحن لا نتعامل مع معلومات الدفع مباشرة — تمر عبر مزود طرف ثالث مشفر."
  },
  {
    question: "كيف يعمل الاسترداد؟",
    answer: "إذا لم يسلم البوستر ما تم الوعد به، يمكنك فتح نزاع من صفحة طلبك. يراجع فريقنا سجل الدردشة وتفاصيل الطلب وأي أدلة من كلا الطرفين. حسب الحالة، قد نصدر استرداداً جزئياً أو كاملاً. لا نقوم باسترداد تلقائي — كل حالة تُراجع بشكل فردي."
  },
  {
    question: "هل يمكنني التحدث مع البوستر قبل الطلب؟",
    answer: "نعم. كل إعلان يحتوي على خيار دردشة. ننصح فعلاً بمراسلة البوستر أولاً لمناقشة التفاصيل — الجداول الزمنية، تفضيلات الأبطال، جدول اللعب، أي شيء يهم لطلبك."
  },
  {
    question: "كم يستغرق التعزيز عادة؟",
    answer: "يختلف. كل إعلان يعرض وقت تسليم تقديري. تعزيز قسم واحد قد يستغرق يوماً؛ صعود رتبة كامل قد يستغرق أسبوعاً أو أكثر. يمكن للبوستر إعطاؤك تقديراً أفضل بمجرد معرفة نقطة البداية."
  },
  {
    question: "ماذا يحدث إذا اختفى البوستر؟",
    answer: "إذا توقف البوستر عن الرد أو فشل في التسليم خلال وقت معقول، افتح نزاعاً. سنحقق ويمكننا إعادة تعيين أو استرداد الطلب. البوسترز الذين يتخلون عن الطلبات يتم الإبلاغ عنهم ويُزالون في النهاية من المنصة."
  }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/[0.06]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-start justify-between text-left group"
      >
        <span className="font-medium text-zinc-200 group-hover:text-white transition-colors pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-zinc-500 flex-shrink-0 mt-0.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="pb-5">
          <p className="text-zinc-400 text-[15px] leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-transparent py-16" dir="rtl">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-zinc-400 hover:text-white">
            <ArrowRight className="w-4 h-4 ms-2" />
            العودة للرئيسية
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">المساعدة</h1>
        <p className="text-zinc-500 text-sm mb-10">عندك سؤال؟ الجواب هنا.</p>

        <div className="mb-12">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="pt-6 border-t border-white/[0.06]">
          <p className="text-zinc-400 text-[15px] mb-1">
            ما لقيت جوابك؟
          </p>
          <p className="text-zinc-500 text-sm">
            راسلنا على{" "}
            <a href="mailto:support@boostmarket.com" className="text-violet-400 hover:underline">
              support@boostmarket.com
            </a>{" "}
            ونرد عليك خلال 24 ساعة.
          </p>
        </div>
      </div>
    </div>
  );
}
