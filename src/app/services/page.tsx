"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Filter, Heart, Sparkles, SlidersHorizontal, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/service-card";
import { Service, GameCategory, GAME_NAMES } from "@/types";
import { API_URL } from "@/lib/config";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "most_liked", label: "Most Popular" },
  { value: "most_viewed", label: "Most Viewed" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
];

function ServicesContent() {
  const searchParams = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  // Get search query from URL params
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchServices();
  }, [selectedGame, sortBy]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedGame) params.append("game", selectedGame);
      if (sortBy) params.append("sortBy", sortBy);

      const response = await fetch(`${API_URL}/services?${params}`);
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((service) =>
    searchQuery
      ? service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.booster?.name && service.booster.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : true
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 rounded-full border border-indigo-500/30 mb-4">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-indigo-300">Discover Amazing Boosters</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Browse <span className="text-gradient">Boost Services</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Find the perfect booster for your gaming needs
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search services, games, boosters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 sticky top-24">
              <h3 className="font-semibold text-lg text-white mb-6 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
                Filters
              </h3>

              {/* Game Filter */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                  <Gamepad2 className="w-4 h-4 text-purple-400" />
                  Game
                </label>
                <select
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer"
                >
                  <option value="" className="bg-slate-800">All Games</option>
                  {Object.entries(GAME_NAMES).map(([key, name]) => (
                    <option key={key} value={key} className="bg-slate-800">
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                  <Filter className="w-4 h-4 text-cyan-400" />
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-slate-800">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <Link href="/favorites">
                  <Button variant="outline" className="w-full border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white rounded-xl py-5">
                    <Heart className="w-4 h-4 mr-2 text-pink-400" />
                    My Favorites
                  </Button>
                </Link>
              </div>
            </div>
          </aside>

          {/* Services Grid */}
          <main className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-400">
                <span className="text-white font-semibold">{filteredServices.length}</span> services found
              </p>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
                <p className="mt-6 text-gray-400">Loading amazing offers...</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                <div className="w-20 h-20 mx-auto mb-6 bg-slate-700/50 rounded-full flex items-center justify-center">
                  <Search className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No services found</h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your filters or search query
                </p>
                <Button 
                  onClick={() => { setSelectedGame(""); setSearchQuery(""); }}
                  className="bg-indigo-600 hover:bg-indigo-500"
                >
                  Clear Filters
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
        <p className="mt-6 text-gray-400">Loading services...</p>
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
