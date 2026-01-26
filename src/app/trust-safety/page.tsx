"use client";

import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TrustSafetyPage() {
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
          <Shield className="w-10 h-10 text-green-400" />
          <h1 className="text-4xl font-bold text-white">Trust & Safety</h1>
        </div>
        
        <p className="text-xl text-gray-400 mb-12">
          Your security is our top priority. Learn how we keep you safe.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <Lock className="w-10 h-10 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Secure Payments</h3>
            <p className="text-gray-300">
              All transactions are processed through encrypted payment systems. Your financial 
              information is never stored on our servers.
            </p>
          </div>
          
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <Users className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Verified Boosters</h3>
            <p className="text-gray-300">
              All boosters on our platform go through a verification process to ensure quality 
              and reliability of service.
            </p>
          </div>
          
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <Eye className="w-10 h-10 text-cyan-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Transparent Reviews</h3>
            <p className="text-gray-300">
              Real reviews from real customers help you make informed decisions. We never 
              remove negative reviews unfairly.
            </p>
          </div>
          
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <CheckCircle className="w-10 h-10 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Dispute Resolution</h3>
            <p className="text-gray-300">
              Our dedicated support team handles disputes fairly and efficiently to ensure 
              both buyers and sellers are protected.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl p-8 border border-green-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">Our Commitment</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <span>24/7 monitoring for fraudulent activity</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <span>Secure communication channels between users</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <span>Money-back guarantee for undelivered services</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <span>Regular security audits and updates</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
