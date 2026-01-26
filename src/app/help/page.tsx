"use client";

import Link from "next/link";
import { ArrowLeft, MessageCircle, Mail, FileText, Shield, HelpCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const faqs = [
  {
    question: "How does BoostMarket work?",
    answer: "BoostMarket connects gamers who offer boosting services with those who need them. Browse available services, choose a booster, place an order, and communicate through our secure chat system."
  },
  {
    question: "Is boosting safe?",
    answer: "We take security seriously. All boosters are vetted, and we use secure communication channels. However, always follow game-specific terms of service and use account sharing features at your own discretion."
  },
  {
    question: "How do I become a booster?",
    answer: "Anyone can offer services on BoostMarket! Simply create an account, then click 'Create Offer' to list your boosting services. Set your prices, describe your services, and start accepting orders."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept major credit cards, PayPal, and various other payment methods through our secure payment processor."
  },
  {
    question: "How do refunds work?",
    answer: "Refunds are handled on a case-by-case basis. If a booster fails to deliver the service, you can open a dispute and our team will review it."
  },
  {
    question: "How do I contact a booster?",
    answer: "Once you're logged in, you can use the chat feature on any service page to communicate directly with the booster before or after placing an order."
  }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-slate-700/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-slate-800/50 hover:bg-slate-800 transition-colors text-left"
      >
        <span className="font-medium text-white">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-slate-800/30">
          <p className="text-gray-300">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold text-white mb-4">Help Center</h1>
        <p className="text-xl text-gray-400 mb-12">Find answers to common questions or contact our support team</p>

        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <a href="mailto:support@boostmarket.com" className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 hover:border-indigo-500/50 transition-colors text-center">
            <Mail className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Email Support</h3>
            <p className="text-gray-400 text-sm">support@boostmarket.com</p>
          </a>
          
          <Link href="/how-it-works" className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-colors text-center">
            <FileText className="w-10 h-10 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">How It Works</h3>
            <p className="text-gray-400 text-sm">Learn the basics</p>
          </Link>
          
          <Link href="/terms" className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-colors text-center">
            <Shield className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Terms & Policies</h3>
            <p className="text-gray-400 text-sm">Read our guidelines</p>
          </Link>
        </div>

        {/* FAQs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-indigo-400" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Still need help */}
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-2xl p-8 border border-indigo-500/30 text-center">
          <MessageCircle className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Still need help?</h2>
          <p className="text-gray-300 mb-6">Our support team is here to assist you</p>
          <a href="mailto:support@boostmarket.com">
            <Button className="bg-indigo-600 hover:bg-indigo-500">
              Contact Support
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
