import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { Sparkles, Compass } from 'lucide-react';

interface HoroscopeItem {
  rashi: string;
  lord: string;
  element: string;
  prediction: string;
  luckyNumber: number;
  luckyColor: string;
  compatibility: string;
  guidance: string;
}

const RASHIS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export const HoroscopePage: React.FC = () => {
  const [horoscopes, setHoroscopes] = useState<Record<string, HoroscopeItem>>({});
  const [selectedRashi, setSelectedRashi] = useState<string>('Aries');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ success: boolean; data: Record<string, HoroscopeItem> }>('/horoscope/daily')
      .then(res => {
        if (res.success && res.data) {
          setHoroscopes(res.data);
        }
      })
      .catch(err => console.error('Failed to load horoscopes', err))
      .finally(() => setLoading(false));
  }, []);

  const current = horoscopes[selectedRashi];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cosmic-purple/40 border border-cosmic-gold/40 text-xs font-semibold text-cosmic-gold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Vedic Moon & Sun Sign Transits (Gochar)</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-cosmic-ivory">
          Daily Vedic Horoscope
        </h1>
        <p className="text-xs md:text-sm text-cosmic-lavender/70 font-sans">
          Grounded in classical planetary transits from your Moon sign (Chandra Rashi).
        </p>
      </div>

      {/* Rashi Selector Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
        {RASHIS.map(rashi => (
          <button
            key={rashi}
            type="button"
            onClick={() => setSelectedRashi(rashi)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
              selectedRashi === rashi
                ? 'bg-cosmic-gold text-cosmic-navy border-cosmic-gold shadow-gold scale-105'
                : 'bg-cosmic-card border-cosmic-border-subtle text-cosmic-lavender/80 hover:text-cosmic-ivory hover:border-cosmic-gold/40'
            }`}
          >
            {rashi}
          </button>
        ))}
      </div>

      {/* Main Selected Rashi Card */}
      {loading ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-cosmic-gold/30 border-t-cosmic-gold animate-spin" />
        </div>
      ) : current ? (
        <div className="max-w-3xl mx-auto bg-cosmic-card backdrop-blur-md rounded-3xl border border-cosmic-border p-6 md:p-10 shadow-cosmic-card space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-cosmic-border-subtle">
            <div>
              <span className="text-xs text-cosmic-gold uppercase tracking-wider font-semibold">
                Daily Guidance
              </span>
              <h2 className="font-display text-3xl font-bold text-cosmic-ivory mt-1">
                {current.rashi}
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-cosmic-lavender/70">
              <span className="px-3 py-1 rounded-lg bg-cosmic-surface border border-cosmic-border-subtle">
                Lord: <strong className="text-cosmic-gold">{current.lord}</strong>
              </span>
              <span className="px-3 py-1 rounded-lg bg-cosmic-surface border border-cosmic-border-subtle">
                Element: <strong className="text-cosmic-ivory">{current.element}</strong>
              </span>
            </div>
          </div>

          {/* Daily Prediction */}
          <div className="space-y-2">
            <h3 className="font-display text-base font-semibold text-cosmic-gold">
              Planetary Transit Influence
            </h3>
            <p className="text-sm md:text-base text-cosmic-ivory/90 leading-relaxed font-sans">
              {current.prediction}
            </p>
          </div>

          {/* Guidance Callout */}
          <div className="p-4 rounded-xl bg-cosmic-purple/30 border border-cosmic-border-subtle flex items-start gap-3">
            <Compass className="w-5 h-5 text-cosmic-gold shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-cosmic-gold uppercase tracking-wide">Cosmic Advice</h4>
              <p className="text-xs md:text-sm text-cosmic-lavender/90 mt-0.5">{current.guidance}</p>
            </div>
          </div>

          {/* Lucky Factors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-cosmic-border-subtle text-xs">
            <div className="p-3.5 rounded-xl bg-cosmic-surface/60 border border-cosmic-border-subtle">
              <span className="text-[10px] text-cosmic-lavender/60 uppercase block">Lucky Number</span>
              <strong className="text-base text-cosmic-gold font-display font-bold">{current.luckyNumber}</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-cosmic-surface/60 border border-cosmic-border-subtle">
              <span className="text-[10px] text-cosmic-lavender/60 uppercase block">Lucky Color</span>
              <strong className="text-sm text-cosmic-ivory font-medium">{current.luckyColor}</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-cosmic-surface/60 border border-cosmic-border-subtle">
              <span className="text-[10px] text-cosmic-lavender/60 uppercase block">Compatible Signs</span>
              <strong className="text-sm text-cosmic-ivory font-medium">{current.compatibility}</strong>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
