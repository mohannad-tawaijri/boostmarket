"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TrustSafetyPage() {
  return (
    <div className="min-h-screen bg-transparent py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Trust & Safety</h1>
        <p className="text-sm text-zinc-500 mb-10">How we try to keep things fair and secure around here.</p>

        <div className="space-y-8 text-[15px] leading-relaxed text-zinc-400">
          <p>
            We are a marketplace, which means we are only as good as the trust between buyers and
            sellers. Here is what we do on our end to earn that trust  and what we expect from you.
          </p>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Payments are held, not instant</h2>
            <p>
              When a buyer places an order, we hold the payment until the service is delivered
              and confirmed. The booster does not get paid upfront  they get paid when the job
              is done. If something goes wrong before that, the buyer can open a dispute and
              we will review it.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Reviews are real</h2>
            <p>
              Only people who have completed an order can leave a review. We do not remove
              negative reviews because a seller asked us to. We will remove reviews that
              contain spam, threats, or personal information  but honest criticism stays up,
              even if it is not flattering.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Disputes</h2>
            <p>
              If a buyer and seller cannot agree, either side can open a dispute. Our support team
              looks at the order details, chat history, and any evidence both parties provide.
              We try to be fair  we do not automatically side with buyers or sellers. Resolution
              usually takes 24 to 72 hours depending on complexity.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Account security</h2>
            <p className="mb-3">
              We hash passwords with bcrypt and serve everything over HTTPS. We do not store
              game account credentials  if a service requires account sharing, that happens
              directly between buyer and seller through encrypted chat.
            </p>
            <p>
              That said, sharing your game login with anyone carries risk. We recommend changing
              your password after any service that involves account access, and always enabling
              two-factor authentication.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">What gets you banned</h2>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span className="text-zinc-600"></span>
                <span>Scamming buyers or sellers (taking payment without delivering, or filing false disputes)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-600"></span>
                <span>Creating fake reviews or manipulating ratings</span>
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-600"></span>
                <span>Harassment or threats in chat</span>
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-600"></span>
                <span>Attempting to take transactions off-platform to avoid our payment protection</span>
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-600"></span>
                <span>Multiple accounts to game the system</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Reporting issues</h2>
            <p>
              If you run into something suspicious  a scam listing, abusive behavior, or
              anything that does not feel right  email us at{" "}
              <a href="mailto:support@boostmarket.com" className="text-violet-400 hover:underline">
                support@boostmarket.com
              </a>. We review every report manually.
            </p>
          </div>

          <div className="pt-4 border-t border-white/[0.06]">
            <p className="text-zinc-500 text-sm">
              We are not perfect, and no platform can prevent every bad actor. But we are paying
              attention and improving things as we go.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
