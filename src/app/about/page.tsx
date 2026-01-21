import { 
  Gamepad2, 
  Users, 
  Shield, 
  Trophy,
  Heart,
  Globe,
  Zap,
  Target
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const features = [
    { icon: '🎮', label: 'All Major Games' },
    { icon: '🔒', label: 'Secure Platform' },
    { icon: '⚡', label: 'Fast Service' },
    { icon: '💬', label: 'Direct Support' },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Security First',
      description: 'We prioritize the safety of your gaming accounts with industry-leading security measures.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built by gamers, for gamers. We understand what you need to succeed.',
    },
    {
      icon: Trophy,
      title: 'Excellence',
      description: 'We only work with the best boosters who have proven their skills at the highest levels.',
    },
    {
      icon: Heart,
      title: 'Customer Focus',
      description: 'Your satisfaction is our priority. We are here to help you achieve your gaming goals.',
    },
  ];

  const team = [
    { name: 'Alex Chen', role: 'Founder & CEO', game: 'Ex-Pro LoL Player' },
    { name: 'Sarah Kim', role: 'Head of Operations', game: 'Radiant Valorant' },
    { name: 'Mike Johnson', role: 'Lead Developer', game: 'Global Elite CS2' },
    { name: 'Emma Davis', role: 'Community Manager', game: 'Top 500 OW2' },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/50 to-slate-950"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
            <Gamepad2 className="w-5 h-5 text-indigo-400" />
            <span className="text-indigo-400 font-medium">About BoostMarket</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Connecting <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Gamers</span> with <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Pros</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We are the leading marketplace for gaming boost services, connecting ambitious players with professional boosters across all major competitive games.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((item, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl md:text-5xl">
                  {item.icon}
                </p>
                <p className="text-gray-400 mt-2">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-gray-400 text-lg mb-6">
                Gaming is more than just entertainment — it is a passion, a community, and for many, a way of life. We believe everyone deserves to experience the thrill of playing at higher ranks and competing with the best.
              </p>
              <p className="text-gray-400 text-lg mb-6">
                BoostMarket was founded to bridge the gap between casual and competitive gaming. We provide a safe, reliable platform where skilled boosters can share their expertise and help others achieve their gaming goals.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-white">Fast Service</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  <span className="text-white">Goal Oriented</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <span className="text-white">Global Reach</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 flex items-center justify-center">
                <Gamepad2 className="w-48 h-48 text-white/80" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Trophy className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-gray-400">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-indigo-500/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-gray-400 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Meet the Team</h2>
            <p className="text-gray-400">The gamers behind BoostMarket</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 text-center hover:border-indigo-500/30 transition-all group"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                <p className="text-indigo-400 text-sm">{member.role}</p>
                <p className="text-gray-500 text-sm mt-1">{member.game}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900/50 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join Our Community</h2>
          <p className="text-xl text-gray-400 mb-8">
            Whether you are looking to get boosted or become a booster yourself, we would love to have you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
              <Button size="lg" className="w-full sm:w-auto">
                Find a Booster
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Apply as Booster
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
