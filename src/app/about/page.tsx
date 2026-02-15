import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">About BoostMarket</h1>
          <p className="text-zinc-500 text-sm mb-10">The short version of who we are and why we built this.</p>
          
          <div className="space-y-8 text-[15px] leading-relaxed text-zinc-400">
            <p>
              BoostMarket started because we were tired of sketchy Discord DMs and random forum posts
              every time we wanted a rank boost. No receipts, no accountability, no way to know if the
              person on the other end was any good  or even real.
            </p>

            <p>
              So we built a proper marketplace. One where boosters can list their services with clear
              pricing, buyers can read real reviews before committing, and everyone has a chat thread
              and order history to fall back on if something goes wrong.
            </p>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">What we actually do</h2>
              <p>
                We are a platform. Buyers find boosters, place orders, and pay through us. The booster
                does the work, the buyer confirms, and the booster gets paid. We hold the funds in
                between to keep both sides honest. If there is a dispute, we step in.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">What we do not do</h2>
              <p>
                We do not employ boosters. We do not boost accounts ourselves. We do not guarantee
                specific outcomes  games are unpredictable, and so are rank systems. What we do
                guarantee is that sellers on our platform have reviews, order history, and skin in
                the game (literally).
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">How we make money</h2>
              <p>
                We take a small fee on each transaction. That is it. No premium seller tiers, no
                pay-to-rank listing schemes, no ads. The marketplace works because good boosters
                get good reviews and rise to the top naturally.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">The team</h2>
              <p>
                We are a small group of people who play competitive games and got tired of the
                existing options. Some of us have been on both sides  buying boosts and selling
                them. That perspective shapes how we build the platform.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row gap-4">
            <Link href="/services">
              <Button>Browse Services</Button>
            </Link>
            <Link href="/become-booster">
              <Button variant="outline">Sell on BoostMarket</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
