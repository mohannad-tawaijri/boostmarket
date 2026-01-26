"use client";

import Link from "next/link";
import { ArrowLeft, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CookiesPage() {
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
          <Cookie className="w-10 h-10 text-amber-400" />
          <h1 className="text-4xl font-bold text-white">Cookie Policy</h1>
        </div>
        
        <div className="space-y-6">
          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold text-white mb-4">What Are Cookies</h2>
            <p className="text-gray-300">
              Cookies are small text files that are placed on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences and 
              understanding how you use our platform.
            </p>
          </section>

          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold text-white mb-4">How We Use Cookies</h2>
            <ul className="text-gray-300 list-disc list-inside space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly (login, security)</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
            </ul>
          </section>

          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold text-white mb-4">Managing Cookies</h2>
            <p className="text-gray-300">
              You can control and manage cookies through your browser settings. Please note that 
              disabling certain cookies may affect the functionality of our website.
            </p>
          </section>

          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Cookies</h2>
            <p className="text-gray-300">
              Some cookies are placed by third-party services that appear on our pages. We do not 
              control these cookies. Please refer to the respective privacy policies of these 
              third parties for more information.
            </p>
          </section>

          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold text-white mb-4">Contact</h2>
            <p className="text-gray-300">
              If you have questions about our use of cookies, please contact us at privacy@boostmarket.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
