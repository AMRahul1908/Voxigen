import React from 'react';
import { AstrologicalYoga, GrahaDrishti } from '../types';
import { Award, Sparkles, Eye } from 'lucide-react';

interface YogasCardProps {
  yogas: AstrologicalYoga[];
  aspects: GrahaDrishti[];
}

export const YogasCard: React.FC<YogasCardProps> = ({ yogas, aspects }) => {
  return (
    <div className="bg-cosmic-card backdrop-blur-md rounded-2xl border border-cosmic-border p-5 md:p-6 shadow-cosmic-card">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-cosmic-border-subtle">
        <Award className="w-5 h-5 text-cosmic-gold" />
        <h3 className="text-lg md:text-xl font-display font-semibold text-cosmic-ivory">
          Vedic Yogas & Planetary Combinations
        </h3>
      </div>

      {yogas.length === 0 ? (
        <p className="text-xs text-cosmic-lavender/60 italic">
          No major Classical Yogas detected in this chart orientation.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {yogas.map(yoga => (
            <div
              key={yoga.name}
              className="p-4 rounded-xl bg-cosmic-surface/60 border border-cosmic-border-subtle hover:border-cosmic-gold/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="font-display font-semibold text-sm md:text-base text-cosmic-gold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cosmic-gold shrink-0" />
                    {yoga.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cosmic-purple/50 text-cosmic-lavender border border-cosmic-border-subtle">
                    {yoga.category}
                  </span>
                </div>
                <p className="text-xs text-cosmic-ivory/90 leading-relaxed mb-2 font-sans">
                  {yoga.description}
                </p>
              </div>

              <div className="pt-2 border-t border-cosmic-border-subtle/50">
                <p className="text-[11px] text-cosmic-lavender/70 italic">
                  <strong className="text-cosmic-gold/90 font-medium not-italic">Effects:</strong> {yoga.effects}
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-cosmic-lavender/50">
                  <span>Planets involved:</span>
                  <span className="font-semibold text-cosmic-ivory">{yoga.planetsInvolved.join(', ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Aspects (Graha Drishti) Summary */}
      {aspects.length > 0 && (
        <div className="mt-6 pt-5 border-t border-cosmic-border-subtle">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4 text-cosmic-gold" />
            <h4 className="font-display text-sm font-semibold text-cosmic-ivory">
              Graha Drishti (Planetary Aspects)
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {aspects.slice(0, 7).map(asp => (
              <div
                key={asp.planet}
                className="px-3 py-1.5 rounded-lg bg-cosmic-navy/60 border border-cosmic-border-subtle text-xs text-cosmic-lavender/80 flex items-center gap-2"
              >
                <strong className="text-cosmic-gold">{asp.planet}</strong>
                <span>aspects houses:</span>
                <span className="font-mono text-cosmic-ivory">
                  {asp.aspectsHouses.map(h => `H${h}`).join(', ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
