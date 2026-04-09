"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Filter, Heart, Sparkles, SlidersHorizontal, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/service-card";
import { Service, GameCategory, ServiceCategory, GAME_NAMES, GAME_IMAGES, CATEGORY_NAMES } from "@/types";
import { Tag } from "lucide-react";
import { API_URL } from "@/lib/config";

const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث" },
  { value: "most_liked", label: "الأكثر طلباً" },
  { value: "most_viewed", label: "الأكثر مشاهدة" },
  { value: "price_low", label: "السعر: الأقل" },
  { value: "price_high", label: "السعر: الأعلى" },
];

function ServicesContent() {
  const searchParams = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  // Get search query and game filter from URL params
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    const urlGame = searchParams.get("game");
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
    if (urlGame) {
      setSelectedGame(urlGame);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchServices();
  }, [selectedGame, selectedCategory, sortBy]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedGame) params.append("game", selectedGame);
      if (selectedCategory) params.append("category", selectedCategory);
      if (sortBy) params.append("sortBy", sortBy);

      const response = await fetch(`${API_URL}/services?${params}`);
      const data = await response.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((service) => {
    // Text search filter
    const matchesSearch = searchQuery
      ? service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.booster?.name && service.booster.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 rounded-full border border-violet-500/20 mb-4">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-violet-300">أفضل البوسترز</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="text-violet-400">خدمات البوست</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              لاقي البوستر المناسب للعبتك
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute start-4 top-1/2 transform -translate-y-1/2 text-zinc-500 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث عن لعبة أو خدمة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ps-12 pr-4 py-4 bg-white/[0.07] border border-white/[0.18] rounded-2xl text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-white/[0.07] rounded-2xl border border-white/[0.18] p-6 sticky top-24">
              <h3 className="font-semibold text-lg text-white mb-6 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-violet-400" />
                فلتر
              </h3>

              {/* Game Filter */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-3">
                  <Gamepad2 className="w-4 h-4 text-purple-400" />
                  اللعبة
                </label>
                <div className="space-y-1.5 max-h-[320px] overflow-y-auto custom-scrollbar">
                  <button
                    onClick={() => setSelectedGame("")}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${!selectedGame ? 'bg-violet-500/20 border border-violet-500/30 text-violet-300' : 'hover:bg-white/[0.08] text-zinc-400 border border-transparent'}`}
                  >
                    <Gamepad2 className="w-5 h-5 flex-shrink-0" />
                    <span>كل الألعاب</span>
                  </button>
                  {Object.entries(GAME_NAMES).filter(([key]) => key !== 'OTHER').map(([key, name]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedGame(key)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${selectedGame === key ? 'bg-violet-500/20 border border-violet-500/30 text-violet-300' : 'hover:bg-white/[0.08] text-zinc-400 border border-transparent'}`}
                    >
                      {GAME_IMAGES[key as GameCategory] && (
                        <div className="relative w-7 h-7 rounded-md overflow-hidden flex-shrink-0 border border-white/[0.15]">
                          <Image
                            src={GAME_IMAGES[key as GameCategory]}
                            alt={name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <span className="truncate">{name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-3">
                  <Tag className="w-4 h-4 text-orange-400" />
                  نوع الخدمة
                </label>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`w-full text-start px-3 py-2.5 rounded-lg text-sm transition-all ${!selectedCategory ? 'bg-violet-500/20 border border-violet-500/30 text-violet-300' : 'hover:bg-white/[0.08] text-zinc-400 border border-transparent'}`}
                  >
                    كل الأنواع
                  </button>
                  {(Object.entries(CATEGORY_NAMES) as [ServiceCategory, string][]).filter(([key]) => key !== 'OTHER').map(([key, name]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`w-full text-start px-3 py-2.5 rounded-lg text-sm transition-all ${selectedCategory === key ? 'bg-violet-500/20 border border-violet-500/30 text-violet-300' : 'hover:bg-white/[0.08] text-zinc-400 border border-transparent'}`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-3">
                  <Filter className="w-4 h-4 text-cyan-400" />
                  الترتيب
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-700/50 border border-white/[0.18] rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:ring-2 focus:ring-violet-500/20 appearance-none cursor-pointer"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-zinc-800">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-white/[0.18]">
                <Link href="/favorites">
                  <Button variant="outline" className="w-full border-white/[0.18] text-zinc-300 hover:bg-zinc-700 hover:text-white rounded-xl py-5">
                    <Heart className="w-4 h-4 me-2 text-pink-400" />
                    المفضلة
                  </Button>
                </Link>
              </div>
            </div>
          </aside>

          {/* Services Grid */}
          <main className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-zinc-400">
                <span className="text-white font-semibold">{filteredServices.length}</span> خدمة
              </p>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block w-16 h-16 rounded-full border-4 border-violet-500/20 border-t-indigo-500 animate-spin"></div>
                <p className="mt-6 text-zinc-400">جاري التحميل...</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-20 bg-white/[0.07] rounded-2xl border border-white/[0.18]">
                <div className="w-20 h-20 mx-auto mb-6 bg-slate-700/50 rounded-full flex items-center justify-center">
                  <Search className="w-10 h-10 text-zinc-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">ما لقينا شي</h3>
                <p className="text-zinc-400 mb-6">
                  جرب تغيير الفلتر أو البحث
                </p>
                <Button 
                  onClick={() => { setSelectedGame(""); setSelectedCategory(""); setSearchQuery(""); }}
                  className="bg-violet-600 hover:bg-indigo-500"
                >
                  مسح الكل
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function ServicesLoading() {
  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-16 h-16 rounded-full border-4 border-violet-500/20 border-t-indigo-500 animate-spin"></div>
        <p className="mt-6 text-zinc-400">جاري التحميل...</p>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<ServicesLoading />}>
      <ServicesContent />
    </Suspense>
  );
}
