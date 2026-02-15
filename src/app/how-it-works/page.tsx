import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h1>
          <p className="text-zinc-500 text-sm mb-10">From finding a booster to getting your rank  here is the full flow.</p>

          <div className="space-y-10 text-[15px] leading-relaxed text-zinc-400">

            {/* Step 1 */}
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center text-sm font-bold mt-0.5">1</div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">Browse the marketplace</h2>
                <p>
                  Head to the services page and filter by game, rank range, or price. Each listing
                  shows what the booster offers, how long it usually takes, and what past buyers
                  thought of them. No guesswork.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center text-sm font-bold mt-0.5">2</div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">Message the booster</h2>
                <p>
                  Before you buy, you can chat with the booster directly. Ask about their approach,
                  confirm timelines, or discuss specifics like champion preferences or play schedule.
                  This is not a vending machine  you are hiring a person.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center text-sm font-bold mt-0.5">3</div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">Place your order</h2>
                <p>
                  When you are ready, place the order and pay through BoostMarket. Your payment is
                  held securely until the job is done  the booster does not get paid until you
                  confirm delivery (or until the auto-release window closes).
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center text-sm font-bold mt-0.5">4</div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">Track progress</h2>
                <p>
                  Once the booster starts, you can follow along from your dashboard. Most boosters
                  send updates through chat. If anything feels off, you can pause or open a dispute
                  at any time.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center text-sm font-bold mt-0.5">5</div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">Confirm and review</h2>
                <p>
                  When the boost is complete, confirm delivery and leave a review. Honest feedback
                  helps other buyers and rewards boosters who do good work.
                </p>
              </div>
            </div>

            {/* FAQ */}
            <div className="pt-6 border-t border-white/[0.06] space-y-6">
              <h2 className="text-lg font-semibold text-white">Common questions</h2>

              <div>
                <h3 className="font-medium text-zinc-300 mb-1">Is my account safe?</h3>
                <p>
                  Depends on the service. Some boosts (like coaching or duo queue) never need
                  your login. Others do. If you share credentials, change your password afterward
                  and enable 2FA. We also recommend choosing boosters with strong review histories.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-zinc-300 mb-1">How long does it take?</h3>
                <p>
                  Varies by service. Each listing has an estimated delivery time. A single division
                  boost might take a day or two; a full climb could take a week. The booster will
                  give you a more specific estimate once they see your account.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-zinc-300 mb-1">What if something goes wrong?</h3>
                <p>
                  Open a dispute from your order page. Our support team reviews the situation
                  and can issue partial or full refunds depending on what happened. We do not
                  just side with one party  we look at the chat logs, order details, and
                  delivery evidence.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/[0.06]">
            <Link href="/services">
              <Button>Browse Services</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
