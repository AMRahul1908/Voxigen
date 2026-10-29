import React from 'react';
import { DivisionalChart } from '../../types';

interface EastIndianChartProps {
  chart: DivisionalChart;
  highlightHouse?: number | null;
  onSelectHouse?: (houseNumber: number) => void;
  className?: string;
}

// In the East Indian chart system (used in Bengal, Odisha, and Assam):
// Signs are fixed in counter-clockwise order, similar to South Indian's fixed signs but with a distinct triangular geometry.
export const EastIndianChart: React.FC<EastIndianChartProps> = ({
  chart,
  highlightHouse,
  onSelectHouse,
  className = ''
}) => {
  const lagnaSign = chart.lagnaSignNumber || 1;

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
          <linearGradient id="eastBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E1742" />
            <stop offset="50%" stopColor="#151233" />
            <stop offset="100%" stopColor="#0E1024" />
          </linearGradient>

          <linearGradient id="goldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F3D898" />
            <stop offset="50%" stopColor="#D6B46A" />
            <stop offset="100%" stopColor="#A37E36" />
          </linearGradient>
        </defs>

        <rect x="5" y="5" width="490" height="490" rx="12" fill="url(#eastBg)" stroke="url(#goldStroke)" strokeWidth="3" />

        {/* Outer square */}
        <rect x="15" y="15" width="470" height="470" fill="none" stroke="url(#goldStroke)" strokeWidth="2" />

        {/* Diagonals */}
        <line x1="15" y1="15" x2="485" y2="485" stroke="url(#goldStroke)" strokeWidth="1.5" />
        <line x1="485" y1="15" x2="15" y2="485" stroke="url(#goldStroke)" strokeWidth="1.5" />

        {/* Inner Diamond */}
        <polygon points="250,15 485,250 250,485 15,250" fill="none" stroke="url(#goldStroke)" strokeWidth="1.8" />

        {/* Center Title Tag */}
        <circle cx="250" cy="250" r="45" fill="#151233" stroke="url(#goldStroke)" strokeWidth="1.5" />
        <text x="250" y="246" textAnchor="middle" fill="#D6B46A" fontSize="10" fontWeight="bold" letterSpacing="1">
          EAST INDIAN
        </text>
        <text x="250" y="262" textAnchor="middle" fill="#FFF8E9" fontSize="9">
          {chart.code} {chart.name}
        </text>

        {/* 12 Sign Markers & Occupying Planets */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(signNum => {
          const isLagna = signNum === lagnaSign;
          const houseNum = ((signNum - lagnaSign + 12) % 12) + 1;
          const isHighlighted = highlightHouse === houseNum;
          const planets = planetsBySign[signNum] || [];

          // Approximate angular coordinates around the center for East Indian layout
          const angle = ((signNum - 1) * 30 - 60) * (Math.PI / 180);
          const r = 160;
          const cx = 250 + r * Math.cos(angle);
          const cy = 250 + r * Math.sin(angle);

          return (
            <g
              key={signNum}
              className="cursor-pointer"
              onClick={() => onSelectHouse && onSelectHouse(houseNum)}
            >
              {isHighlighted && (
                <circle cx={cx} cy={cy} r="32" fill="rgba(76, 42, 133, 0.45)" />
              )}

              <text x={cx} y={cy - 12} textAnchor="middle" fill="rgba(214, 180, 106, 0.8)" fontSize="10" fontWeight="600">
                {signNum} {isLagna && '(ASC)'}
              </text>

              <g transform={`translate(${cx}, ${cy + 4})`}>
                {planets.map((p, idx) => (
                  <text key={p.body} x="0" y={idx * 14} textAnchor="middle" fill="#FFF8E9" fontSize="11" fontWeight="600">
                    <tspan fill="#D6B46A">{p.symbol}</tspan> {p.body}
                  </text>
                ))}
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
