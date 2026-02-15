import Link from "next/link";
import { Star, Shield, Zap, Users, Trophy, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#111114]">
      {/* Hero Section — clean, confident, no animated blobs */}
      <section className="pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-violet-400 text-sm font-medium tracking-wide uppercase mb-5">
              Trusted by 50,000+ gamers
            </p>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
              Your rank. <br className="hidden sm:block" />
              <span className="text-violet-400">Our boosters.</span>
            </h1>
            
            <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto leading-relaxed">
              Find verified pros who'll help you climb the ranks in the games you love. Fast turnaround, real results, buyer protection on every order.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/services">
                <Button size="lg" className="px-8 py-6 text-base">
                  Browse Offers
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="/create-offer">
                <Button size="lg" variant="outline" className="px-8 py-6 text-base">
                  Start Selling
                </Button>
              </Link>
            </div>
          </div>

          {/* Trust signals — simple row, not flashy pills */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-16 text-sm text-zinc-500">
            {[
              "All major titles",
              "Buyer protection",
              "Avg. delivery < 24h",
              "Direct chat with boosters",
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-violet-500" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Why section — honest, not salesy */}
      <section className="py-20 border-t border-zinc-800/60">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Why people choose BoostMarket</h2>
            <p className="text-zinc-400">Not the flashiest — just the most reliable.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {[
              { icon: Shield, title: "Buyer protection", desc: "Payments held in escrow until you confirm the boost is done." },
              { icon: Star, title: "Verified boosters", desc: "Every seller is manually reviewed. No bots, no scammers." },
              { icon: Zap, title: "Fast turnaround", desc: "Most orders start within an hour. Track progress in real time." },
              { icon: Trophy, title: "Money-back guarantee", desc: "Not happy? We'll refund you — no drama, no hassle." },
            ].map((feature, index) => (
              <div key={index} className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/60 hover:border-zinc-700 transition-colors">
                <feature.icon className="w-5 h-5 text-violet-400 mb-3" />
                <h3 className="text-base font-semibold text-white mb-1.5">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Games — cleaner grid */}
      <section className="py-20 border-t border-zinc-800/60">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Popular games</h2>
              <p className="text-sm text-zinc-500 mt-1">Jump into what's trending</p>
            </div>
            <Link href="/services" className="text-sm text-violet-400 hover:text-violet-300 hidden sm:block">
              View all →
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: "League of Legends", abbr: "LoL", bg: "bg-amber-900/40" },
              { name: "Valorant", abbr: "VAL", bg: "bg-red-900/40" },
              { name: "CS2", abbr: "CS2", bg: "bg-orange-900/40" },
              { name: "Dota 2", abbr: "D2", bg: "bg-rose-900/40" },
              { name: "Overwatch 2", abbr: "OW2", bg: "bg-orange-800/40" },
              { name: "Apex Legends", abbr: "APX", bg: "bg-red-800/40" },
            ].map((game, index) => (
              <Link href={`/services?game=${game.name.toUpperCase().replace(/\s+/g, '_').replace('2', '')}`} key={index}>
                <div className={`${game.bg} rounded-xl p-4 aspect-[4/3] flex flex-col justify-between border border-zinc-800/40 hover:border-zinc-700 transition-colors cursor-pointer group`}>
                  <span className="text-2xl font-bold text-white/20 group-hover:text-white/30 transition-colors">{game.abbr}</span>
                  <span className="text-sm font-medium text-zinc-300">{game.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — clean steps */}
      <section className="py-20 border-t border-zinc-800/60">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Three steps. That's it.</h2>
            <p className="text-zinc-400">No signup hoops, no hidden fees.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { step: "1", title: "Pick a service", desc: "Browse offers from verified boosters across all supported games." },
              { step: "2", title: "Pay securely", desc: "Checkout with buyer protection — your payment is held until delivery." },
              { step: "3", title: "Watch it happen", desc: "Track progress live and chat directly with your booster." },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-9 h-9 rounded-full bg-violet-600/15 text-violet-400 text-sm font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — calm and confident, not aggressive */}
      <section className="py-20 border-t border-zinc-800/60">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 mb-5">
              <Users className="w-4 h-4" />
              <span>Join thousands of players already ranking up</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to climb?</h2>
            <p className="text-zinc-400 mb-8">
              Create a free account and browse offers in under a minute.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register">
                <Button size="lg" className="px-8 py-6 text-base">
                  Get Started — Free
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="px-8 py-6 text-base">
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
