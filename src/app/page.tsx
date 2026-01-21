import Link from "next/link";
import { Star, TrendingUp, Shield, Zap, Users, Trophy, ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full border border-indigo-500/30 mb-8">
              <Rocket className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-indigo-300">The #1 Gaming Boost Marketplace</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Level Up Your
              <span className="block text-gradient">Gaming Experience</span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Connect with professional boosters and coaches to dominate your favorite games. Fast, secure, and guaranteed results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services">
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-indigo-500/25 btn-glow">
                  <span className="flex items-center gap-2">
                    Browse Offers
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Button>
              </Link>
              <Link href="/create-offer">
                <Button size="lg" variant="outline" className="border-2 border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/10 hover:border-indigo-400 px-8 py-6 text-lg rounded-xl">
                  Become a Booster
                </Button>
              </Link>
            </div>

            {/* Features Pills */}
            <div className="flex flex-wrap justify-center gap-4 mt-16">
              {[
                { icon: "🎮", label: "All Major Games" },
                { icon: "🔒", label: "Secure Platform" },
                { icon: "⚡", label: "Fast Delivery" },
                { icon: "💬", label: "Direct Chat" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-gray-300">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose <span className="text-gradient">BoostMarket</span>?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">We provide the best gaming boost services with top-tier security and verified professionals</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, color: "from-blue-500 to-cyan-500", title: "Secure & Safe", desc: "All transactions are protected with buyer protection and encrypted payments" },
              { icon: Star, color: "from-purple-500 to-pink-500", title: "Verified Boosters", desc: "Every booster goes through strict verification and skill testing" },
              { icon: Zap, color: "from-green-500 to-emerald-500", title: "Fast Delivery", desc: "Quick turnaround times with real-time progress tracking" },
              { icon: Trophy, color: "from-orange-500 to-yellow-500", title: "Guaranteed Results", desc: "100% satisfaction guarantee or your money back" },
            ].map((feature, index) => (
              <div key={index} className="group p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 card-hover">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Games Section */}
      <section className="py-24 bg-slate-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Popular Games</h2>
            <p className="text-gray-400">Find boosters for your favorite titles</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "League of Legends", color: "from-yellow-600 to-yellow-800" },
              { name: "Valorant", color: "from-red-600 to-pink-600" },
              { name: "CS2", color: "from-orange-500 to-amber-600" },
              { name: "Dota 2", color: "from-red-700 to-red-900" },
              { name: "Overwatch 2", color: "from-orange-400 to-orange-600" },
              { name: "Apex Legends", color: "from-red-500 to-red-700" },
            ].map((game, index) => (
              <Link href={`/services?game=${game.name.toUpperCase().replace(/\s+/g, '_').replace('2', '')}`} key={index}>
                <div className={`aspect-square rounded-2xl bg-gradient-to-br ${game.color} p-4 flex items-end cursor-pointer hover:scale-105 transition-transform group relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                  <span className="text-white font-semibold text-sm relative z-10">{game.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Get started in three simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Browse Services", desc: "Explore offers from verified boosters across all games" },
              { step: "02", title: "Place Your Order", desc: "Choose your service and securely checkout" },
              { step: "03", title: "Track Progress", desc: "Watch your boost in real-time and chat with your booster" },
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="text-7xl font-bold text-indigo-500/20 absolute -top-4 left-1/2 -translate-x-1/2">{item.step}</div>
                <div className="relative z-10 pt-8">
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
            <Users className="w-4 h-4 text-white" />
            <span className="text-sm text-white/90">Join 50,000+ satisfied gamers</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Dominate?</h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Start your journey to the top ranks today with our professional boosting services
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-xl font-semibold shadow-xl">
                Get Started Free
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="border-2 border-white/50 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl">
                Explore Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
