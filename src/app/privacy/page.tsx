"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-transparent py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-zinc-500 mb-10">Last updated: February 2026</p>
        
        <div className="space-y-8 text-[15px] leading-relaxed text-zinc-400">
          <p>
            We know privacy policies are usually walls of text nobody reads. We will try to keep this one short and written in plain English.
          </p>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">What we collect</h2>
            <p className="mb-3">
              When you sign up, we store your email address, display name, and a hashed version of your password (we never see the original). If you buy or sell something, we also keep transaction records  amounts, dates, and which accounts were involved.
            </p>
            <p>
              We collect basic analytics (pages visited, rough location from your IP, device type) to understand how people use the site. We do not fingerprint you or build advertising profiles.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">How we use it</h2>
            <ul className="space-y-2 list-disc list-inside text-zinc-400">
              <li>To run your account and process orders</li>
              <li>To send you order updates and receipts (not marketing spam)</li>
              <li>To investigate disputes if something goes wrong between a buyer and seller</li>
              <li>To spot fraud and keep the platform safe</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Who sees your data</h2>
            <p className="mb-3">We do not sell your data. Full stop. We share the bare minimum with:</p>
            <ul className="space-y-2 list-disc list-inside text-zinc-400">
              <li><strong className="text-zinc-300">Our payment processor</strong>  they need your payment details to charge you (we never store card numbers ourselves)</li>
              <li><strong className="text-zinc-300">Hosting providers</strong>  our servers run on third-party infrastructure, so technically they could access data, though they have no reason to</li>
              <li><strong className="text-zinc-300">Law enforcement</strong>  only if legally required, and we would push back on overly broad requests</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Cookies</h2>
            <p>
              We use a session cookie to keep you logged in and a couple of analytics cookies. No third-party ad trackers. See our <Link href="/cookies" className="text-violet-400 hover:underline">cookie policy</Link> for the full breakdown.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Your rights</h2>
            <p>
              You can download or delete your data at any time. Email us at <a href="mailto:privacy@boostmarket.com" className="text-violet-400 hover:underline">privacy@boostmarket.com</a> and we will handle it within a few business days. If you are in the EU, you have the full set of GDPR rights  access, rectification, erasure, portability, the works.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Security</h2>
            <p>
              Passwords are bcrypt-hashed, connections are encrypted with TLS, and we use token-based authentication. No system is bulletproof, but we take reasonable precautions and would notify affected users promptly if a breach ever occurred.
            </p>
          </div>

          <div className="pt-4 border-t border-white/[0.06]">
            <p className="text-zinc-500 text-sm">
              Questions? Reach us at <a href="mailto:privacy@boostmarket.com" className="text-violet-400 hover:underline">privacy@boostmarket.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
