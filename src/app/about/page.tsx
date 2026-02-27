import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-transparent" dir="rtl">
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">عن BoostMarket</h1>
          <p className="text-zinc-500 text-sm mb-10">النسخة المختصرة عن من نحن ولماذا بنينا هذا.</p>
          
          <div className="space-y-8 text-[15px] leading-relaxed text-zinc-400">
            <p>
              بدأ BoostMarket لأننا سئمنا من رسائل Discord المشبوهة ومنشورات المنتديات العشوائية
              في كل مرة أردنا فيها تعزيز رتبة. لا إيصالات، لا مساءلة، لا طريقة لمعرفة ما إذا كان
              الشخص على الطرف الآخر جيداً أو حتى حقيقياً.
            </p>

            <p>
              لذلك بنينا سوقاً حقيقياً. سوق يمكن فيه للبوسترز عرض خدماتهم بأسعار واضحة،
              ويمكن للمشترين قراءة التقييمات الحقيقية قبل الالتزام، ولدى الجميع محادثة
              وسجل طلبات للرجوع إليه إذا حدث خطأ ما.
            </p>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">ما نفعله فعلاً</h2>
              <p>
                نحن منصة. يجد المشترون البوسترز، ويقدمون الطلبات، ويدفعون من خلالنا. يقوم البوستر
                بالعمل، ويؤكد المشتري، ويحصل البوستر على أجره. نحتفظ بالأموال
                بينهما للحفاظ على نزاهة الطرفين. إذا كان هناك نزاع، نتدخل.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">ما لا نفعله</h2>
              <p>
                نحن لا نوظف البوسترز. نحن لا نعزز الحسابات بأنفسنا. نحن لا نضمن
                نتائج محددة — الألعاب غير متوقعة، وكذلك أنظمة الرتب. ما نضمنه
                هو أن البائعين على منصتنا لديهم تقييمات وسجل طلبات وسمعة حقيقية.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">كيف نجني المال</h2>
              <p>
                نأخذ رسوماً صغيرة على كل معاملة. هذا كل شيء. لا مستويات بائعين مميزة، لا
                مخططات إعلانات مدفوعة للترتيب، لا إعلانات. السوق يعمل لأن البوسترز الجيدين
                يحصلون على تقييمات جيدة ويرتفعون إلى القمة بشكل طبيعي.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">الفريق</h2>
              <p>
                نحن مجموعة صغيرة من الأشخاص الذين يلعبون ألعاباً تنافسية وسئموا من
                الخيارات الموجودة. بعضنا كان على كلا الجانبين — شراء التعزيزات وبيعها.
                هذا المنظور يشكل طريقة بنائنا للمنصة.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4">
            <Link href="/services">
              <Button>تصفح الخدمات</Button>
            </Link>
            <Link href="/become-booster">
              <Button variant="outline">البيع على BoostMarket</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
