import { useId } from "react";
import type { ProductArt as Art, BottleShape, GlassesShape, WatchShape } from "@/lib/types";

interface Props {
  art: Art;
  label?: string;
  className?: string;
}

/**
 * Placeholder product illustrations (pure SVG, zero image weight).
 * They get replaced by real photos uploaded from the admin panel.
 */
export function ProductArt({ art, label, className }: Props) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 400 500" className={className} role="img" aria-label={label ?? "Producto"}>
      <defs>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="55%" r="50%">
          <stop offset="0%" stopColor={art.accent} stopOpacity="0.28" />
          <stop offset="100%" stopColor={art.accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`gold-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f6e2ae" />
          <stop offset="45%" stopColor="#c9a25c" />
          <stop offset="100%" stopColor="#7d5f2c" />
        </linearGradient>
        <linearGradient id={`shine-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="18%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="26%" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="78%" stopColor="#fff" stopOpacity="0" />
          <stop offset="88%" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="270" rx="190" ry="210" fill={`url(#glow-${uid})`} />
      <ellipse cx="200" cy="452" rx="120" ry="12" fill="#000" opacity="0.45" />
      {art.kind === "bottle" && <Bottle uid={uid} shape={art.shape} liquid={art.liquid} cap={art.cap} accent={art.accent} label={label} />}
      {art.kind === "watch" && <Watch uid={uid} shape={art.shape} dial={art.dial} strap={art.strap} accent={art.accent} />}
      {art.kind === "glasses" && <Glasses uid={uid} shape={art.shape} frame={art.frame} lens={art.lens} accent={art.accent} />}
    </svg>
  );
}

/* ---------------------------------- Bottle --------------------------------- */

function bottleBody(shape: BottleShape) {
  switch (shape) {
    case "tall":
      return { body: "M140 150 h120 a12 12 0 0 1 12 12 v268 a14 14 0 0 1 -14 14 h-116 a14 14 0 0 1 -14 -14 v-268 a12 12 0 0 1 12 -12z", neck: [178, 120, 44, 34], cap: [160, 50, 80, 74, 6] };
    case "round":
      return { body: "M200 190 a120 120 0 1 1 -0.1 0z", neck: [180, 160, 40, 36], cap: [158, 92, 84, 72, 36] };
    case "oud":
      return { body: "M168 175 h64 c10 0 14 10 20 22 l40 90 c8 20 10 40 10 60 v62 a20 20 0 0 1 -20 20 h-164 a20 20 0 0 1 -20 -20 v-62 c0 -20 2 -40 10 -60 l40 -90 c6 -12 10 -22 20 -22z", neck: [182, 150, 36, 30], cap: [170, 46, 60, 108, 4] };
    case "heart":
      return { body: "M200 430 C120 372 82 330 82 270 C82 222 118 192 156 192 C178 192 192 204 200 220 C208 204 222 192 244 192 C282 192 318 222 318 270 C318 330 280 372 200 430z", neck: [184, 168, 32, 30], cap: [166, 104, 68, 68, 10] };
    case "hex":
      return { body: "M200 168 L300 222 L300 388 L200 442 L100 388 L100 222z", neck: [180, 140, 40, 34], cap: [156, 68, 88, 76, 4] };
    case "flacon":
    default:
      return { body: "M120 180 h160 a18 18 0 0 1 18 18 v226 a18 18 0 0 1 -18 18 h-160 a18 18 0 0 1 -18 -18 v-226 a18 18 0 0 1 18 -18z", neck: [176, 146, 48, 38], cap: [146, 70, 108, 80, 8] };
  }
}

