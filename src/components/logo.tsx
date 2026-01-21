import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizes = {
    sm: { icon: "w-8 h-8", text: "text-xl", rocket: "text-sm" },
    md: { icon: "w-10 h-10", text: "text-2xl", rocket: "text-base" },
    lg: { icon: "w-14 h-14", text: "text-4xl", rocket: "text-xl" },
  };

  const s = sizes[size];

  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className}`}>
      {/* Custom Logo Icon */}
      <div className={`${s.icon} relative`}>
        {/* Outer glow ring */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur-sm opacity-60 group-hover:opacity-100 transition-opacity"></div>
        
        {/* Main icon container */}
        <div className="relative w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-purple-500/30">
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20"></div>
          
          {/* Rocket/Boost icon - custom SVG */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={`${s.rocket} text-white relative z-10 drop-shadow-lg`}
            style={{ width: '60%', height: '60%' }}
          >
            {/* Rocket body */}
            <path
              d="M12 2L8 8V14L12 18L16 14V8L12 2Z"
              fill="currentColor"
              className="opacity-90"
            />
            {/* Rocket flames */}
            <path
              d="M10 16L12 22L14 16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-yellow-300"
              fill="none"
            />
            <path
              d="M9 15L12 20L15 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="text-orange-400"
              fill="none"
            />
            {/* Side boosters */}
            <path
              d="M6 10L8 8V12L6 14V10Z"
              fill="currentColor"
              className="opacity-70"
            />
            <path
              d="M18 10L16 8V12L18 14V10Z"
              fill="currentColor"
              className="opacity-70"
            />
            {/* Window */}
            <circle
              cx="12"
              cy="8"
              r="2"
              className="fill-indigo-300/80"
            />
          </svg>
          
          {/* Sparkle effects */}
          <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full opacity-80"></div>
          <div className="absolute top-2 left-1.5 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
        </div>
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${s.text} font-black tracking-tight`}>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Boost
            </span>
            <span className="text-white">Market</span>
          </span>
        </div>
      )}
    </Link>
  );
}
