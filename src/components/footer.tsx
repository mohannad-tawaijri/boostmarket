import Link from "next/link";
import Logo from "./logo";

export default function Footer() {
  return (
    <footer className="bg-[#0c0c0f] border-t border-zinc-800/60">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <div className="mb-3">
              <Logo size="sm" />
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">
              A marketplace connecting gamers with trusted boosters. Simple, safe, transparent.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-zinc-300 font-medium text-sm mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/services" className="text-zinc-500 hover:text-zinc-300 transition-colors">Browse Services</Link></li>
              <li><Link href="/how-it-works" className="text-zinc-500 hover:text-zinc-300 transition-colors">How It Works</Link></li>
              <li><Link href="/become-booster" className="text-zinc-500 hover:text-zinc-300 transition-colors">Become a Booster</Link></li>
              <li><Link href="/about" className="text-zinc-500 hover:text-zinc-300 transition-colors">About</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-zinc-300 font-medium text-sm mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/help" className="text-zinc-500 hover:text-zinc-300 transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-zinc-500 hover:text-zinc-300 transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="text-zinc-500 hover:text-zinc-300 transition-colors">FAQ</Link></li>
              <li><Link href="/trust-safety" className="text-zinc-500 hover:text-zinc-300 transition-colors">Trust & Safety</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-zinc-300 font-medium text-sm mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/terms" className="text-zinc-500 hover:text-zinc-300 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-zinc-500 hover:text-zinc-300 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="text-zinc-500 hover:text-zinc-300 transition-colors">Cookies</Link></li>
              <li><Link href="/disclaimer" className="text-zinc-500 hover:text-zinc-300 transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800/60 mt-10 pt-6 text-xs text-center text-zinc-600">
          <p>&copy; {new Date().getFullYear()} BoostMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
