import Link from "next/link";
import { Star, Shield, Zap, Users, Trophy, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* قسم البطل — خلفية متدرجة للعمق */}
      <section className="relative pt-20 pb-24 lg:pt-28 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/8 rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-violet-400 text-sm font-medium tracking-wide uppercase mb-5">
              موثوق من أكثر من 50,000 لاعب
            </p>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
              تصنيفك. <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">معززونا.</span>
            </h1>
            
            <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto leading-relaxed">
              ابحث عن محترفين موثقين يساعدونك في تسلق التصنيفات في ألعابك المفضلة. سرعة في التنفيذ، نتائج حقيقية، وحماية للمشتري في كل طلب.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/services">
                <Button size="lg" className="px-8 py-6 text-base">
                  تصفح العروض
                  <ArrowRight className="w-4 h-4 me-1 rotate-180" />
                </Button>
              </Link>
              <Link href="/create-offer">
                <Button size="lg" variant="outline" className="px-8 py-6 text-base">
                  ابدأ البيع
                </Button>
              </Link>
            </div>
          </div>

          {/* إشارات الثقة */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-16 text-sm text-zinc-500">
            {[
              "جميع الألعاب الرئيسية",
              "حماية المشتري",
              "متوسط التسليم < 24 ساعة",
              "دردشة مباشرة مع المعززين",
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-violet-500" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* قسم لماذا */}
      <section className="py-20 section-alt">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">لماذا يختار الناس بوست ماركت</h2>
            <p className="text-zinc-500">ليس الأكثر بهرجة — فقط الأكثر موثوقية.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { icon: Shield, title: "حماية المشتري", desc: "المدفوعات محفوظة حتى تؤكد أن التعزيز تم بنجاح." },
              { icon: Star, title: "معززون موثقون", desc: "كل بائع يتم مراجعته يدوياً. لا بوتات، لا محتالين." },
              { icon: Zap, title: "تنفيذ سريع", desc: "معظم الطلبات تبدأ خلال ساعة. تتبع التقدم في الوقت الفعلي." },
              { icon: Trophy, title: "ضمان استرداد المال", desc: "غير راضٍ؟ سنعيد لك أموالك — بدون مشاكل." },
            ].map((feature, index) => (
              <div key={index} className="solid-card rounded-xl p-5 card-hover">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1.5">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* الألعاب الشائعة */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">الألعاب الشائعة</h2>
              <p className="text-sm text-zinc-500 mt-1">انطلق فيما هو رائج</p>
            </div>
            <Link href="/services" className="text-sm text-violet-400 hover:text-violet-300 hidden sm:block transition-colors">
              عرض الكل ←
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: "ليق أوف ليجندز", abbr: "LoL", bg: "from-amber-600/20 to-amber-900/30" },
              { name: "فالورانت", abbr: "VAL", bg: "from-red-500/20 to-red-900/30" },
              { name: "CS2", abbr: "CS2", bg: "from-orange-500/20 to-orange-900/30" },
              { name: "دوتا 2", abbr: "D2", bg: "from-rose-500/20 to-rose-900/30" },
              { name: "أوفرواتش 2", abbr: "OW2", bg: "from-orange-400/15 to-orange-800/30" },
              { name: "أبيكس ليجندز", abbr: "APX", bg: "from-red-500/15 to-red-900/30" },
            ].map((game, index) => (
              <Link href={`/services?game=${game.name.toUpperCase().replace(/\s+/g, '_').replace('2', '')}`} key={index}>
                <div className={`bg-gradient-to-br ${game.bg} rounded-xl p-4 aspect-[4/3] flex flex-col justify-between border border-white/[0.06] hover:border-white/[0.12] transition-all cursor-pointer group hover:scale-[1.02]`}>
                  <span className="text-2xl font-bold text-white/15 group-hover:text-white/25 transition-colors">{game.abbr}</span>
                  <span className="text-sm font-medium text-zinc-300">{game.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* كيف يعمل */}
      <section className="py-20 section-alt">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">ثلاث خطوات. هذا كل شيء.</h2>
            <p className="text-zinc-500">بدون تعقيدات، بدون رسوم خفية.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { step: "1", title: "اختر خدمة", desc: "تصفح العروض من معززين موثقين عبر جميع الألعاب المدعومة." },
              { step: "2", title: "ادفع بأمان", desc: "أكمل الطلب مع حماية المشتري — أموالك محفوظة حتى التسليم." },
              { step: "3", title: "شاهد النتيجة", desc: "تتبع التقدم مباشرة وتحدث مع المعزز في الوقت الفعلي." },
            ].map((item, index) => (
              <div key={index} className="text-center solid-card rounded-xl p-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-b from-violet-500 to-violet-700 text-white text-sm font-bold flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-600/20">
                  {item.step}
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* دعوة للعمل */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-violet-950/15 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 mb-5">
              <Users className="w-4 h-4" />
              <span>انضم لآلاف اللاعبين الذين يرفعون تصنيفهم</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">مستعد للصعود؟</h2>
            <p className="text-zinc-400 mb-8">
              أنشئ حساباً مجانياً وتصفح العروض في أقل من دقيقة.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register">
                <Button size="lg" className="px-8 py-6 text-base">
                  ابدأ الآن — مجاناً
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="px-8 py-6 text-base">
                  استكشف الخدمات
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
