"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Clock, Heart, MessageCircle, Shield, ArrowLeft, CheckCircle, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Service, GAME_NAMES, CATEGORY_NAMES, GameCategory, ServiceCategory } from "@/types";
import { useAuth } from "@/contexts/auth-context";
import { API_URL } from "@/lib/config";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchService();
      if (user) {
        checkFavorite();
      }
    }
  }, [params.id, user]);

  const fetchService = async () => {
    try {
      const response = await fetch(`${API_URL}/services/${params.id}`);
      const data = await response.json();
      setService(data);
    } catch (error) {
      console.error("Error fetching service:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${API_URL}/favorites/${params.id}/check`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setIsFavorite(data.isFavorite);
    } catch (error) {
      console.error("Error checking favorite:", error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const method = isFavorite ? "DELETE" : "POST";
      await fetch(`${API_URL}/favorites/${params.id}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleOrderNow = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    router.push(`/checkout?serviceId=${service?.id}`);
  };

  const handleContactBooster = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    // Don't allow messaging yourself
    if (user.id === service?.boosterId) {
      return;
    }
    // Navigate to messages page with booster's user ID
    router.push(`/messages?userId=${service?.boosterId}&serviceId=${service?.id}`);
  };

  // Check if user is the booster
  const isOwnService = user?.id === service?.boosterId;

  // Game-specific gradient colors
  const gameGradients: Record<string, string> = {
    LEAGUE_OF_LEGENDS: "from-yellow-600 via-yellow-700 to-yellow-900",
    VALORANT: "from-red-500 via-pink-600 to-red-800",
    CSGO: "from-orange-500 via-amber-600 to-orange-800",
    DOTA2: "from-red-700 via-red-800 to-red-950",
    OVERWATCH: "from-orange-400 via-orange-500 to-orange-700",
    APEX_LEGENDS: "from-red-500 via-red-600 to-red-800",
    FORTNITE: "from-blue-500 via-purple-500 to-indigo-700",
    ROCKET_LEAGUE: "from-blue-500 via-cyan-500 to-blue-700",
    RAINBOW_SIX: "from-slate-600 via-slate-700 to-slate-900",
    COD_WARZONE: "from-green-700 via-green-800 to-green-950",
    OTHER: "from-indigo-600 via-purple-600 to-indigo-800",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-slate-800 rounded-full flex items-center justify-center">
            <Gamepad2 className="w-10 h-10 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Service not found</h2>
          <Link href="/services">
            <Button>Browse Services</Button>
          </Link>
        </div>
      </div>
    );
  }

  const gradient = gameGradients[service.game] || gameGradients.OTHER;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      {/* Hero Banner */}
      <div className={`relative h-64 bg-gradient-to-br ${gradient} overflow-hidden`}>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        
        <div className="container mx-auto px-4 pt-6 relative z-10">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Services
          </button>
          
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white border border-white/20">
              {GAME_NAMES[service.game as GameCategory] || service.game}
            </span>
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white border border-white/20">
              {CATEGORY_NAMES[service.category as ServiceCategory] || service.category}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-4">{service.title}</h1>
                </div>
                <button
                  onClick={toggleFavorite}
                  className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isFavorite ? "fill-pink-500 text-pink-500" : "text-gray-400"
                    }`}
                  />
                </button>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">About This Service</h3>
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{service.description}</p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                      <Clock className="w-5 h-5 text-indigo-400" />
                    </div>
                    <span className="text-sm text-gray-400">Delivery Time</span>
                  </div>
                  <p className="font-semibold text-white text-lg">{service.deliveryTime}</p>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Shield className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="text-sm text-gray-400">Secure Service</span>
                  </div>
                  <p className="font-semibold text-white text-lg">100% Protected</p>
                </div>
              </div>

              {/* What's Included */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">What's Included</h3>
                <div className="space-y-3">
                  {["Professional boosting service", "Real-time progress updates", "Account safety guaranteed", "24/7 customer support"].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Order Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 sticky top-24 mb-6">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gradient mb-2">
                  ${service.price}
                </div>
                <p className="text-gray-400 text-sm">One-time payment</p>
              </div>

              {isOwnService ? (
                <div className="text-center text-gray-400 py-4">
                  <p>This is your offer</p>
                  <Link href="/dashboard" className="text-indigo-400 hover:underline text-sm">
                    Manage in Dashboard
                  </Link>
                </div>
              ) : (
                <>
                  <Button className="w-full mb-3 py-6 text-lg" size="lg" onClick={handleOrderNow}>
                    Order Now
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full py-5"
                    onClick={handleContactBooster}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Booster
                  </Button>
                </>
              )}

              <div className="mt-6 pt-6 border-t border-slate-700">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Secure payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Money-back guarantee</span>
                </div>
              </div>
            </div>

            {/* Booster Card */}
            {service.booster && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <h3 className="font-semibold text-white mb-4">About the Booster</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {service.booster.name?.charAt(0) || "B"}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-lg">{service.booster.name}</p>
                    <p className="text-indigo-400 text-sm">Verified Pro Booster</p>
                  </div>
                </div>
                {service.booster.bio && (
                  <p className="text-gray-400 text-sm">{service.booster.bio}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
