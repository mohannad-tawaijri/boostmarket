"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#111114] py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-sm text-zinc-500 mb-10">Last updated: February 2026</p>
        
        <div className="space-y-8 text-[15px] leading-relaxed text-zinc-400">
          <p>
            These terms are the agreement between you and BoostMarket. By using the site, you are agreeing to them. If you do not agree, that is okay  just do not use the platform.
          </p>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">What BoostMarket is</h2>
            <p>
              We are a marketplace. Sellers list boosting services, buyers purchase them, and we facilitate the transaction. We are not the ones doing the boosting  the individual sellers are. Think of us as the platform that connects the two sides and handles the payment in between.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Your account</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Use real information when signing up. Fake accounts get removed.</li>
              <li>You are responsible for keeping your password secure. We recommend something unique.</li>
              <li>One account per person. Do not create multiple accounts to game the review system or dodge bans.</li>
              <li>You must be at least 18 years old (or the legal age in your country) to use BoostMarket.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">For buyers</h2>
            <p className="mb-3">
              When you place an order, your payment is held by us until the seller delivers. If something goes wrong  the seller does not deliver, or the result is not what was promised  you can open a dispute and we will review it.
            </p>
            <p>
              Refunds are not automatic. We look at each case individually. If the seller delivered what was listed and you just changed your mind, that is generally not grounds for a refund.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">For sellers</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>List your services honestly. Do not promise things you cannot deliver.</li>
              <li>Deliver within the timeframe you set. If you need more time, communicate with the buyer.</li>
              <li>Be responsive. Buyers who cannot reach you will open disputes, and that is bad for everyone.</li>
              <li>We take a small platform fee from each completed order. The exact percentage is shown before you list.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Things you cannot do</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Scam, defraud, or mislead other users</li>
              <li>Use the platform for anything illegal</li>
              <li>Harass other users through chat or reviews</li>
              <li>Attempt to take transactions off-platform to avoid fees</li>
              <li>Use bots, scripts, or automation to interact with the site</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Liability</h2>
            <p>
              We do our best to keep the platform running smoothly, but we cannot guarantee 100% uptime or that every seller will be perfect. We are a marketplace, not an insurance company. Use the platform at your own discretion, especially when it comes to sharing game account credentials.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Changes to these terms</h2>
            <p>
              We might update these terms occasionally. If we make significant changes, we will let you know via email or a notice on the site. Continued use after changes means you accept them.
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-800/60">
            <p className="text-zinc-500 text-sm">
              Questions? <a href="mailto:support@boostmarket.com" className="text-violet-400 hover:underline">support@boostmarket.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
