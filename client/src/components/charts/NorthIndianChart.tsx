import React from 'react';
import { DivisionalChart } from '../../types';

interface NorthIndianChartProps {
  chart: DivisionalChart;
  highlightHouse?: number | null;
  onSelectHouse?: (houseNumber: number) => void;
  className?: string;
}

interface HouseCoord {
  center: { x: number; y: number };
  signPos: { x: number; y: number };
}

// Precomputed centers and sign number positions for 500x500 North Indian Kundali SVG
const HOUSE_COORDS: Record<number, HouseCoord> = {
  1:  { center: { x: 250, y: 155 }, signPos: { x: 250, y: 230 } }, // Top Diamond
  2:  { center: { x: 135, y: 70 },  signPos: { x: 175, y: 105 } }, // Top-Left
  3:  { center: { x: 70, y: 135 },  signPos: { x: 105, y: 175 } }, // Upper-Left
  4:  { center: { x: 155, y: 250 }, signPos: { x: 230, y: 250 } }, // Left Diamond
  5:  { center: { x: 70, y: 365 },  signPos: { x: 105, y: 325 } }, // Lower-Left
  6:  { center: { x: 135, y: 430 }, signPos: { x: 175, y: 395 } }, // Bottom-Left
  7:  { center: { x: 250, y: 345 }, signPos: { x: 250, y: 270 } }, // Bottom Diamond
  8:  { center: { x: 365, y: 430 }, signPos: { x: 325, y: 395 } }, // Bottom-Right
  9:  { center: { x: 430, y: 365 }, signPos: { x: 395, y: 325 } }, // Lower-Right
  10: { center: { x: 345, y: 250 }, signPos: { x: 270, y: 250 } }, // Right Diamond
  11: { center: { x: 430, y: 135 }, signPos: { x: 395, y: 175 } }, // Upper-Right
  12: { center: { x: 365, y: 70 },  signPos: { x: 325, y: 105 } }, // Top-Right
};

export const NorthIndianChart: React.FC<NorthIndianChartProps> = ({
  chart,
  highlightHouse,
  onSelectHouse,
  className = ''
}) => {
  const lagnaSign = chart.lagnaSignNumber || 1;

  // Group planets by house
  const planetsByHouse: Record<number, typeof chart.placements> = {};
  for (let h = 1; h <= 12; h++) {
    planetsByHouse[h] = [];
  }

  chart.placements.forEach(p => {
    if (planetsByHouse[p.houseNumber]) {
      planetsByHouse[p.houseNumber].push(p);
    }
  });

  return (
    <div className={`relative w-full max-w-[520px] mx-auto select-none ${className}`}>
      <svg
        viewBox="0 0 500 500"
        className="w-full h-auto drop-shadow-2xl transition-all"
        style={{ filter: 'drop-shadow(0 0 20px rgba(214, 180, 106, 0.15))' }}
      >
        <defs>
          <linearGradient id="chartBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E1742" />
            <stop offset="50%" stopColor="#151233" />
            <stop offset="100%" stopColor="#0E1024" />
          </linearGradient>

          <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F3D898" />
            <stop offset="50%" stopColor="#D6B46A" />
            <stop offset="100%" stopColor="#A37E36" />
          </linearGradient>

          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Chart Background Base */}
        <rect
          x="4"
          y="4"
          width="492"
          height="492"
          fill="url(#chartBg)"
          rx="12"
          stroke="url(#goldLine)"
          strokeWidth="3"
        />

        {/* Subtle Decorative Mandala Ring in Center */}
        <circle
          cx="250"
          cy="250"
          r="65"
          fill="none"
          stroke="rgba(214, 180, 106, 0.15)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* --- Classical North Indian Chart Geometry Lines --- */}
        {/* Outer Border */}
        <rect x="10" y="10" width="480" height="480" fill="none" stroke="url(#goldLine)" strokeWidth="2.5" />

        {/* Diagonals */}
        <line x1="10" y1="10" x2="490" y2="490" stroke="url(#goldLine)" strokeWidth="1.8" />
        <line x1="490" y1="10" x2="10" y2="490" stroke="url(#goldLine)" strokeWidth="1.8" />

        {/* Inner Diamond connecting midpoints */}
        <polygon
          points="250,10 490,250 250,490 10,250"
          fill="none"
          stroke="url(#goldLine)"
          strokeWidth="2"
        />

        {/* Interactive Houses Rendering */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(houseNum => {
          // Zodiac sign number occupying this house
          const signNum = ((lagnaSign - 1 + (houseNum - 1)) % 12) + 1;
          const coords = HOUSE_COORDS[houseNum];
          const planets = planetsByHouse[houseNum] || [];
          const isLagna = houseNum === 1;
          const isHighlighted = highlightHouse === houseNum;

          return (
            <g
              key={houseNum}
              className="cursor-pointer transition-opacity group"
              onClick={() => onSelectHouse && onSelectHouse(houseNum)}
            >
              {/* Sign Number Indicator */}
              <text
                x={coords.signPos.x}
                y={coords.signPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="font-display font-semibold transition-colors"
                fill={isHighlighted ? "#FFF8E9" : "rgba(214, 180, 106, 0.65)"}
                fontSize="12"
              >
                {signNum}
              </text>

              {/* House 1 Lagna Tag */}
              {isLagna && (
                <text
                  x={coords.center.x}
                  y={coords.center.y - 32}
                  textAnchor="middle"
                  fill="#F3D898"
                  fontSize="10"
                  fontWeight="bold"
                  letterSpacing="1"
                  className="uppercase tracking-widest font-sans"
                >
                  Asc / Lagna
                </text>
              )}

              {/* Occupying Planets */}
              <g transform={`translate(${coords.center.x}, ${coords.center.y - (planets.length > 2 ? 14 : 4)})`}>
                {planets.map((p, idx) => {
                  const yOffset = idx * 16 - (planets.length * 8) / 2;
                  return (
                    <text
                      key={p.body}
                      x="0"
                      y={yOffset}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#FFF8E9"
                      fontSize={planets.length > 3 ? "10.5" : "12"}
                      fontWeight="600"
                      className="font-sans drop-shadow"
                    >
                      <tspan fill="#D6B46A" fontWeight="bold">
                        {p.symbol}{' '}
                      </tspan>
                      {p.body}
                    </text>
                  );
                })}
              </g>
            </g>
          );
        })}

        {/* Small corner mandala accents */}
        <circle cx="20" cy="20" r="3" fill="#D6B46A" />
        <circle cx="480" cy="20" r="3" fill="#D6B46A" />
        <circle cx="20" cy="480" r="3" fill="#D6B46A" />
        <circle cx="480" cy="480" r="3" fill="#D6B46A" />
      </svg>
    </div>
  );
};
