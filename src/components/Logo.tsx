import { useId } from "react";

type LogoMarkProps = {
  size?: number;
  className?: string;
  glow?: boolean;
  monochrome?: boolean;
};

/**
 * IT-ools brand mark.
 *
 * Concept: a stylized command-line prompt — a fluid chevron (the `>` of a
 * shell) paired with a luminous cursor block. Horizontal, organic, never a
 * basic square. Built as a single SVG so it scales from favicon to hero.
 */
export function LogoMark({
  size = 36,
  className = "",
  glow = true,
  monochrome = false,
}: LogoMarkProps) {
  const id = useId().replace(/:/g, "");
  const gradId = `itools-grad-${id}`;
  const cursorGradId = `itools-cursor-${id}`;
  const glowId = `itools-glow-${id}`;

  return (
    <svg
      viewBox="0 0 56 40"
      width={size * (56 / 40)}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          {monochrome ? (
            <>
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
              <stop offset="100%" stopColor="currentColor" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#7dd9ff" />
              <stop offset="45%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </>
          )}
        </linearGradient>
        <linearGradient id={cursorGradId} x1="0" y1="0" x2="0" y2="1">
          {monochrome ? (
            <>
              <stop offset="0%" stopColor="currentColor" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.85" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#a5f3fc" />
              <stop offset="100%" stopColor="#22d3ee" />
            </>
          )}
        </linearGradient>
        {glow && !monochrome && (
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      <g filter={glow && !monochrome ? `url(#${glowId})` : undefined}>
        {/* Soft underline track — suggests a CLI baseline */}
        <path
          d="M4 33 H40"
          stroke={`url(#${gradId})`}
          strokeOpacity="0.25"
          strokeWidth="1.25"
          strokeLinecap="round"
        />

        {/* Chevron `>` — the prompt */}
        <path
          d="M8 11 L22 20 L8 29"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Cursor block — blinks the rhythm of a terminal */}
        <rect
          x="28"
          y="16"
          width="18"
          height="8"
          rx="2.5"
          fill={`url(#${cursorGradId})`}
        />

        {/* Subtle inner highlight on cursor */}
        <rect
          x="28"
          y="16"
          width="18"
          height="2.5"
          rx="1.25"
          fill="#ffffff"
          fillOpacity={monochrome ? "0" : "0.35"}
        />
      </g>
    </svg>
  );
}

type LogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
};

const sizeMap = {
  sm: { mark: 22, text: "text-base", tag: "text-[9px]" },
  md: { mark: 30, text: "text-lg", tag: "text-[10px]" },
  lg: { mark: 44, text: "text-2xl", tag: "text-[11px]" },
  xl: { mark: 68, text: "text-5xl", tag: "text-xs" },
} as const;

export function Logo({ size = "md", showTagline = true, className = "" }: LogoProps) {
  const s = sizeMap[size];
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={s.mark} />
      <div className="flex flex-col leading-none">
        <span className={`font-display ${s.text} font-bold tracking-tight`}>
          IT<span className="text-gradient">-ools</span>
        </span>
        {showTagline && (
          <span className={`font-mono ${s.tag} text-muted-foreground mt-1`}>
            command-line · cyber · osint
          </span>
        )}
      </div>
    </div>
  );
}
