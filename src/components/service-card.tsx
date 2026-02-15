import Link from "next/link";
import { Clock, Star, Tag } from "lucide-react";
import { Service, GAME_NAMES, GameCategory } from "@/types";

export default function ServiceCard({ service }: { service: Service }) {
  // Game-specific muted background colors
  const gameBgs: Record<string, string> = {
    LEAGUE_OF_LEGENDS: "bg-amber-900/30",
    VALORANT: "bg-red-900/30",
    CSGO: "bg-orange-900/30",
    DOTA2: "bg-rose-900/30",
    OVERWATCH: "bg-orange-800/30",
    APEX_LEGENDS: "bg-red-800/30",
    FORTNITE: "bg-blue-900/30",
    ROCKET_LEAGUE: "bg-cyan-900/30",
    RAINBOW_SIX: "bg-zinc-700/30",
    COD_WARZONE: "bg-green-900/30",
    OTHER: "bg-violet-900/30",
  };

  const gameBg = gameBgs[service.game] || gameBgs.OTHER;
  const gameName = GAME_NAMES[service.game as GameCategory] || service.game;

  const reviews = service.reviews || [];
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;
  const reviewCount = reviews.length;

  return (
    <Link href={`/services/${service.id}`} className="block group">
      <div className="bg-zinc-900/60 rounded-xl border border-zinc-800/60 overflow-hidden hover:border-zinc-700 transition-colors card-hover cursor-pointer">
        {/* Header area */}
        <div className={`relative h-40 ${gameBg} flex flex-col justify-between p-4`}>
          {/* Game name */}
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 bg-black/30 backdrop-blur-sm rounded-md text-xs font-medium text-zinc-200">
              {gameName}
            </span>
            {service.featured && (
              <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/30 rounded-md text-xs font-medium text-amber-300">
                Featured
              </span>
            )}
          </div>
          
          {/* Price */}
          <div className="self-end">
            <span className="text-xs text-zinc-400">from </span>
            <span className="text-xl font-bold text-white">${service.price}</span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-white mb-1.5 line-clamp-2 min-h-[2.75rem] group-hover:text-violet-300 transition-colors text-[15px] leading-snug">
            {service.title}
          </h3>
          <p className="text-sm text-zinc-500 mb-3 line-clamp-2">{service.description}</p>
          
          {/* Booster */}
          <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-zinc-800/60">
            <div className="w-8 h-8 bg-violet-600/20 rounded-full flex items-center justify-center text-violet-400 font-medium text-xs">
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
                <p className="text-xs text-zinc-600">New seller</p>
              )}
            </div>
          </div>

          {/* Tags */}
          {service.tags && service.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {service.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-800/60 text-zinc-500 rounded text-xs"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
              {service.tags.length > 3 && (
                <span className="px-2 py-0.5 text-zinc-600 text-xs">
                  +{service.tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-zinc-500">
              <Clock className="w-3.5 h-3.5 mr-1 text-zinc-600" />
              {service.deliveryTime}
            </div>
            <span className="text-sm font-medium text-violet-400 group-hover:text-violet-300 transition-colors">
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
