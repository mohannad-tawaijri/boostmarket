"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-transparent py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Cookie Policy</h1>
        <p className="text-sm text-zinc-500 mb-10">Last updated: February 2026</p>
        
        <div className="space-y-8 text-[15px] leading-relaxed text-zinc-400">
          <p>
            We use a small number of cookies. Here is exactly what they are and why.
          </p>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Essential cookies</h2>
            <p className="mb-3">These keep the site working. You cannot opt out of them without the site breaking.</p>
            <div className="rounded-lg border border-white/[0.06] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] text-zinc-300">
                    <th className="text-left px-4 py-2.5 font-medium">Cookie</th>
                    <th className="text-left px-4 py-2.5 font-medium">Purpose</th>
                    <th className="text-left px-4 py-2.5 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-400">
                  <tr className="border-b border-white/[0.06]/40">
                    <td className="px-4 py-2.5 font-mono text-xs text-zinc-300">session_token</td>
                    <td className="px-4 py-2.5">Keeps you logged in</td>
                    <td className="px-4 py-2.5">7 days</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono text-xs text-zinc-300">csrf_token</td>
                    <td className="px-4 py-2.5">Prevents cross-site request forgery</td>
                    <td className="px-4 py-2.5">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Analytics cookies</h2>
            <p className="mb-3">
              We use basic analytics to understand traffic patterns  which pages get visited, how long people stay, what devices they use. This helps us prioritize what to build next. We do not use Google Analytics or any advertising-linked tracker.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">What we do not do</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>No third-party advertising cookies</li>
              <li>No cross-site tracking</li>
              <li>No selling cookie data to anyone</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Managing cookies</h2>
            <p>
              Your browser lets you block or delete cookies anytime. Just know that if you block our session cookie, you will get logged out and need to sign in again each visit.
            </p>
          </div>

          <div className="pt-4 border-t border-white/[0.06]">
            <p className="text-zinc-500 text-sm">
              Questions? <a href="mailto:privacy@boostmarket.com" className="text-violet-400 hover:underline">privacy@boostmarket.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
