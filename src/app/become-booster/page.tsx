"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export default function BecomeBoosterPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-transparent" dir="rtl">
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">صِر بوستر على BoostMarket</h1>
          <p className="text-zinc-500 text-sm mb-10">إذا كنت جيداً في الألعاب التنافسية، يمكنك كسب المال من ذلك.</p>

          <div className="space-y-8 text-[15px] leading-relaxed text-zinc-400">
            <p>
              BoostMarket هو سوق. تعرض خدماتك، وتحدد أسعارك الخاصة، وتعمل وفق
              جدولك الخاص. نحن نتولى المدفوعات، ونوفر نظام دردشة، ونجلب المشترين.
              أنت تقدم المهارة.
            </p>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">كيف يعمل للبائعين</h2>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white/[0.06] text-zinc-300 flex items-center justify-center text-xs font-bold">1</span>
                  <div>
                    <span className="text-white font-medium">أنشئ حساباً مجانياً.</span>{" "}
                    يستغرق أقل من دقيقة. لا عملية موافقة ولا رسوم مقدمة.
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white/[0.06] text-zinc-300 flex items-center justify-center text-xs font-bold">2</span>
                  <div>
                    <span className="text-white font-medium">أدرج خدماتك.</span>{" "}
                    اختر لعبة، واصف ما تقدمه (تعزيز رتبة، تدريب، إنجازات)،
                    حدد سعراً، وانشر. يمكنك إنشاء أي عدد تريده من الإعلانات.
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white/[0.06] text-zinc-300 flex items-center justify-center text-xs font-bold">3</span>
                  <div>
                    <span className="text-white font-medium">اقبل الطلبات وسلّم.</span>{" "}
                    عندما يشتري شخص ما خدمتك، تحصل على إشعار. تحدث مع المشتري،
                    أنجز العمل، وحدده كمكتمل. يتم إصدار الدفع بعد تأكيد المشتري.
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">ما نأخذه</h2>
              <p>
                رسوم منصة صغيرة على كل طلب مكتمل. هكذا نبقي الأضواء مضاءة.
                لا رسوم إدراج، لا اشتراكات شهرية، ولا رسوم مخفية.
                أنت تدفع فقط عندما تكسب.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">ما يجعل البائعين ناجحين هنا</h2>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="text-zinc-600"></span>
                  <span>أوصاف واضحة وصادقة لما تقدمه والمدة التي يستغرقها</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-zinc-600"></span>
                  <span>أسعار تنافسية (تحقق مما يتقاضاه الآخرون مقابل خدمات مماثلة)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-zinc-600"></span>
                  <span>ردود سريعة على الرسائل — المشترون يلاحظون</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-zinc-600"></span>
                  <span>التسليم في الوقت المحدد أو التواصل مبكراً إذا كان هناك تأخير</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-zinc-600"></span>
                  <span>بناء التقييمات — طلباتك الأولى هي الأهم</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">ملاحظة حول التوقعات</h2>
              <p>
                هذا ليس دخلاً سلبياً. التعزيز يتطلب وقتاً وجهداً حقيقيين. البائعون الذين
                يبلون حسناً هنا يعاملونه كعمل (أو على الأقل كعمل جانبي جاد). إذا كنت
                تبحث عن إدراج شيء ونسيانه، فهذا على الأرجح ليس لك.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/[0.06]">
            <Link href={user ? "/create-offer" : "/register"}>
              <Button size="lg">
                {user ? "أنشئ إعلانك الأول" : "أنشئ حساباً"}
                <ArrowRight className="w-4 h-4 mr-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
