"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/service-card";
import { useAuth } from "@/contexts/auth-context";

export default function FavoritesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:3001/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (serviceId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      await fetch(`http://localhost:3001/favorites/${serviceId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavorites(favorites.filter((fav) => fav.serviceId !== serviceId));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      {/* Header Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/20 rounded-full border border-pink-500/30 mb-4">
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
              <span className="text-sm text-pink-300">Your Collection</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              My <span className="text-gradient">Favorites</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              All your saved boost services in one place
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-slate-700/50 max-w-lg mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-slate-700/50 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-gray-500" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">No favorites yet</h2>
            <p className="text-gray-400 mb-8">
              Start adding services to your favorites to see them here
            </p>
            <Button onClick={() => router.push("/services")}>
              <Sparkles className="w-4 h-4 mr-2" />
              Browse Services
            </Button>
          </div>
        ) : (
          <>
            <p className="text-gray-400 mb-6">
              <span className="text-white font-semibold">{favorites.length}</span> saved services
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((favorite) => (
                <div key={favorite.id} className="relative group">
                  <ServiceCard service={favorite.service} />
                  <button
                    onClick={() => removeFavorite(favorite.serviceId)}
                    className="absolute top-4 right-4 p-2.5 bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 hover:border-red-600"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
