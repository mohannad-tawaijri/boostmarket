"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export default function BecomeBoosterPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-transparent">
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Sell on BoostMarket</h1>
          <p className="text-zinc-500 text-sm mb-10">If you are good at competitive games, you can get paid for it.</p>

          <div className="space-y-8 text-[15px] leading-relaxed text-zinc-400">
            <p>
              BoostMarket is a marketplace. You list your services, set your own prices, and work on
              your own schedule. We handle payments, provide a chat system, and bring in the buyers.
              You bring the skill.
            </p>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">How it works for sellers</h2>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white/[0.06] text-zinc-300 flex items-center justify-center text-xs font-bold">1</span>
                  <div>
                    <span className="text-white font-medium">Create a free account.</span>{" "}
                    Takes under a minute. No approval process or upfront fees.
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white/[0.06] text-zinc-300 flex items-center justify-center text-xs font-bold">2</span>
                  <div>
                    <span className="text-white font-medium">List your services.</span>{" "}
                    Pick a game, describe what you offer (rank boost, coaching, achievements),
                    set a price, and publish. You can create as many listings as you want.
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white/[0.06] text-zinc-300 flex items-center justify-center text-xs font-bold">3</span>
                  <div>
                    <span className="text-white font-medium">Accept orders and deliver.</span>{" "}
                    When someone buys your service, you get notified. Chat with the buyer,
                    do the work, and mark it complete. Payment releases after the buyer confirms.
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">What we take</h2>
              <p>
                A small platform fee on each completed order. That is how we keep the lights on.
                There are no listing fees, no monthly subscriptions, and no hidden charges.
                You only pay when you earn.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">What makes sellers successful here</h2>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="text-zinc-600"></span>
                  <span>Clear, honest descriptions of what you deliver and how long it takes</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-zinc-600"></span>
                  <span>Competitive pricing (check what others charge for similar services)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-zinc-600"></span>
                  <span>Fast responses to messages  buyers notice</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-zinc-600"></span>
                  <span>Delivering on time or communicating early if there is a delay</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-zinc-600"></span>
                  <span>Building up reviews  your first few orders matter the most</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">A note on expectations</h2>
              <p>
                This is not passive income. Boosting takes real time and effort. The sellers who
                do well here treat it like a job (or at least a serious side gig). If you are
                looking to list something and forget about it, this probably is not for you.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/[0.06]">
            <Link href={user ? "/create-offer" : "/register"}>
              <Button size="lg">
                {user ? "Create Your First Listing" : "Create an Account"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
