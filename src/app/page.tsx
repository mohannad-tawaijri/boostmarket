import Link from "next/link";
import Image from "next/image";
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
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
              اختر خدمتك، <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">وخل الباقي علينا</span>
            </h1>
            
            <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto leading-relaxed">
              محترفين موثقين يوصلونك للرانك اللي تبيه. تنفيذ سريع، نتائج مضمونة، وفلوسك محمية لين تستلم.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/services">
                <Button size="lg" className="px-8 py-6 text-base">
                  استعرض الخدمات
                  <ArrowRight className="w-4 h-4 me-1 rotate-180" />
                </Button>
              </Link>
              <Link href="/create-offer">
                <Button size="lg" variant="outline" className="px-8 py-6 text-base">
                  قدّم خدماتك
                </Button>
              </Link>
            </div>
          </div>

          {/* إشارات الثقة */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-16 text-sm text-zinc-500">
            {[
              "ندعم جميع الألعاب",
              "فلوسك محمية",
              "التسليم خلال 24 ساعة",
              "تواصل مباشر مع البوستر",
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
            <h2 className="text-3xl font-bold text-white mb-3">ليش BoostMarket؟</h2>
            <p className="text-zinc-500">ما نبيع كلام — نبيع ثقة.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { icon: Shield, title: "فلوسك بأمان", desc: "ما ندفع للبوستر إلا بعد ما تأكد إن الشغل تم." },
              { icon: Star, title: "بوسترز محترفين", desc: "كل بوستر يمر بمراجعة. بدون بوتات، بدون نصب." },
              { icon: Zap, title: "بداية فورية", desc: "أغلب الطلبات تبدأ خلال ساعة مع متابعة لحظية." },
              { icon: Trophy, title: "استرجاع مضمون", desc: "مو راضي؟ نرجع لك فلوسك بدون أي تعقيد." },
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
              <h2 className="text-2xl font-bold text-white">أشهر الألعاب</h2>
              <p className="text-sm text-zinc-500 mt-1">اختر لعبتك وابدأ</p>
            </div>
            <Link href="/services" className="text-sm text-violet-400 hover:text-violet-300 hidden sm:block transition-colors">
              شوف الكل ←
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: "League of Legends", key: "LEAGUE_OF_LEGENDS", img: "/games/league-of-legends.svg" },
              { name: "Valorant", key: "VALORANT", img: "/games/valorant.svg" },
              { name: "CS2", key: "CS2", img: "/games/cs2.svg" },
              { name: "Dota 2", key: "DOTA2", img: "/games/dota2.svg" },
              { name: "Overwatch 2", key: "OVERWATCH", img: "/games/overwatch2.svg" },
              { name: "Apex Legends", key: "APEX_LEGENDS", img: "/games/apex-legends.svg" },
              { name: "Fortnite", key: "FORTNITE", img: "/games/fortnite.svg" },
              { name: "Rocket League", key: "ROCKET_LEAGUE", img: "/games/rocket-league.svg" },
              { name: "Call of Duty: Warzone", key: "COD_WARZONE", img: "/games/warzone.svg" },
              { name: "PUBG", key: "PUBG", img: "/games/pubg.svg" },
            ].map((game, index) => (
              <Link href={`/services?game=${game.key}`} key={index}>
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] border border-white/[0.15] hover:border-white/[0.15] transition-all cursor-pointer group hover:scale-[1.03] hover:shadow-lg hover:shadow-violet-500/10">
                  {/* صورة اللعبة */}
                  <Image
                    src={game.img}
                    alt={game.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* تدرج للقراءة */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {/* اسم اللعبة */}
                  <div className="absolute bottom-0 right-0 left-0 p-3">
                    <span className="text-sm font-semibold text-white drop-shadow-lg">{game.name}</span>
                  </div>
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
            <h2 className="text-3xl font-bold text-white mb-3">3 خطوات بس.</h2>
            <p className="text-zinc-500">بدون تعقيد، بدون رسوم مخفية.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { step: "1", title: "اختر خدمتك", desc: "تصفح عروض البوسترز في جميع الألعاب واختر اللي يناسبك." },
              { step: "2", title: "ادفع بأمان", desc: "فلوسك تنحفظ عندنا لين البوستر ينهي الشغل." },
              { step: "3", title: "استلم النتيجة", desc: "تابع التقدم لحظة بلحظة وتواصل مع البوستر مباشرة." },
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
              <span>آلاف اللاعبين رفعوا رانكهم معنا</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">جاهز ترفع رانكك؟</h2>
            <p className="text-zinc-400 mb-8">
              سجّل مجاناً وابدأ خلال دقيقة.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register">
                <Button size="lg" className="px-8 py-6 text-base">
                  سجّل الآن — مجاناً
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="px-8 py-6 text-base">
                  تصفح الخدمات
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
