"use client";

import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const faqs = [
  {
    question: "How does BoostMarket work?",
    answer: "It is a marketplace. Sellers list boosting services (rank boosts, coaching, achievements, etc.) and set their own prices. Buyers browse, pick a seller, and place an order. We hold the payment until the service is delivered and confirmed. Think of us like a middleman that keeps both sides honest."
  },
  {
    question: "Is boosting safe for my game account?",
    answer: "It depends on the game and the type of service. Duo queue and coaching never need your login. Account-sharing services carry more risk  both from the booster having access and from the game publisher potentially flagging unusual activity. We cannot guarantee your account will not face consequences from the game developer. That is a decision you need to weigh for yourself."
  },
  {
    question: "How do I become a booster?",
    answer: "Create a free account, then go to \"Create Offer\" to list your first service. There is no approval process  you can start immediately. That said, buyers will look at your reviews and profile before ordering, so put effort into your listing descriptions and deliver on what you promise."
  },
  {
    question: "What payment methods do you accept?",
    answer: "Major credit and debit cards through our payment processor. We do not handle payment information directly  it goes through an encrypted third-party provider."
  },
  {
    question: "How do refunds work?",
    answer: "If a booster does not deliver what was promised, you can open a dispute from your order page. Our team reviews the chat history, order details, and any evidence from both sides. Depending on the situation, we may issue a partial or full refund. We do not do automatic refunds  each case is reviewed individually."
  },
  {
    question: "Can I talk to the booster before ordering?",
    answer: "Yes. Every listing has a chat option. We actually recommend messaging the booster first to discuss specifics  timelines, champion preferences, play schedule, whatever matters for your order."
  },
  {
    question: "How long does a boost usually take?",
    answer: "It varies. Each listing shows an estimated delivery time. A single-division boost might take a day; a full rank climb could take a week or more. The booster can give you a better estimate once they know your starting point."
  },
  {
    question: "What happens if the booster goes dark?",
    answer: "If the booster stops responding or fails to deliver within a reasonable time, open a dispute. We will investigate and can reassign or refund the order. Boosters who ghost orders get flagged and eventually removed from the platform."
  }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/[0.06]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-start justify-between text-left group"
      >
        <span className="font-medium text-zinc-200 group-hover:text-white transition-colors pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-zinc-500 flex-shrink-0 mt-0.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="pb-5">
          <p className="text-zinc-400 text-[15px] leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-transparent py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Help</h1>
        <p className="text-zinc-500 text-sm mb-10">Answers to the questions we get asked most.</p>

        <div className="mb-12">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="pt-6 border-t border-white/[0.06]">
          <p className="text-zinc-400 text-[15px] mb-1">
            Did not find what you are looking for?
          </p>
          <p className="text-zinc-500 text-sm">
            Email us at{" "}
            <a href="mailto:support@boostmarket.com" className="text-violet-400 hover:underline">
              support@boostmarket.com
            </a>{" "}
            and we will get back to you within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
