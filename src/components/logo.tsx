import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizes = {
    sm: { icon: "w-7 h-7",  text: "text-lg",   gap: "gap-2"   },
    md: { icon: "w-9 h-9",  text: "text-xl",   gap: "gap-2.5" },
    lg: { icon: "w-12 h-12", text: "text-3xl", gap: "gap-3"   },
  };

  const s = sizes[size];

  return (
    <Link href="/" className={`flex items-center ${s.gap} group ${className}`}>

      {/* Icon mark */}
      <div className={[
        s.icon,
        "relative flex-shrink-0 overflow-hidden",
        "rounded-xl",
        "bg-gradient-to-br from-violet-500 via-violet-600 to-purple-800",
        // resting ring + shadow
        "shadow-[0_0_0_1px_rgba(139,92,246,0.35),0_4px_14px_rgba(109,40,217,0.4)]",
        // hover ring + deeper glow + slight lift
        "group-hover:shadow-[0_0_0_1.5px_rgba(167,139,250,0.6),0_6px_24px_rgba(109,40,217,0.55)]",
        "group-hover:scale-[1.09]",
        "transition-all duration-200 ease-out",
        "flex items-center justify-center",
      ].join(" ")}>

        {/* Top-edge gloss — gives the mark depth */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-white/[0.18] to-transparent" />

        {/* Custom bolt — wider top section, tighter angles, punchier proportions */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="relative z-10 w-[56%] h-[56%] drop-shadow-sm"
        >
          {/*
            Points (clockwise):
              top-start  (14, 2)
              left-tip   ( 3, 14)
              mid-bar-L  (10, 14)
              bottom-tip ( 8.5, 22)
              right-tip  (21, 10)
              mid-bar-R  (14, 10)
            Creates a bolt that's noticeably wider at the top half,
            with a sharper lower tip — more "impact" than the stock icon.
          */}
          <path
            d="M14 2L3 14h7l-1.5 8L21 10h-7Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Wordmark */}
      {showText && (
        <span className={`${s.text} tracking-tight leading-none select-none`}>
          <span className="font-extrabold text-white">Boost</span>
          <span className="font-semibold text-violet-400">Market</span>
        </span>
      )}

    </Link>
  );
}
