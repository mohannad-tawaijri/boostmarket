import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Logo from "./logo";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <Logo size="sm" />
            </div>
            <p className="text-gray-400 text-sm mb-6">
              The leading marketplace connecting gamers with professional boosters and coaches.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="p-2 bg-slate-800 hover:bg-indigo-600 rounded-lg transition-colors">
                <Facebook className="w-4 h-4 text-gray-400 hover:text-white" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-indigo-600 rounded-lg transition-colors">
                <Twitter className="w-4 h-4 text-gray-400 hover:text-white" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-indigo-600 rounded-lg transition-colors">
                <Instagram className="w-4 h-4 text-gray-400 hover:text-white" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-indigo-600 rounded-lg transition-colors">
                <Youtube className="w-4 h-4 text-gray-400 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Browse Services
                </Link>
              </li>
              <li>
                <Link href="/become-booster" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Become a Booster
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/trust-safety" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Trust & Safety
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-sm text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} BoostMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
