import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizes = {
    sm: { icon: "w-7 h-7", text: "text-lg" },
    md: { icon: "w-9 h-9", text: "text-xl" },
    lg: { icon: "w-12 h-12", text: "text-3xl" },
  };

  const s = sizes[size];

  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      {/* Simple icon mark */}
      <div className={`${s.icon} rounded-lg bg-violet-600 flex items-center justify-center`}>
        <svg viewBox="0 0 24 24" fill="none" className="w-[60%] h-[60%] text-white">
          <path
            d="M13 3L4 14h7l-1 7 9-11h-7l1-7z"
            fill="currentColor"
          />
        </svg>
      </div>

      {showText && (
        <span className={`${s.text} font-bold tracking-tight text-white`}>
          Boost<span className="text-violet-400">Market</span>
        </span>
      )}
    </Link>
  );
}
