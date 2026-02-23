import Link from "next/link";
import Logo from "./logo";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#0c0c10] to-[#08080b] border-t border-white/[0.05]">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* معلومات الشركة */}
          <div>
            <div className="mb-3">
              <Logo size="sm" />
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">
              سوق يربط اللاعبين ببوسترز موثوقين. بسيط، آمن، وشفاف.
            </p>
          </div>

          {/* روابط سريعة */}
          <div>
            <h4 className="text-zinc-300 font-medium text-sm mb-4">المنتج</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/services" className="text-zinc-500 hover:text-zinc-300 transition-colors">تصفح الخدمات</Link></li>
              <li><Link href="/how-it-works" className="text-zinc-500 hover:text-zinc-300 transition-colors">كيف يعمل</Link></li>
              <li><Link href="/become-booster" className="text-zinc-500 hover:text-zinc-300 transition-colors">كن بوستر</Link></li>
              <li><Link href="/about" className="text-zinc-500 hover:text-zinc-300 transition-colors">من نحن</Link></li>
            </ul>
          </div>

          {/* الدعم */}
          <div>
            <h4 className="text-zinc-300 font-medium text-sm mb-4">الدعم</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/help" className="text-zinc-500 hover:text-zinc-300 transition-colors">مركز المساعدة</Link></li>
              <li><Link href="/contact" className="text-zinc-500 hover:text-zinc-300 transition-colors">اتصل بنا</Link></li>
              <li><Link href="/faq" className="text-zinc-500 hover:text-zinc-300 transition-colors">الأسئلة الشائعة</Link></li>
              <li><Link href="/trust-safety" className="text-zinc-500 hover:text-zinc-300 transition-colors">الثقة والأمان</Link></li>
            </ul>
          </div>

          {/* قانوني */}
          <div>
            <h4 className="text-zinc-300 font-medium text-sm mb-4">قانوني</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/terms" className="text-zinc-500 hover:text-zinc-300 transition-colors">شروط الخدمة</Link></li>
              <li><Link href="/privacy" className="text-zinc-500 hover:text-zinc-300 transition-colors">سياسة الخصوصية</Link></li>
              <li><Link href="/cookies" className="text-zinc-500 hover:text-zinc-300 transition-colors">ملفات تعريف الارتباط</Link></li>
              <li><Link href="/disclaimer" className="text-zinc-500 hover:text-zinc-300 transition-colors">إخلاء المسؤولية</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06] mt-10 pt-6 text-xs text-center text-zinc-600">
          <p>&copy; {new Date().getFullYear()} بوست ماركت. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
