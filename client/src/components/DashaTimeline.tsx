import React, { useState } from 'react';
import { VimshottariDasha, MahadashaPeriod } from '../types';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface DashaTimelineProps {
  dasha: VimshottariDasha;
}

export const DashaTimeline: React.FC<DashaTimelineProps> = ({ dasha }) => {
  const [expandedLord, setExpandedLord] = useState<string | null>(dasha.currentMahadasha || null);

  const toggleExpand = (planet: string) => {
    setExpandedLord(prev => (prev === planet ? null : planet));
  };

  return (
    <div className="bg-cosmic-card backdrop-blur-md rounded-2xl border border-cosmic-border p-5 md:p-6 shadow-cosmic-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-cosmic-border-subtle">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-cosmic-gold" />
          <h3 className="text-lg md:text-xl font-display font-semibold text-cosmic-ivory">
            Vimshottari Dasha Timeline
          </h3>
        </div>

        {/* Current Active Dasha Badge */}
        {dasha.currentMahadasha && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cosmic-purple/40 border border-cosmic-gold/40 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-cosmic-lavender/80">Active Now:</span>
            <strong className="text-cosmic-gold">
              {dasha.currentMahadasha} / {dasha.currentAntardasha}
            </strong>
          </div>
        )}
      </div>

      {/* Birth Balance Summary */}
      <div className="mb-5 p-3.5 rounded-xl bg-cosmic-navy/70 border border-cosmic-border-subtle flex flex-wrap items-center justify-between text-xs text-cosmic-lavender/80 gap-3">
        <span>
          Birth Balance Dasha Lord:{' '}
          <strong className="text-cosmic-gold">{dasha.birthBalance.rulingPlanet}</strong>
        </span>
        <span>
          Balance Duration at Birth:{' '}
          <strong className="text-cosmic-ivory">{dasha.birthBalance.yearsRemaining} Years</strong>
        </span>
        <span>
          Total Cycle:{' '}
          <strong className="text-cosmic-ivory">120 Years (Vedic Solar Standard)</strong>
        </span>
      </div>

      {/* Mahadasha Accordion List */}
      <div className="space-y-2.5">
        {dasha.timeline.map((period: MahadashaPeriod) => {
          const isExpanded = expandedLord === period.planet;
          const isCurrent = Boolean(period.isCurrent);

          return (
            <div
              key={period.planet}
              className={`rounded-xl border transition-all overflow-hidden ${
                isCurrent
                  ? 'border-cosmic-gold/60 bg-cosmic-purple/20'
                  : 'border-cosmic-border-subtle bg-cosmic-surface/40 hover:border-cosmic-border'
              }`}
            >
              {/* Mahadasha Item Header */}
              <button
                type="button"
                onClick={() => toggleExpand(period.planet)}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isCurrent
                        ? 'bg-cosmic-gold text-cosmic-navy shadow-sm'
                        : 'bg-cosmic-indigo text-cosmic-gold border border-cosmic-border-subtle'
                    }`}
                  >
                    {period.planet.substring(0, 2)}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-cosmic-ivory">
                        {period.planet} Mahadasha
                      </span>
                      {isCurrent && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cosmic-gold/20 text-cosmic-gold border border-cosmic-gold/40">
                          Current
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-cosmic-lavender/60">
                      Duration: {period.durationYears} Years
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-cosmic-lavender/80 hidden sm:inline">
                    {period.startDate} to {period.endDate}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-cosmic-gold" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-cosmic-lavender/50" />
                  )}
                </div>
              </button>

              {/* Antardasha Expansion */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-cosmic-border-subtle/60 bg-cosmic-navy/40">
                  <p className="text-[11px] font-semibold text-cosmic-gold uppercase tracking-wider mb-2.5">
                    Antardasha Sub-Periods ({period.planet})
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {period.antardashas.map(antar => {
                      const isAntarCurrent =
                        isCurrent && dasha.currentAntardasha === antar.planet;

                      return (
                        <div
                          key={antar.planet}
                          className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                            isAntarCurrent
                              ? 'bg-cosmic-purple/50 border-cosmic-gold/60 text-cosmic-ivory shadow-sm'
                              : 'bg-cosmic-surface/60 border-cosmic-border-subtle text-cosmic-lavender/80'
                          }`}
                        >
                          <div>
                            <p className="font-semibold text-cosmic-ivory flex items-center gap-1.5">
                              {period.planet}-{antar.planet}
                              {isAntarCurrent && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              )}
                            </p>
                            <p className="text-[10.5px] text-cosmic-lavender/60 font-mono mt-0.5">
                              {antar.startDate} to {antar.endDate}
                            </p>
                          </div>
                          <span className="text-[10px] text-cosmic-lavender/50">
                            {antar.durationMonths}m
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
