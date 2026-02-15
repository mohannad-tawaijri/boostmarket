"use client";

import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#111114] py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Contact Us</h1>
        <p className="text-zinc-500 text-sm mb-10">
          Have a question, issue, or suggestion? Send us a message and we will get back to you
          within 24 hours. For order-related issues, you can also use the dispute system from
          your order page.
        </p>

        <div className="flex items-center gap-3 mb-8 text-sm text-zinc-400">
          <Mail className="w-4 h-4 text-violet-400" />
          <span>Or email us directly at{" "}
            <a href="mailto:support@boostmarket.com" className="text-violet-400 hover:underline">
              support@boostmarket.com
            </a>
          </span>
        </div>

        {submitted ? (
          <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-8 text-center">
            <h2 className="text-xl font-semibold text-white mb-2">Message sent</h2>
            <p className="text-zinc-400 text-sm">We will get back to you as soon as we can.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-violet-600 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-violet-600 transition-colors"
                  placeholder="you@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-violet-600 transition-colors"
                placeholder="What is this about?"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Message</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-violet-600 transition-colors resize-none"
                placeholder="Give us the details..."
              />
            </div>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
