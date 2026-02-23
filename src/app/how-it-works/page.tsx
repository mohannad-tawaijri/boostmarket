import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-transparent" dir="rtl">
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">كيف يعمل</h1>
          <p className="text-zinc-500 text-sm mb-10">من إيجاد بوستر إلى الحصول على رتبتك — إليك المسار الكامل.</p>

          <div className="space-y-10 text-[15px] leading-relaxed text-zinc-400">

            {/* الخطوة 1 */}
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center text-sm font-bold mt-0.5">1</div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">تصفح السوق</h2>
                <p>
                  توجه إلى صفحة الخدمات وقم بالتصفية حسب اللعبة أو نطاق الرتبة أو السعر. كل إعلان
                  يوضح ما يقدمه البوستر، والمدة المعتادة، وما اعتقده المشترون السابقون
                  عنهم. لا تخمين.
                </p>
              </div>
            </div>

            {/* الخطوة 2 */}
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center text-sm font-bold mt-0.5">2</div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">راسل البوستر</h2>
                <p>
                  قبل الشراء، يمكنك الدردشة مع البوستر مباشرة. اسأل عن طريقته،
                  وأكد الجداول الزمنية، أو ناقش التفاصيل مثل تفضيلات الأبطال أو جدول اللعب.
                  هذه ليست آلة بيع — أنت توظف شخصاً.
                </p>
              </div>
            </div>

            {/* الخطوة 3 */}
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center text-sm font-bold mt-0.5">3</div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">قدم طلبك</h2>
                <p>
                  عندما تكون مستعداً، قدم الطلب وادفع عبر BoostMarket. يتم الاحتفاظ بمدفوعاتك
                  بأمان حتى يتم إنجاز العمل — لا يحصل البوستر على أجره حتى تؤكد
                  التسليم (أو حتى تنتهي فترة الإصدار التلقائي).
                </p>
              </div>
            </div>

            {/* الخطوة 4 */}
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center text-sm font-bold mt-0.5">4</div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">تابع التقدم</h2>
                <p>
                  بمجرد أن يبدأ البوستر، يمكنك المتابعة من لوحة التحكم الخاصة بك. معظم البوسترز
                  يرسلون تحديثات عبر الدردشة. إذا شعرت بأي شيء غير طبيعي، يمكنك الإيقاف أو فتح نزاع
                  في أي وقت.
                </p>
              </div>
            </div>

            {/* الخطوة 5 */}
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center text-sm font-bold mt-0.5">5</div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">أكد وقيّم</h2>
                <p>
                  عند اكتمال التعزيز، أكد التسليم واترك تقييماً. الملاحظات الصادقة
                  تساعد المشترين الآخرين وتكافئ البوسترز الذين يقومون بعمل جيد.
                </p>
              </div>
            </div>

            {/* أسئلة شائعة */}
            <div className="pt-6 border-t border-white/[0.06] space-y-6">
              <h2 className="text-lg font-semibold text-white">أسئلة شائعة</h2>

              <div>
                <h3 className="font-medium text-zinc-300 mb-1">هل حسابي آمن؟</h3>
                <p>
                  يعتمد على الخدمة. بعض التعزيزات (مثل التدريب أو اللعب الثنائي) لا تحتاج
                  أبداً لبيانات تسجيل دخولك. والبعض الآخر يحتاج. إذا شاركت بياناتك، غيّر كلمة المرور بعدها
                  وفعّل التحقق بخطوتين. ننصح أيضاً باختيار بوسترز لديهم سجل تقييمات قوي.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-zinc-300 mb-1">كم يستغرق الأمر؟</h3>
                <p>
                  يختلف حسب الخدمة. كل إعلان يحتوي على وقت تسليم تقديري. تعزيز قسم واحد
                  قد يستغرق يوماً أو يومين؛ صعود كامل قد يستغرق أسبوعاً. سيعطيك البوستر
                  تقديراً أكثر تحديداً بمجرد رؤية حسابك.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-zinc-300 mb-1">ماذا لو حدث خطأ ما؟</h3>
                <p>
                  افتح نزاعاً من صفحة طلبك. يراجع فريق الدعم لدينا الوضع
                  ويمكنه إصدار استرداد جزئي أو كامل حسب ما حدث. نحن لا
                  ننحاز لطرف واحد فقط — ننظر في سجلات الدردشة وتفاصيل الطلب
                  وأدلة التسليم.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/[0.06]">
            <Link href="/services">
              <Button>تصفح الخدمات</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
