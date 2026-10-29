import React from 'react';
import { DivisionalChart } from '../../types';

interface SouthIndianChartProps {
  chart: DivisionalChart;
  highlightHouse?: number | null;
  onSelectHouse?: (houseNumber: number) => void;
  className?: string;
}

interface SignBox {
  signNumber: number;
  name: string;
  sanskrit: string;
  col: number; // 0 to 3
  row: number; // 0 to 3
}

// Classical clockwise fixed sign layout for South Indian Kundali
const SOUTH_SIGNS: SignBox[] = [
  { signNumber: 12, name: 'Pisces', sanskrit: 'Meena', col: 0, row: 0 },
  { signNumber: 1,  name: 'Aries', sanskrit: 'Mesha', col: 1, row: 0 },
  { signNumber: 2,  name: 'Taurus', sanskrit: 'Vrishabha', col: 2, row: 0 },
  { signNumber: 3,  name: 'Gemini', sanskrit: 'Mithuna', col: 3, row: 0 },

  { signNumber: 11, name: 'Aquarius', sanskrit: 'Kumbha', col: 0, row: 1 },
  { signNumber: 4,  name: 'Cancer', sanskrit: 'Karka', col: 3, row: 1 },

  { signNumber: 10, name: 'Capricorn', sanskrit: 'Makara', col: 0, row: 2 },
  { signNumber: 5,  name: 'Leo', sanskrit: 'Simha', col: 3, row: 2 },

  { signNumber: 9,  name: 'Sagittarius', sanskrit: 'Dhanu', col: 0, row: 3 },
  { signNumber: 8,  name: 'Scorpio', sanskrit: 'Vrischika', col: 1, row: 3 },
  { signNumber: 7,  name: 'Libra', sanskrit: 'Tula', col: 2, row: 3 },
  { signNumber: 6,  name: 'Virgo', sanskrit: 'Kanya', col: 3, row: 3 },
];

export const SouthIndianChart: React.FC<SouthIndianChartProps> = ({
  chart,
  highlightHouse,
  onSelectHouse,
  className = ''
}) => {
  const lagnaSign = chart.lagnaSignNumber || 1;
  const cellSize = 120; // 4 * 120 = 480 + 20 margin = 500

  // Group placements by sign number
  const planetsBySign: Record<number, typeof chart.placements> = {};
  for (let s = 1; s <= 12; s++) {
    planetsBySign[s] = [];
  }
  chart.placements.forEach(p => {
    if (planetsBySign[p.signNumber]) {
      planetsBySign[p.signNumber].push(p);
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
          <linearGradient id="southBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E1742" />
            <stop offset="50%" stopColor="#151233" />
            <stop offset="100%" stopColor="#0E1024" />
          </linearGradient>

          <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F3D898" />
            <stop offset="50%" stopColor="#D6B46A" />
            <stop offset="100%" stopColor="#A37E36" />
          </linearGradient>
        </defs>

        {/* Outer background */}
        <rect x="5" y="5" width="490" height="490" rx="12" fill="url(#southBg)" stroke="url(#goldBorder)" strokeWidth="3" />

        {/* Outer 4x4 grid boundary */}
        <rect x="10" y="10" width="480" height="480" fill="none" stroke="url(#goldBorder)" strokeWidth="2" />

        {/* Inner open center box (2x2) */}
        <rect
          x={10 + cellSize}
          y={10 + cellSize}
          width={cellSize * 2}
          height={cellSize * 2}
          fill="rgba(16, 19, 41, 0.75)"
          stroke="url(#goldBorder)"
          strokeWidth="2"
        />

        {/* Center Box Details */}
        <g transform={`translate(${250}, ${230})`}>
          <text textAnchor="middle" fill="#D6B46A" fontSize="13" fontWeight="bold" letterSpacing="1.5" className="font-display">
            VOXIGEN
          </text>
          <text textAnchor="middle" y="22" fill="#FFF8E9" fontSize="11" fontWeight="600" className="font-sans">
            {chart.title}
          </text>
          <text textAnchor="middle" y="42" fill="rgba(233, 225, 245, 0.7)" fontSize="10" className="font-sans">
            Lagna: {chart.lagnaSignName}
          </text>
        </g>

        {/* 12 Zodiac Sign Cells */}
        {SOUTH_SIGNS.map(sign => {
          const x = 10 + sign.col * cellSize;
          const y = 10 + sign.row * cellSize;
          const isLagna = sign.signNumber === lagnaSign;
          const houseNum = ((sign.signNumber - lagnaSign + 12) % 12) + 1;
          const isHighlighted = highlightHouse === houseNum;
          const planets = planetsBySign[sign.signNumber] || [];

          return (
            <g
              key={sign.signNumber}
              className="cursor-pointer transition-colors"
              onClick={() => onSelectHouse && onSelectHouse(houseNum)}
            >
              {/* Cell Boundary */}
              <rect
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                fill={isHighlighted ? 'rgba(76, 42, 133, 0.4)' : isLagna ? 'rgba(214, 180, 106, 0.08)' : 'transparent'}
                stroke="url(#goldBorder)"
                strokeWidth="1.2"
              />

              {/* Lagna Diagonal Indicator Line */}
              {isLagna && (
                <line
                  x1={x}
                  y1={y}
                  x2={x + 35}
                  y2={y + 35}
                  stroke="#F3D898"
                  strokeWidth="2"
                  strokeDasharray="2 2"
                />
              )}

              {/* Sign Title & House Badge */}
              <text x={x + 8} y={y + 16} fill="rgba(214, 180, 106, 0.7)" fontSize="9" fontWeight="600" className="font-sans">
                {sign.name}
              </text>

              <text x={x + cellSize - 8} y={y + 16} textAnchor="end" fill="rgba(233, 225, 245, 0.5)" fontSize="8.5" className="font-sans">
                H{houseNum}
              </text>

              {/* Lagna Label */}
              {isLagna && (
                <text x={x + 8} y={y + 30} fill="#F3D898" fontSize="9" fontWeight="bold" className="font-sans">
                  ASC
                </text>
              )}

              {/* Occupying Planets */}
              <g transform={`translate(${x + cellSize / 2}, ${y + (isLagna ? 48 : 38)})`}>
                {planets.map((p, idx) => {
                  return (
                    <text
                      key={p.body}
                      x="0"
                      y={idx * 15}
                      textAnchor="middle"
                      fill="#FFF8E9"
                      fontSize="11"
                      fontWeight="600"
                      className="font-sans"
                    >
                      <tspan fill="#D6B46A">{p.symbol}</tspan> {p.body}
                    </text>
                  );
                })}
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
