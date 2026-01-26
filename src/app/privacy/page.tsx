"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none space-y-6">
          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
            <p className="text-gray-300">
              We collect information you provide directly, including your email address, name, and any other 
              information you choose to provide when creating an account or using our services.
            </p>
          </section>

          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
            <ul className="text-gray-300 list-disc list-inside space-y-2">
              <li>To provide and maintain our services</li>
              <li>To process transactions</li>
              <li>To communicate with you about orders and updates</li>
              <li>To improve our platform and user experience</li>
            </ul>
          </section>

          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold text-white mb-4">3. Information Sharing</h2>
            <p className="text-gray-300">
              We do not sell your personal information. We may share information with service providers 
              who assist in our operations, or when required by law.
            </p>
          </section>

          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
            <p className="text-gray-300">
              We implement appropriate security measures to protect your personal information. 
              However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold text-white mb-4">5. Cookies</h2>
            <p className="text-gray-300">
              We use cookies and similar technologies to enhance your experience, analyze usage, 
              and assist in our marketing efforts.
            </p>
          </section>

          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold text-white mb-4">6. Your Rights</h2>
            <p className="text-gray-300">
              You have the right to access, update, or delete your personal information. 
              Contact us at privacy@boostmarket.com for any privacy-related requests.
            </p>
          </section>

          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold text-white mb-4">7. Contact</h2>
            <p className="text-gray-300">
              For privacy concerns, please contact us at privacy@boostmarket.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
