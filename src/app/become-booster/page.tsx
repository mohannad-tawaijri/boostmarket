"use client";

import Link from "next/link";
import { ArrowRight, Gamepad2, DollarSign, Users, Star, CheckCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export default function BecomeBoosterPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-500/30 mb-6">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-300">Start Earning Today</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Turn Your <span className="text-gradient">Gaming Skills</span><br />Into Income
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Join thousands of boosters earning money by helping other gamers achieve their goals. 
            Set your own prices, work your own hours.
          </p>
          
          <Link href={user ? "/create-offer" : "/register"}>
            <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-lg px-8 py-6">
              {user ? "Create Your First Offer" : "Get Started Now"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Boost on BoostMarket?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 text-center">
              <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Keep More Earnings</h3>
              <p className="text-gray-400">Low platform fees mean more money in your pocket. You set your own prices.</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 text-center">
              <Users className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Growing Customer Base</h3>
              <p className="text-gray-400">Access thousands of gamers looking for boost services every day.</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 text-center">
              <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Fast Payouts</h3>
              <p className="text-gray-400">Get paid quickly after completing orders. No long waiting periods.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-slate-800/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How to Get Started</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 text-white font-bold">1</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Create an Account</h3>
                <p className="text-gray-400">Sign up for free in less than a minute. No verification fees.</p>
              </div>
            </div>
            
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 text-white font-bold">2</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Create Your Offers</h3>
                <p className="text-gray-400">List the games and services you offer. Set your prices and delivery times.</p>
              </div>
            </div>
            
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 text-white font-bold">3</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Start Earning</h3>
                <p className="text-gray-400">Accept orders, complete boosts, and get paid. It's that simple!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Gamepad2 className="w-16 h-16 text-indigo-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Earning?</h2>
          <p className="text-gray-400 mb-8">Join BoostMarket today and monetize your gaming skills</p>
          
          <Link href={user ? "/create-offer" : "/register"}>
            <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500">
              {user ? "Create an Offer" : "Sign Up Free"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
