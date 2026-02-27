import Link from "next/link";
import Image from "next/image";
import { Clock, Star } from "lucide-react";
import { Service, GAME_NAMES, GAME_IMAGES, GameCategory } from "@/types";

export default function ServiceCard({ service }: { service: Service }) {
  // Game-specific gradient backgrounds
  const gameBgs: Record<string, string> = {
    LEAGUE_OF_LEGENDS: "from-amber-600/20 to-amber-950/40",
    VALORANT: "from-red-500/20 to-red-950/40",
    CS2: "from-orange-500/20 to-orange-950/40",
    DOTA2: "from-rose-500/20 to-rose-950/40",
    OVERWATCH: "from-orange-400/15 to-orange-950/40",
    APEX_LEGENDS: "from-red-500/15 to-red-950/40",
    FORTNITE: "from-blue-500/15 to-blue-950/40",
    ROCKET_LEAGUE: "from-cyan-500/15 to-cyan-950/40",
    RAINBOW_SIX: "from-zinc-500/15 to-zinc-900/40",
    COD_WARZONE: "from-green-500/15 to-green-950/40",
    PUBG: "from-yellow-600/15 to-yellow-950/40",
    OTHER: "from-violet-500/15 to-violet-950/40",
  };

  const gameBg = gameBgs[service.game] || gameBgs.OTHER;
  const gameName = GAME_NAMES[service.game as GameCategory] || service.game;
  const gameImage = GAME_IMAGES[service.game as GameCategory] || '';

  const reviews = service.reviews || [];
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;
  const reviewCount = reviews.length;

  return (
    <Link href={`/services/${service.id}`} className="block group">
      <div className="bg-white/[0.06] rounded-xl border border-white/[0.12] overflow-hidden hover:border-violet-500/40 transition-all card-hover cursor-pointer hover:shadow-lg hover:shadow-violet-600/10">
        {/* Header area */}
        <div className={`relative h-40 bg-gradient-to-br ${gameBg} flex flex-col justify-between p-4 overflow-hidden`}>
          {/* صورة اللعبة كخلفية */}
          {gameImage && (
            <Image
              src={gameImage}
              alt={gameName}
              fill
              className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          {/* Game name */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-md text-xs font-medium text-zinc-200">
              {gameName}
            </span>
            {service.featured && (
              <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/30 rounded-md text-xs font-medium text-amber-300">
                مميز
              </span>
            )}
          </div>
          
          {/* Price */}
          <div className="relative z-10 self-start">
            <span className="text-xs text-zinc-400">من </span>
            <span className="text-xl font-bold text-white">${service.price}</span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-white mb-1.5 line-clamp-2 min-h-[2.75rem] group-hover:text-violet-300 transition-colors text-[15px] leading-snug">
            {service.title}
          </h3>
          <p className="text-sm text-zinc-500 mb-3 line-clamp-2">{service.description}</p>
          
          {/* Booster */}
          <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-white/10">
            <div className="w-8 h-8 bg-violet-500/15 border border-violet-500/20 rounded-full flex items-center justify-center text-violet-400 font-medium text-xs">
              {service.booster?.name?.charAt(0) || "B"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-200 truncate">{service.booster?.name || "Pro Booster"}</p>
              {reviewCount > 0 ? (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs text-amber-400 font-medium">{averageRating.toFixed(1)}</span>
                  <span className="text-xs text-zinc-600">({reviewCount})</span>
                </div>
              ) : (
                <p className="text-xs text-zinc-600">بائع جديد</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-zinc-500">
              <Clock className="w-3.5 h-3.5 me-1 text-zinc-600" />
              {service.deliveryTime}
            </div>
            <span className="text-sm font-medium text-violet-400 group-hover:text-violet-300 transition-colors">
              التفاصيل ←
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
