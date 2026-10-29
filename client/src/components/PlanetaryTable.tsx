import React from 'react';
import { PlanetPosition } from '../types';
import { Orbit } from 'lucide-react';

interface PlanetaryTableProps {
  planets: Record<string, PlanetPosition>;
}

export const PlanetaryTable: React.FC<PlanetaryTableProps> = ({ planets }) => {
  const planetList = Object.values(planets);

  const getDignityBadge = (dignity?: string) => {
    switch (dignity) {
      case 'Exalted':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">Exalted (Uccha)</span>;
      case 'Debilitated':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">Debilitated (Neecha)</span>;
      case 'Own Sign':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Own Sign (Swakshetra)</span>;
      default:
        return <span className="text-cosmic-lavender/50 text-xs">—</span>;
    }
  };

  return (
    <div className="bg-cosmic-card backdrop-blur-md rounded-2xl border border-cosmic-border p-5 md:p-6 shadow-cosmic-card">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-cosmic-border-subtle">
        <div className="flex items-center gap-2">
          <Orbit className="w-5 h-5 text-cosmic-gold" />
          <h3 className="text-lg md:text-xl font-display font-semibold text-cosmic-ivory">
            Planetary Positions (Graha Sthiti)
          </h3>
        </div>
        <span className="text-xs text-cosmic-lavender/60">
          Lahiri Sidereal Longitudes
        </span>
      </div>

      <div className="overflow-x-auto -mx-5 px-5 md:mx-0 md:px-0">
        <table className="w-full text-left text-xs md:text-sm">
          <thead>
            <tr className="border-b border-cosmic-border-subtle text-cosmic-gold font-display text-xs">
              <th className="py-2.5 px-3">Planet / Graha</th>
              <th className="py-2.5 px-3">Zodiac Sign</th>
              <th className="py-2.5 px-3">House</th>
              <th className="py-2.5 px-3">Degree</th>
              <th className="py-2.5 px-3">Nakshatra & Pada</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Dignity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cosmic-border-subtle font-sans">
            {planetList.map(p => {
              return (
                <tr key={p.name} className="hover:bg-cosmic-purple/20 transition-colors">
                  {/* Planet Name */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-base text-cosmic-gold font-bold w-5 text-center">
                        {p.symbol}
                      </span>
                      <div>
                        <p className="font-semibold text-cosmic-ivory">{p.name}</p>
                        <p className="text-[11px] text-cosmic-lavender/60">{p.vedicName}</p>
                      </div>
                    </div>
                  </td>

                  {/* Zodiac Sign */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <p className="font-medium text-cosmic-ivory">{p.zodiacSign}</p>
                    <p className="text-[11px] text-cosmic-lavender/60">Lord: {p.signLord}</p>
                  </td>

                  {/* House */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-cosmic-surface border border-cosmic-border-subtle font-bold text-cosmic-gold text-xs">
                      H{p.house}
                    </span>
                  </td>

                  {/* Degree */}
                  <td className="py-3 px-3 whitespace-nowrap font-mono text-cosmic-ivory text-xs">
                    {p.degreeFormatted}
                  </td>

                  {/* Nakshatra & Pada */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <p className="font-medium text-cosmic-ivory">{p.nakshatra}</p>
                    <p className="text-[11px] text-cosmic-lavender/60">Pada {p.nakshatraPada} • Lord: {p.nakshatraLord}</p>
                  </td>

                  {/* Status (Retrograde / Direct / Combust) */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {p.isRetrograde ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Retro (R)
                        </span>
                      ) : (
                        <span className="text-[11px] text-cosmic-lavender/60">Direct</span>
                      )}

                      {p.isCombust && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          Combust (C)
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Dignity */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {getDignityBadge(p.dignity)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
