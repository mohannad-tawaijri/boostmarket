import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  /** Render the full stacked lockup image (icon over wordmark) instead of icon + text. */
  lockup?: boolean;
  className?: string;
}

export default function Logo({ size = "md", showText = true, lockup = false, className = "" }: LogoProps) {
  // Full stacked lockup — used as a hero logo (e.g. auth pages).
  if (lockup) {
    const w = { sm: 160, md: 210, lg: 270 }[size];
    const h = Math.round((w * 559) / 917); // preserve the lockup's aspect ratio
    return (
      <Link href="/" className={`inline-block group ${className}`}>
        <Image
          src="/logo-full.png"
          alt="BoostMarket"
          width={w}
          height={h}
          priority
          className="h-auto max-w-full transition-transform duration-200 ease-out group-hover:scale-[1.03] drop-shadow-[0_0_16px_rgba(56,189,248,0.18)]"
        />
      </Link>
    );
  }

  const sizes = {
    sm: { icon: "w-9 h-9",   text: "text-lg",  gap: "gap-2"   },
    md: { icon: "w-11 h-11", text: "text-xl",  gap: "gap-2.5" },
    lg: { icon: "w-14 h-14", text: "text-3xl", gap: "gap-3"   },
  };

  const s = sizes[size];

  return (
    <Link href="/" className={`flex items-center ${s.gap} group ${className}`}>

      {/* Icon mark — the BM arrow monogram (transparent PNG, sits on dark) */}
      <div className={[
        s.icon,
        "relative flex-shrink-0",
        "group-hover:scale-[1.08]",
        "transition-transform duration-200 ease-out",
      ].join(" ")}>
        <Image
          src="/logo-icon.png"
          alt="BoostMarket"
          fill
          sizes="56px"
          className="object-contain drop-shadow-[0_0_8px_rgba(56,189,248,0.25)]"
        />
      </div>

      {/* Wordmark — neon blue "Boost" + orange "Market" to match the mark */}
      {showText && (
        <span className={`${s.text} font-extrabold tracking-tight leading-none select-none`}>
          <span className="text-sky-400" style={{ textShadow: "0 0 10px rgba(56,189,248,0.45)" }}>
            Boost
          </span>
          <span className="text-orange-500" style={{ textShadow: "0 0 10px rgba(249,115,22,0.45)" }}>
            Market
          </span>
        </span>
      )}

    </Link>
  );
}
