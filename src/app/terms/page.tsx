"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none space-y-6">
          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300">
              By accessing and using BoostMarket, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our platform.
            </p>
          </section>

          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold text-white mb-4">2. Service Description</h2>
            <p className="text-gray-300">
              BoostMarket is a marketplace connecting gamers who offer boosting services with those seeking them. 
              We facilitate transactions but are not directly responsible for the services provided by individual boosters.
            </p>
          </section>

          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold text-white mb-4">3. User Responsibilities</h2>
            <ul className="text-gray-300 list-disc list-inside space-y-2">
              <li>You must provide accurate account information</li>
              <li>You are responsible for maintaining account security</li>
              <li>You agree not to engage in fraudulent activities</li>
              <li>You must comply with all applicable laws and game terms of service</li>
            </ul>
          </section>

          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold text-white mb-4">4. Payment Terms</h2>
            <p className="text-gray-300">
              All payments are processed securely through our platform. Refunds are handled on a case-by-case basis 
              according to our refund policy.
            </p>
          </section>

          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold text-white mb-4">5. Limitation of Liability</h2>
            <p className="text-gray-300">
              BoostMarket is not liable for any damages arising from the use of our platform or services 
              provided by boosters. Use the platform at your own risk.
            </p>
          </section>

          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold text-white mb-4">6. Contact</h2>
            <p className="text-gray-300">
              For questions about these terms, please contact us at support@boostmarket.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
