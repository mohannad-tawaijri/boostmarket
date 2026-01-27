import { 
  Search, 
  MessageSquare, 
  CreditCard, 
  Gamepad2, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HowItWorksPage() {
  const steps = [
    {
      number: '01',
      title: 'Browse & Search',
      description: 'Explore our marketplace of professional boosters. Filter by game, rank, price, and delivery time to find the perfect match for your needs.',
      icon: Search,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      number: '02',
      title: 'Connect & Discuss',
      description: 'Message boosters directly to discuss your requirements, ask questions, and ensure they understand exactly what you need.',
      icon: MessageSquare,
      color: 'from-purple-500 to-pink-500',
    },
    {
      number: '03',
      title: 'Secure Payment',
      description: 'Place your order with confidence. Our secure payment system protects your transaction until the service is completed.',
      icon: CreditCard,
      color: 'from-green-500 to-emerald-500',
    },
    {
      number: '04',
      title: 'Get Boosted',
      description: 'Sit back and relax while our professional boosters work on your account. Track progress in real-time through your dashboard.',
      icon: Gamepad2,
      color: 'from-orange-500 to-red-500',
    },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure & Safe',
      description: 'VPN protection and offline mode available to keep your account safe during boosting.',
    },
    {
      icon: Clock,
      title: 'Fast Delivery',
      description: 'Most orders are completed within the estimated time. Many boosters offer express options.',
    },
    {
      icon: CheckCircle,
      title: 'Guaranteed Results',
      description: 'If something goes wrong, our support team is here to help. Money-back guarantee included.',
    },
  ];

  const faqs = [
    {
      question: 'Is boosting safe for my account?',
      answer: 'Yes! Our boosters use VPN protection and follow strict security protocols. We also offer offline boosting modes where applicable.',
    },
    {
      question: 'How long does boosting take?',
      answer: 'It depends on the service. Each listing shows an estimated delivery time. Boosters provide updates throughout the process.',
    },
    {
      question: 'What if I am not satisfied?',
      answer: 'We have a dispute resolution system. If a booster fails to deliver as promised, you can request a refund.',
    },
    {
      question: 'Can I communicate with my booster?',
      answer: 'Absolutely! Our built-in chat system lets you message your booster directly before and during the order.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/50 to-slate-950"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">BoostMarket</span> Works
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Getting boosted has never been easier. Follow these simple steps to level up your gaming experience.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg shadow-indigo-500/20`}>
                    <step.icon className="w-16 h-16 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className={`flex-1 text-center md:text-left ${index % 2 === 1 ? 'md:text-right' : ''}`}>
                  <span className="text-6xl font-bold text-slate-800">{step.number}</span>
                  <h3 className="text-2xl font-bold text-white mt-2 mb-4">{step.title}</h3>
                  <p className={`text-gray-400 text-lg max-w-lg ${index % 2 === 1 ? 'md:ml-auto' : ''}`}>{step.description}</p>
                </div>

                {/* Connector (hidden on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
                    <ArrowRight className="w-8 h-8 text-slate-700 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose Us?</h2>
            <p className="text-gray-400">We prioritize your gaming experience and account safety</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8 text-center hover:border-indigo-500/30 transition-all"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400">Got questions? We have answers</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900/50 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Level Up?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of gamers who have already improved their ranks with our professional boosters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
              <Button size="lg" className="w-full sm:w-auto">
                Browse Services
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Become a Booster
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
