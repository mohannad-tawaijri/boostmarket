"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Clock, Heart, MessageCircle, Shield, ArrowRight, CheckCircle, Gamepad2, Star, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Service, GAME_NAMES, CATEGORY_NAMES, GAME_IMAGES, GameCategory, ServiceCategory, Review } from "@/types";
import { useAuth } from "@/contexts/auth-context";
import { API_URL } from "@/lib/config";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchService();
      fetchReviews();
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

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/reviews/service/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
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
    // Get booster ID from either boosterId or booster.id
    const boosterId = service?.boosterId || service?.booster?.id;
    if (!service || !boosterId) {
      return;
    }
    // Don't allow messaging yourself
    if (user.id === boosterId) {
      return;
    }
    // Navigate to messages page with booster's user ID
    router.push(`/messages?userId=${boosterId}&serviceId=${service.id}`);
  };

  // Check if user is the booster
  const boosterId = service?.boosterId || service?.booster?.id;
  const isOwnService = user?.id === boosterId;

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
    RAINBOW_SIX: "from-zinc-700 via-zinc-800 to-zinc-900",
    COD_WARZONE: "from-green-700 via-green-800 to-green-950",
    OTHER: "from-indigo-600 via-purple-600 to-indigo-800",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-violet-500/20 border-t-indigo-500 animate-spin"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-white/[0.06] rounded-full flex items-center justify-center">
            <Gamepad2 className="w-10 h-10 text-zinc-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">هالخدمة مو موجودة</h2>
          <Link href="/services">
            <Button>رجوع للخدمات</Button>
          </Link>
        </div>
      </div>
    );
  }

  const gradient = gameGradients[service.game] || gameGradients.OTHER;

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Banner */}
      <div className={`relative h-64 bg-gradient-to-br ${gradient} overflow-hidden`}>
        {/* صورة اللعبة كخلفية */}
        {GAME_IMAGES[service.game as GameCategory] && (
          <Image
            src={GAME_IMAGES[service.game as GameCategory]}
            alt={GAME_NAMES[service.game as GameCategory] || service.game}
            fill
            className="object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-transparent to-transparent"></div>
        
        <div className="container mx-auto px-4 pt-6 relative z-10">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
          >
            <ArrowRight className="w-5 h-5" />
            العودة للخدمات
          </button>
          
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium text-white border border-white/20">
              {GAME_NAMES[service.game as GameCategory] || service.game}
            </span>
            <span className="px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium text-white border border-white/20">
              {CATEGORY_NAMES[service.category as ServiceCategory] || service.category}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white/[0.03] rounded-2xl border border-white/[0.08] p-8 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-4">{service.title}</h1>
                </div>
                <button
                  onClick={toggleFavorite}
                  className="p-3 bg-slate-700/50 hover:bg-zinc-700 rounded-xl transition-colors"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isFavorite ? "fill-pink-500 text-pink-500" : "text-zinc-400"
                    }`}
                  />
                </button>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">عن الخدمة</h3>
                <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">{service.description}</p>
              </div>

              {/* Tags */}
              {service.tags && service.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-violet-400" />
                    التاقز
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/20 border border-violet-500/20 text-violet-300 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-700/30 p-4 rounded-xl border border-zinc-700/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                      <Clock className="w-5 h-5 text-violet-400" />
                    </div>
                    <span className="text-sm text-zinc-400">مدة التنفيذ</span>
                  </div>
                  <p className="font-semibold text-white text-lg">{service.deliveryTime}</p>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-xl border border-zinc-700/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Shield className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="text-sm text-zinc-400">خدمة مضمونة</span>
                  </div>
                  <p className="font-semibold text-white text-lg">حماية كاملة</p>
                </div>
              </div>

              {/* What's Included */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">وش تحصل</h3>
                <div className="space-y-3">
                  {["بوست احترافي", "متابعة لحظية", "حسابك بأمان", "دعم 24/7"].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 text-zinc-300">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    التقييمات {reviews.length > 0 && `(${reviews.length})`}
                  </h3>
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-semibold">
                        {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {reviews.length === 0 ? (
                  <div className="bg-slate-700/30 rounded-xl p-6 text-center">
                    <Star className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                    <p className="text-zinc-400">لا يوجد تقييمات حالياً</p>
                    <p className="text-zinc-500 text-sm">كن أول من يقيّم!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-slate-700/30 rounded-xl p-4 border border-zinc-700/50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {review.reviewer?.name?.charAt(0) || "U"}
                            </div>
                            <div>
                              <p className="text-white font-medium">{review.reviewer?.name || "مستخدم"}</p>
                              <p className="text-zinc-500 text-xs">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-zinc-300 text-sm">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
            {/* Order Card */}
            <div className="bg-white/[0.03] rounded-2xl border border-white/[0.08] p-6">
              <div className="text-center mb-6">
                <p className="text-zinc-400 text-sm mb-1">من</p>
                <div className="text-4xl font-bold text-violet-400 mb-2">
                  ${service.price}
                </div>
                <p className="text-zinc-500 text-xs">السعر النهائي بعد الاتفاق بالمحادثة</p>
              </div>

              {isOwnService ? (
                <div className="text-center text-zinc-400 py-4">
                  <p>هذا عرضك</p>
                  <Link href="/dashboard" className="text-violet-400 hover:underline text-sm">
                    إدارة من حسابي
                  </Link>
                </div>
              ) : (
                <>
                  <Button
                    className="w-full mb-3 py-6 text-lg"
                    size="lg"
                    onClick={handleContactBooster}
                  >
                    <MessageCircle className="w-5 h-5 me-2" />
                    اطلب عرض خاص
                  </Button>

                  <p className="text-center text-zinc-500 text-xs">
                    كلّم البوستر وناقش طلبك
                  </p>
                </>
              )}

              <div className="mt-6 pt-6 border-t border-white/[0.08]">
                <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>دفع آمن</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>استرجاع مضمون</span>
                </div>
              </div>
            </div>

            {/* Booster Card */}
            {service.booster && (
              <div className="bg-white/[0.03] rounded-2xl border border-white/[0.08] p-6">
                <h3 className="font-semibold text-white mb-4">عن البوستر</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {service.booster.name?.charAt(0) || "B"}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-lg">{service.booster.name}</p>
                    <p className="text-violet-400 text-sm">بوستر موثق</p>
                  </div>
                </div>
                {service.booster.bio && (
                  <p className="text-zinc-400 text-sm">{service.booster.bio}</p>
                )}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