function Bottle({ uid, shape, liquid, cap, accent, label }: { uid: string; shape: BottleShape; liquid: string; cap: string; accent: string; label?: string }) {
  const { body, neck, cap: c } = bottleBody(shape);
  const isGoldCap = cap.toLowerCase() === "#d4af6a" || cap.toLowerCase() === "#c9a26b" || cap.toLowerCase() === "#c9a25c";
  return (
    <g>
      <defs>
        <linearGradient id={`liq-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={liquid} stopOpacity="0.75" />
          <stop offset="100%" stopColor={liquid} stopOpacity="1" />
        </linearGradient>
        <linearGradient id={`cap-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={cap} />
          <stop offset="45%" stopColor={isGoldCap ? "#f6e2ae" : "#ffffff"} stopOpacity={isGoldCap ? 1 : 0.25} />
          <stop offset="55%" stopColor={cap} />
          <stop offset="100%" stopColor="#000" stopOpacity="0.6" />
        </linearGradient>
        <clipPath id={`clip-${uid}`}>
          <path d={body} />
        </clipPath>
      </defs>
      {/* neck */}
      <rect x={neck[0]} y={neck[1]} width={neck[2]} height={neck[3]} fill={`url(#gold-${uid})`} />
      {/* cap */}
      {shape === "oud" ? (
        <g>
          <path d={`M${c[0]} ${c[1] + c[3]} L${c[0] + 6} ${c[1] + 30} L${c[0] + c[2] / 2} ${c[1]} L${c[0] + c[2] - 6} ${c[1] + 30} L${c[0] + c[2]} ${c[1] + c[3]}z`} fill={`url(#gold-${uid})`} />
          <circle cx={c[0] + c[2] / 2} cy={c[1] - 6} r="10" fill={`url(#gold-${uid})`} />
          <path d={`M${c[0] + 8} ${c[1] + 60} h${c[2] - 16}`} stroke="#000" strokeOpacity="0.35" strokeWidth="2" />
        </g>
      ) : (
        <rect x={c[0]} y={c[1]} width={c[2]} height={c[3]} rx={c[4]} fill={`url(#cap-${uid})`} />
      )}
      {/* glass + liquid */}
      <path d={body} fill="#ffffff" fillOpacity="0.06" />
      <g clipPath={`url(#clip-${uid})`}>
        <rect x="60" y="205" width="280" height="260" fill={`url(#liq-${uid})`} />
        <rect x="60" y="196" width="280" height="10" fill={accent} opacity="0.35" />
        <rect x="60" y="140" width="280" height="320" fill={`url(#shine-${uid})`} />
      </g>
      <path d={body} fill="none" stroke={accent} strokeOpacity="0.55" strokeWidth="2" />
      {/* label */}
      {label && (
        <g>
          <rect x="134" y="300" width="132" height="46" rx="3" fill="#0b0a09" fillOpacity="0.72" stroke={`url(#gold-${uid})`} strokeWidth="1.2" />
          <text
            x="200"
            y="320"
            textAnchor="middle"
            fontFamily="var(--font-display), serif"
            fontSize={label.length > 11 ? 11 : 13}
            letterSpacing={label.length > 11 ? 1 : 2}
            fill="#f0d9a0"
            {...(label.length > 13 ? { textLength: 118, lengthAdjust: "spacingAndGlyphs" } : {})}
          >
            {label.toUpperCase()}
          </text>
          <text x="200" y="336" textAnchor="middle" fontFamily="var(--font-sans), sans-serif" fontSize="7" letterSpacing="3" fill="#bfae8e">
            EAU DE PARFUM
          </text>
        </g>
      )}
    </g>
  );
}

/* ---------------------------------- Watch ---------------------------------- */

function Watch({ uid, shape, dial, strap, accent }: { uid: string; shape: WatchShape; dial: string; strap: string; accent: string }) {
  const r = shape === "petite" ? 68 : 92;
  const cx = 200;
  const cy = 260;
  const strapW = shape === "petite" ? 62 : 92;
  const square = shape === "square";
  const ticks = Array.from({ length: 12 }, (_, i) => i);
  return (
    <g>
      <defs>
        <linearGradient id={`strap-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={strap} />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="100%" stopColor={strap} />
        </linearGradient>
        <radialGradient id={`dial-${uid}`} cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="100%" stopColor={dial} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* straps */}
      <rect x={cx - strapW / 2} y={30} width={strapW} height={cy - 30} rx="16" fill={strap} />
      <rect x={cx - strapW / 2} y={30} width={strapW} height={cy - 30} rx="16" fill={`url(#strap-${uid})`} opacity="0.6" />
      <rect x={cx - strapW / 2} y={cy} width={strapW} height={200} rx="16" fill={strap} />
      <rect x={cx - strapW / 2} y={cy} width={strapW} height={200} rx="16" fill={`url(#strap-${uid})`} opacity="0.6" />
      {/* crown */}
      <rect x={cx + (square ? 84 : r) - 2} y={cy - 12} width="16" height="24" rx="4" fill={`url(#gold-${uid})`} />
      {/* case */}
      {square ? (
        <>
          <rect x={cx - 88} y={cy - 88} width="176" height="176" rx="22" fill={`url(#gold-${uid})`} />
          <rect x={cx - 76} y={cy - 76} width="152" height="152" rx="14" fill={dial} />
          <rect x={cx - 76} y={cy - 76} width="152" height="152" rx="14" fill={`url(#dial-${uid})`} />
        </>
      ) : (
        <>
          <circle cx={cx} cy={cy} r={r + 12} fill={`url(#gold-${uid})`} />
          <circle cx={cx} cy={cy} r={r + 2} fill="#0b0a09" />
          <circle cx={cx} cy={cy} r={r - 4} fill={dial} />
          <circle cx={cx} cy={cy} r={r - 4} fill={`url(#dial-${uid})`} />
        </>
      )}
      {/* indices */}
      {ticks.map((i) => {
        const a = (i * Math.PI) / 6;
        const outer = (square ? 66 : r - 12);
        const inner = outer - (i % 3 === 0 ? 14 : 7);
        return (
          <line
            key={i}
            x1={cx + Math.sin(a) * inner}
            y1={cy - Math.cos(a) * inner}
            x2={cx + Math.sin(a) * outer}
            y2={cy - Math.cos(a) * outer}
            stroke={accent}
            strokeWidth={i % 3 === 0 ? 3 : 1.5}
            strokeLinecap="round"
          />
        );
      })}
      {/* chrono sub-dials */}
      {shape === "chrono" && (
        <g stroke={accent} strokeOpacity="0.7" fill="none" strokeWidth="1.5">
          <circle cx={cx - 34} cy={cy + 6} r="16" />
          <circle cx={cx + 34} cy={cy + 6} r="16" />
          <circle cx={cx} cy={cy + 40} r="14" />
        </g>
      )}
      {shape === "classic" && (
        <g stroke={accent} strokeOpacity="0.35" fill="none">
          <circle cx={cx} cy={cy} r={r - 30} strokeDasharray="2 6" />
          <circle cx={cx} cy={cy} r={r - 46} />
        </g>
      )}
      {/* brand */}
      <text x={cx} y={cy - (square ? 30 : r * 0.38)} textAnchor="middle" fontFamily="var(--font-display), serif" fontSize={shape === "petite" ? 9 : 12} letterSpacing="3" fill={accent}>
        ALFA
      </text>
      {/* hands at 10:10 */}
      <line x1={cx} y1={cy} x2={cx - (r * 0.45)} y2={cy - (r * 0.25)} stroke={accent} strokeWidth="5" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={cx + (r * 0.55)} y2={cy - (r * 0.42)} stroke={accent} strokeWidth="3.5" strokeLinecap="round" />
      <line x1={cx} y1={cy + 16} x2={cx} y2={cy - r * 0.7} stroke="#d1453b" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="6" fill={`url(#gold-${uid})`} />
      {/* glass reflection */}
      <path d={`M${cx - r * 0.7} ${cy - r * 0.45} Q ${cx - r * 0.2} ${cy - r * 0.95} ${cx + r * 0.5} ${cy - r * 0.7}`} stroke="#fff" strokeOpacity="0.15" strokeWidth="10" fill="none" strokeLinecap="round" />
    </g>
  );
}

/* --------------------------------- Glasses --------------------------------- */

function lensPath(shape: GlassesShape, side: -1 | 1) {
  const cx = 200 + side * 82;
  const cy = 255;
  switch (shape) {
    case "aviator":
      return `M${cx - 66} ${cy - 38} Q ${cx} ${cy - 52} ${cx + 66} ${cy - 38} Q ${cx + 70} ${cy + 30} ${cx + side * 10} ${cy + 62} Q ${cx - side * 50} ${cy + 66} ${cx - 64} ${cy + 10}z`;
    case "cateye":
      return `M${cx - 66} ${cy - 26} Q ${cx - side * 10} ${cy - 46} ${cx + side * 74} ${cy - 56} Q ${cx + side * 72} ${cy + 20} ${cx + side * 20} ${cy + 46} Q ${cx - side * 50} ${cy + 52} ${cx - side * 66} ${cy + 4}z`;
    case "square":
      return `M${cx - 66} ${cy - 40} h132 a10 10 0 0 1 10 10 v54 a26 26 0 0 1 -26 26 h-100 a26 26 0 0 1 -26 -26 v-54 a10 10 0 0 1 10 -10z`;
    case "round":
      return `M${cx} ${cy - 58} a58 58 0 1 1 -0.1 0z`;
    case "shield":
      return `M${cx - 74} ${cy - 40} h148 Q ${cx + 76} ${cy + 30} ${cx + 30} ${cy + 50} h-60 Q ${cx - 76} ${cy + 30} ${cx - 74} ${cy - 40}z`;
  }
}

function Glasses({ uid, shape, frame, lens, accent }: { uid: string; shape: GlassesShape; frame: string; lens: string; accent: string }) {
  const thin = shape === "aviator" || shape === "round";
  return (
    <g>
      <defs>
        <linearGradient id={`lens-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lens} stopOpacity="1" />
          <stop offset="100%" stopColor={lens} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {/* temples */}
      <path d="M50 232 L18 216" stroke={frame} strokeWidth={thin ? 5 : 9} strokeLinecap="round" />
      <path d="M350 232 L382 216" stroke={frame} strokeWidth={thin ? 5 : 9} strokeLinecap="round" />
      {/* bridge */}
      {shape === "aviator" ? (
        <path d="M142 222 Q200 200 258 222 M150 236 Q200 222 250 236" stroke={frame} strokeWidth="4" fill="none" />
      ) : (
        <path d="M150 236 Q200 214 250 236" stroke={frame} strokeWidth={thin ? 5 : 10} fill="none" />
      )}
      {([-1, 1] as const).map((side) => (
        <g key={side}>
          <path d={lensPath(shape, side)} fill={`url(#lens-${uid})`} stroke={frame} strokeWidth={thin ? 5 : 11} strokeLinejoin="round" />
          <path d={lensPath(shape, side)} fill={`url(#shine-${uid})`} opacity="0.7" />
        </g>
      ))}
      {/* hinge studs */}
      <circle cx="58" cy="232" r="4" fill={accent} />
      <circle cx="342" cy="232" r="4" fill={accent} />
    </g>
  );
}
