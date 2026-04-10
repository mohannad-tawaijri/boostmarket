'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Star, 
  MessageCircle, 
  Shield, 
  CheckCircle, 
  Gamepad2, 
  ArrowRight, 
  Calendar,
  Loader2,
  ShieldOff,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useSocket } from '@/contexts/socket-context';
import { GAME_NAMES, CATEGORY_NAMES, GameCategory, ServiceCategory } from '@/types';
import { API_URL } from '@/lib/config';
import AvatarInspect from '@/components/avatar-inspect';

interface PublicProfile {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  role?: string;
  verified?: boolean;
  showOnlineStatus?: boolean;
  createdAt?: string;
  profileHidden?: boolean;
  boosterProfile?: {
    rating: number;
    completedOrders: number;
    verified: boolean;
    availableForHire: boolean;
    games: string[];
  };
  services?: {
    id: string;
    title: string;
    game: string;
    category: string;
    price: number;
    images: string[];
    deliveryTime: string;
  }[];
  receivedReviews?: {
    id: string;
    rating: number;
    comment?: string;
    createdAt: string;
    reviewer: { id: string; name: string; avatar?: string };
  }[];
  _count?: {
    services: number;
    receivedReviews: number;
  };
}

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { onlineUsers, checkOnlineUsers } = useSocket();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const profileId = params.id as string;
  const isOwnProfile = user?.id === profileId;
  const isOnline = onlineUsers.has(profileId);

  useEffect(() => {
    if (profileId) {
      fetchProfile();
      checkOnlineUsers([profileId]);
    }
  }, [profileId]);

  // Redirect to settings if viewing own profile
  useEffect(() => {
    if (isOwnProfile) {
      router.replace('/profile');
    }
  }, [isOwnProfile, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${profileId}/public`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        setProfile(null);
      }
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <ShieldOff className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">المستخدم غير موجود</h2>
          <p className="text-zinc-400 mb-4">لم يتم العثور على هذا الملف الشخصي</p>
          <Link href="/">
            <Button>العودة للرئيسية</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (profile.profileHidden) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">الملف الشخصي خاص</h2>
          <p className="text-zinc-400 mb-4">هذا المستخدم أخفى ملفه الشخصي</p>
          <Link href="/">
            <Button>العودة للرئيسية</Button>
          </Link>
        </div>
      </div>
    );
  }

  const booster = profile.boosterProfile;
  const avgRating = booster?.rating ?? 0;

  return (
    <div className="min-h-screen bg-transparent py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors">
          <ArrowRight className="w-4 h-4" />
          رجوع
        </button>

        {/* Profile Header Card */}
        <div className="bg-white/[0.09] border border-white/[0.15] rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              {profile.avatar ? (
                <AvatarInspect src={profile.avatar} alt={profile.name}>
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-violet-500/30 hover:border-violet-500/60 transition-colors"
                  />
                </AvatarInspect>
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-violet-600 flex items-center justify-center">
                  <Gamepad2 className="w-12 h-12 text-white" />
                </div>
              )}
              {/* Online indicator */}
              {profile.showOnlineStatus && isOnline && (
                <span className="absolute bottom-1 end-1 w-5 h-5 bg-green-500 border-3 border-zinc-900 rounded-full" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-right">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{profile.name}</h1>
                {profile.verified && (
                  <CheckCircle className="w-6 h-6 text-blue-400" />
                )}
                {booster?.verified && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-500/20 text-violet-400 border border-violet-500/30">
                    بوستر معتمد
                  </span>
                )}
              </div>

              {/* Online status text */}
              {profile.showOnlineStatus && (
                <p className={`text-sm mb-2 ${isOnline ? 'text-green-400' : 'text-zinc-500'}`}>
                  {isOnline ? 'متصل الآن' : 'غير متصل'}
                </p>
              )}

              {profile.bio && (
                <p className="text-zinc-300 mb-3 max-w-lg">{profile.bio}</p>
              )}

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-zinc-400">
                {profile.createdAt && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    عضو منذ {new Date(profile.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}
                  </span>
                )}
                {profile.role === 'BOOSTER' && profile._count && (
                  <>
                    <span>{profile._count.services} خدمة</span>
                    <span>{profile._count.receivedReviews} تقييم</span>
                  </>
                )}
              </div>

              {/* Action buttons */}
              {user && !isOwnProfile && (
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4">
                  <Link href={`/messages?userId=${profile.id}`}>
                    <Button className="gap-2">
                      <MessageCircle className="w-4 h-4" />
                      مراسلة
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Booster Stats Card */}
            {booster && (
              <div className="bg-white/[0.07] border border-white/[0.12] rounded-xl p-5 min-w-[180px]">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-2xl font-bold text-white">{avgRating.toFixed(1)}</span>
                  </div>
                  <p className="text-zinc-500 text-sm mb-3">التقييم العام</p>
                  <div className="text-sm space-y-1">
                    <p className="text-zinc-300">{booster.completedOrders} طلب مكتمل</p>
                    {booster.availableForHire ? (
                      <p className="text-green-400">متاح للعمل</p>
                    ) : (
                      <p className="text-zinc-500">غير متاح حالياً</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booster games */}
          {booster && booster.games.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/[0.1]">
              <h3 className="text-sm font-medium text-zinc-400 mb-3">الألعاب</h3>
              <div className="flex flex-wrap gap-2">
                {booster.games.map((game) => (
                  <span key={game} className="px-3 py-1.5 rounded-lg text-sm bg-white/[0.07] border border-white/[0.12] text-zinc-300">
                    {GAME_NAMES[game as GameCategory] || game}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Services Section */}
        {profile.services && profile.services.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-4">الخدمات</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.services.map((service) => (
                <Link key={service.id} href={`/services/${service.id}`}>
                  <div className="bg-white/[0.09] border border-white/[0.15] rounded-xl overflow-hidden hover:border-violet-500/30 transition-all group">
                    {service.images[0] && (
                      <div className="h-36 overflow-hidden">
                        <img
                          src={service.images[0]}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <p className="text-sm text-violet-400 mb-1">
                        {GAME_NAMES[service.game as GameCategory] || service.game} · {CATEGORY_NAMES[service.category as ServiceCategory] || service.category}
                      </p>
                      <h3 className="text-white font-medium truncate mb-2">{service.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-green-400 font-bold">{service.price} ر.س</span>
                        <span className="text-zinc-500 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {service.deliveryTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {profile.receivedReviews && profile.receivedReviews.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">التقييمات</h2>
            <div className="space-y-4">
              {profile.receivedReviews.map((review) => (
                <div key={review.id} className="bg-white/[0.09] border border-white/[0.15] rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <Link href={`/profile/${review.reviewer.id}`}>
                      {review.reviewer.avatar ? (
                        <img
                          src={review.reviewer.avatar}
                          alt={review.reviewer.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-violet-600/30 flex items-center justify-center text-violet-400 font-medium text-sm">
                          {review.reviewer.name.charAt(0)}
                        </div>
                      )}
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <Link href={`/profile/${review.reviewer.id}`} className="text-white font-medium hover:text-violet-400 transition-colors">
                          {review.reviewer.name}
                        </Link>
                        <span className="text-zinc-500 text-xs">
                          {new Date(review.createdAt).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600'}`}
                          />
                        ))}
                      </div>
                      {review.comment && (
                        <p className="text-zinc-300 text-sm">{review.comment}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
