// Navigation components shared across the app

interface YantraMarkProps {
  size?: number;
}

/**
 * Animated Yantra / Cosmic Compass SVG mark used in the hero and navbar.
 * Renders a layered mandala-style geometric mark with a rotating outer ring.
 */
export function YantraMark({ size = 80 }: YantraMarkProps) {
  const r = size / 2;
  const cx = r;
  const cy = r;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {/* Outer rotating ring with dashes */}
      <circle
        cx={cx}
        cy={cy}
        r={r - 4}
        stroke="rgba(240,192,64,0.35)"
        strokeWidth="1.5"
        strokeDasharray="4 6"
        style={{
          transformOrigin: `${cx}px ${cy}px`,
          animation: "yantra-spin-cw 40s linear infinite",
        }}
      />

      {/* Secondary ring */}
      <circle
        cx={cx}
        cy={cy}
        r={r - 14}
        stroke="rgba(240,192,64,0.22)"
        strokeWidth="1"
        strokeDasharray="2 8"
        style={{
          transformOrigin: `${cx}px ${cy}px`,
          animation: "yantra-spin-ccw 28s linear infinite",
        }}
      />

      {/* Star of David (two triangles) */}
      <polygon
        points={hexPoints(cx, cy, r - 24, 0)}
        stroke="rgba(240,192,64,0.6)"
        strokeWidth="1.2"
        fill="rgba(240,192,64,0.04)"
      />
      <polygon
        points={hexPoints(cx, cy, r - 24, 60)}
        stroke="rgba(160,100,220,0.55)"
        strokeWidth="1.2"
        fill="rgba(124,58,237,0.04)"
      />

      {/* Inner circle */}
      <circle
        cx={cx}
        cy={cy}
        r={r - 42}
        stroke="rgba(240,192,64,0.4)"
        strokeWidth="1"
        fill="none"
      />

      {/* 8 cardinal / inter-cardinal dots */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const dotR = r - 20;
        return (
          <circle
            key={i}
            cx={cx + dotR * Math.cos(angle)}
            cy={cy + dotR * Math.sin(angle)}
            r={i % 2 === 0 ? 2.2 : 1.2}
            fill={i % 2 === 0 ? "#f0c040" : "rgba(240,192,64,0.45)"}
          />
        );
      })}

      <style>{`
        @keyframes yantra-spin-cw  { to { transform: rotate(360deg);  } }
        @keyframes yantra-spin-ccw { to { transform: rotate(-360deg); } }
      `}</style>
    </svg>
  );
}

/** Returns SVG polygon points string for a regular triangle rotated by `offsetDeg`. */
function hexPoints(cx: number, cy: number, r: number, offsetDeg: number): string {
  return Array.from({ length: 3 })
    .map((_, i) => {
      const angle = ((i * 120 + offsetDeg) * Math.PI) / 180;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    })
    .join(" ");
}
