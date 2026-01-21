import Link from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";
import { Service, GAME_NAMES, GameCategory } from "@/types";

export default function ServiceCard({ service }: { service: Service }) {
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

  const gradient = gameGradients[service.game] || gameGradients.OTHER;
  const gameName = GAME_NAMES[service.game as GameCategory] || service.game;

  return (
    <div className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden hover:border-indigo-500/50 transition-all duration-300 card-hover">
      <div className={`relative h-44 bg-gradient-to-br ${gradient} overflow-hidden`}>
        {/* Overlay pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        
        {/* Game Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full text-xs font-semibold text-white border border-white/20">
            {gameName}
          </span>
        </div>
        
        {/* Featured Badge */}
        {service.featured && (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-white shadow-lg">
              ⭐ Featured
            </span>
          </div>
        )}
        
        {/* Price */}
        <div className="absolute bottom-3 right-3">
          <div className="text-2xl font-bold text-white drop-shadow-lg bg-black/30 backdrop-blur-sm px-3 py-1 rounded-lg">
            ${service.price}
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="font-semibold text-lg text-white mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-indigo-300 transition-colors">
          {service.title}
        </h3>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{service.description}</p>
        
        {/* Booster Info */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {service.booster?.name?.charAt(0) || "B"}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{service.booster?.name || "Pro Booster"}</p>
              <p className="text-xs text-gray-500">Verified Booster</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-400">
            <Clock className="w-4 h-4 mr-1.5 text-indigo-400" />
            {service.deliveryTime}
          </div>

          <Link href={`/services/${service.id}`}>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl group/btn">
              <span className="flex items-center gap-1">
                View
                <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
