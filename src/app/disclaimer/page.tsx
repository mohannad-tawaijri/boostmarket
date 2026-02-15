"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-transparent py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Disclaimer</h1>
        <p className="text-sm text-zinc-500 mb-10">Last updated: February 2026</p>
        
        <div className="space-y-8 text-[15px] leading-relaxed text-zinc-400">
          <p>
            A few things worth being upfront about before you use BoostMarket.
          </p>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">We are a marketplace, not a service provider</h2>
            <p>
              BoostMarket connects buyers with independent sellers who offer boosting services. We do not employ boosters, and we do not perform any boosting ourselves. The quality of each service depends on the individual seller  though we do our best to vet them and handle disputes when things go sideways.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Game rules and account risk</h2>
            <p className="mb-3">
              Let us be real: many game publishers consider boosting a violation of their terms of service. Using BoostMarket may put your game account at risk of penalties, including temporary bans or permanent suspension by the game developer.
            </p>
            <p>
              That is a decision you need to make for yourself. We cannot guarantee your game account will not face consequences, and we are not liable if it does.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Account sharing</h2>
            <p>
              Some services involve sharing your game login credentials with a booster. We encourage using services that do not require this whenever possible. If you do share credentials, change your password afterward and enable two-factor authentication. We cannot be held responsible for what happens to accounts you voluntarily share access to.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">No guaranteed outcomes</h2>
            <p>
              Games update, metas shift, matchmaking algorithms change. A booster might encounter unexpected difficulty or take longer than estimated. While most orders go smoothly, we cannot promise specific results  only that sellers are expected to make a genuine effort to deliver what they listed.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Limitation of liability</h2>
            <p>
              BoostMarket is not liable for indirect, incidental, or consequential damages from using the platform. This includes lost game accounts, missed rank rewards, or anything else that results from services purchased here. Our total liability to you is limited to the amount you paid for the specific order in question.
            </p>
          </div>

          <div className="pt-4 border-t border-white/[0.06]">
            <p className="text-zinc-500 text-sm">
              Questions? <a href="mailto:support@boostmarket.com" className="text-violet-400 hover:underline">support@boostmarket.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
