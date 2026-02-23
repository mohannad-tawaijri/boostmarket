"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Search, User, ShoppingCart, Shield, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useSocket } from "@/contexts/socket-context";
import Logo from "./logo";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount } = useSocket();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  return (
    <nav className="bg-[#0d0d12]/90 backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo size="sm" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/services" className="text-zinc-400 hover:text-white text-sm transition-colors">
              تصفح العروض
            </Link>
            <Link href="/create-offer" className="text-zinc-400 hover:text-white text-sm transition-colors">
              إنشاء عرض
            </Link>
            <Link href="/how-it-works" className="text-zinc-400 hover:text-white text-sm transition-colors">
              كيف يعمل
            </Link>
          </div>

          {/* Search & User Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search */}
            {showSearch ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن الخدمات..."
                    autoFocus
                    className="w-64 bg-white/[0.05] border border-white/[0.08] rounded-lg pe-10 ps-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/40"
                  />
                  <Search className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                </div>
                <button
                  type="button"
                  onClick={() => { setShowSearch(false); setSearchQuery(""); }}
                  className="me-2 p-2 hover:bg-white/[0.06] rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-zinc-400" />
                </button>
              </form>
            ) : (
              <button 
                onClick={() => setShowSearch(true)}
                className="p-2 hover:bg-white/[0.06] rounded-full transition-colors"
              >
                <Search className="w-5 h-5 text-zinc-400" />
              </button>
            )}

            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                    لوحة التحكم
                  </Button>
                </Link>
                <Link href="/messages">
                  <button className="p-2 hover:bg-white/[0.06] rounded-full relative transition-colors" title="الرسائل">
                    <MessageSquare className="w-5 h-5 text-zinc-400" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -start-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                </Link>
                <Link href="/orders">
                  <button className="p-2 hover:bg-white/[0.06] rounded-full relative transition-colors">
                    <ShoppingCart className="w-5 h-5 text-zinc-400" />
                  </button>
                </Link>
                <div className="flex items-center gap-2">
                  {user?.isAdmin && (
                    <Link href="/admin">
                      <button className="p-2 hover:bg-red-900/30 rounded-full transition-colors" title="لوحة الإدارة">
                        <Shield className="w-5 h-5 text-red-400" />
                      </button>
                    </Link>
                  )}
                  <Link href="/profile">
                    <button className="p-2 hover:bg-white/[0.06] rounded-full transition-colors">
                      <User className="w-5 h-5 text-zinc-400" />
                    </button>
                  </Link>
                  <Button onClick={logout} variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                    تسجيل خروج
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                    تسجيل دخول
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    إنشاء حساب
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-zinc-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/[0.06]">
            <div className="flex flex-col space-y-1">
              {/* Mobile Search */}
              <form onSubmit={(e) => { handleSearch(e); setIsMenuOpen(false); }} className="px-3 pb-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن الخدمات..."
                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg pe-10 ps-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  />
                  <Search className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                </div>
              </form>
              
              <Link
                href="/services"
                className="text-zinc-300 hover:text-white hover:bg-white/[0.04] px-3 py-2 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                تصفح العروض
              </Link>
              <Link
                href="/create-offer"
                className="text-zinc-300 hover:text-white hover:bg-white/[0.04] px-3 py-2 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                إنشاء عرض
              </Link>
              <Link
                href="/how-it-works"
                className="text-zinc-300 hover:text-white hover:bg-white/[0.04] px-3 py-2 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                كيف يعمل
              </Link>
              <Link
                href="/about"
                className="text-zinc-300 hover:text-white hover:bg-white/[0.04] px-3 py-2 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                من نحن
              </Link>
              {user ? (
                <>
                  {user?.isAdmin && (
                    <Link
                      href="/admin"
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/30 px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield className="w-4 h-4" />
                      لوحة الإدارة
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    className="text-zinc-300 hover:text-white hover:bg-white/[0.04] px-3 py-2 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    لوحة التحكم
                  </Link>
                  <Link
                    href="/messages"
                    className="text-zinc-300 hover:text-white hover:bg-white/[0.04] px-3 py-2 rounded-lg transition-colors flex items-center justify-between"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>الرسائل</span>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/orders"
                    className="text-zinc-300 hover:text-white hover:bg-white/[0.04] px-3 py-2 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    الطلبات
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-zinc-300 hover:text-white hover:bg-white/[0.04] px-3 py-2 rounded-lg transition-colors text-right"
                  >
                    تسجيل خروج
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-zinc-300 hover:text-white hover:bg-white/[0.04] px-3 py-2 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    تسجيل دخول
                  </Link>
                  <Link
                    href="/register"
                    className="bg-violet-600 text-white px-3 py-2 rounded-lg text-center font-medium hover:bg-violet-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    إنشاء حساب
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
