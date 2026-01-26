"use client";

import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <AlertTriangle className="w-10 h-10 text-yellow-400" />
          <h1 className="text-4xl font-bold text-white">Disclaimer</h1>
        </div>
        
        <div className="space-y-6">
          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold text-white mb-4">General Disclaimer</h2>
            <p className="text-gray-300">
              BoostMarket is a marketplace platform that connects service providers (boosters) with customers. 
              We do not directly provide boosting services. All services are provided by independent contractors 
              who use our platform.
            </p>
          </section>

          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold text-white mb-4">Game Terms of Service</h2>
            <p className="text-gray-300">
              Users should be aware that boosting services may violate the terms of service of certain games. 
              It is the user's responsibility to understand and accept any risks associated with using boosting 
              services. BoostMarket is not responsible for any consequences resulting from violations of game 
              terms of service.
            </p>
          </section>

          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold text-white mb-4">Account Security</h2>
            <p className="text-gray-300">
              When sharing account credentials with boosters, you do so at your own risk. While we vet our 
              boosters, we cannot guarantee the security of your account. We recommend using services that 
              don't require account sharing when possible.
            </p>
          </section>

          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold text-white mb-4">No Guarantees</h2>
            <p className="text-gray-300">
              While boosters strive to deliver the best results, BoostMarket does not guarantee specific outcomes 
              for any service. Results may vary based on various factors including game updates, matchmaking 
              systems, and other variables outside our control.
            </p>
          </section>

          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold text-white mb-4">Limitation of Liability</h2>
            <p className="text-gray-300">
              BoostMarket shall not be liable for any direct, indirect, incidental, special, consequential, 
              or punitive damages resulting from your use of the platform or services obtained through it.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
