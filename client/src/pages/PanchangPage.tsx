import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { Calendar, Clock } from 'lucide-react';

interface PanchangData {
  date: string;
  location: { latitude: number; longitude: number; timezone: number };
  tithi: { name: string; paksha: string; index: number };
  nakshatra: { name: string; pada: number; lord: string; deity: string };
  yoga: { name: string; index: number };
  karana: { name: string };
  vara: { name: string };
  moonSign: string;
  sunSign: string;
  timings: {
    sunrise: string;
    sunset: string;
    abhijitMuhurat: string;
    rahuKaal: string;
  };
}

export const PanchangPage: React.FC = () => {
  const location = useLocation();
  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ success: boolean; data: PanchangData }>('/panchang/today')
      .then(res => {
        if (res.success && res.data) {
          setPanchang(res.data);
        }
      })
      .catch(err => console.error('Failed to load Panchang:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || !panchang || !location.hash) return;
    const timer = window.setTimeout(() => {
      document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loading, location.hash, panchang]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      <div id="panchang-calendar" className="scroll-mt-24 text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cosmic-purple/40 border border-cosmic-gold/40 text-xs font-semibold text-cosmic-gold">
          <Calendar className="w-3.5 h-3.5" />
          <span>Real-time Vedic Astronomical Ephemeris</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-cosmic-ivory">
          Today's Vedic Panchang
        </h1>
        <p className="text-xs md:text-sm text-cosmic-lavender/70 font-sans">
          The five limbs of time: Tithi, Vara, Nakshatra, Yoga, and Karana computed for today.
        </p>
      </div>

      {loading ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-cosmic-gold/30 border-t-cosmic-gold animate-spin" />
        </div>
      ) : panchang ? (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main 5 Limbs Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Tithi */}
            <div id="tithi" className="scroll-mt-24 p-5 rounded-2xl bg-cosmic-card border border-cosmic-border shadow-cosmic-card space-y-2">
              <span className="text-[11px] font-semibold text-cosmic-gold uppercase tracking-wider block">
                1. Tithi (Lunar Phase)
              </span>
              <h3 className="font-display text-xl font-bold text-cosmic-ivory">
                {panchang.tithi.name}
              </h3>
              <p className="text-xs text-cosmic-lavender/80 font-sans">
                {panchang.tithi.paksha}
              </p>
            </div>

            {/* Nakshatra */}
            <div id="nakshatra" className="scroll-mt-24 p-5 rounded-2xl bg-cosmic-card border border-cosmic-border shadow-cosmic-card space-y-2">
              <span className="text-[11px] font-semibold text-cosmic-gold uppercase tracking-wider block">
                2. Nakshatra (Lunar Mansion)
              </span>
              <h3 className="font-display text-xl font-bold text-cosmic-ivory">
                {panchang.nakshatra.name}
              </h3>
              <p className="text-xs text-cosmic-lavender/80 font-sans">
                Pada {panchang.nakshatra.pada} • Lord: {panchang.nakshatra.lord}
              </p>
            </div>

            {/* Vara */}
            <div className="p-5 rounded-2xl bg-cosmic-card border border-cosmic-border shadow-cosmic-card space-y-2">
              <span className="text-[11px] font-semibold text-cosmic-gold uppercase tracking-wider block">
                3. Vara (Solar Day)
              </span>
              <h3 className="font-display text-xl font-bold text-cosmic-ivory">
                {panchang.vara.name}
              </h3>
              <p className="text-xs text-cosmic-lavender/80 font-sans">
                Ruled by the day's cosmic planetary sovereign
              </p>
            </div>

            {/* Yoga */}
            <div className="p-5 rounded-2xl bg-cosmic-card border border-cosmic-border shadow-cosmic-card space-y-2">
              <span className="text-[11px] font-semibold text-cosmic-gold uppercase tracking-wider block">
                4. Nitya Yoga (Solar-Lunar Angle)
              </span>
              <h3 className="font-display text-xl font-bold text-cosmic-ivory">
                {panchang.yoga.name}
              </h3>
              <p className="text-xs text-cosmic-lavender/80 font-sans">
                Yoga #{panchang.yoga.index} of 27 classical yogas
              </p>
            </div>

            {/* Karana */}
            <div className="p-5 rounded-2xl bg-cosmic-card border border-cosmic-border shadow-cosmic-card space-y-2">
              <span className="text-[11px] font-semibold text-cosmic-gold uppercase tracking-wider block">
                5. Karana (Half-Tithi)
              </span>
              <h3 className="font-display text-xl font-bold text-cosmic-ivory">
                {panchang.karana.name}
              </h3>
              <p className="text-xs text-cosmic-lavender/80 font-sans">
                Active lunar action division
              </p>
            </div>

            {/* Current Signs */}
            <div className="p-5 rounded-2xl bg-cosmic-card border border-cosmic-border shadow-cosmic-card space-y-2">
              <span className="text-[11px] font-semibold text-cosmic-gold uppercase tracking-wider block">
                Celestial Placements
              </span>
              <h3 className="font-display text-base font-bold text-cosmic-ivory">
                Moon in {panchang.moonSign}
              </h3>
              <p className="text-xs text-cosmic-lavender/80 font-sans">
                Sun in {panchang.sunSign}
              </p>
            </div>
          </div>

          {/* Timings & Muhurat Panel */}
          <div id="shubh-muhurat" className="scroll-mt-24 p-6 md:p-8 rounded-3xl bg-cosmic-card border border-cosmic-border shadow-cosmic-card">
            <h3 className="font-display text-xl font-bold text-cosmic-ivory mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-cosmic-gold" />
              Auspicious & Inauspicious Periods Today
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-cosmic-surface/60 border border-cosmic-border-subtle">
                <span className="text-[10px] text-cosmic-lavender/60 block uppercase">Sunrise</span>
                <strong className="text-sm md:text-base text-cosmic-ivory font-mono mt-1 block">
                  {panchang.timings.sunrise}
                </strong>
              </div>

              <div className="p-4 rounded-xl bg-cosmic-surface/60 border border-cosmic-border-subtle">
                <span className="text-[10px] text-cosmic-lavender/60 block uppercase">Sunset</span>
                <strong className="text-sm md:text-base text-cosmic-ivory font-mono mt-1 block">
                  {panchang.timings.sunset}
                </strong>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <span className="text-[10px] text-emerald-300/80 block uppercase">Abhijit Muhurat</span>
                <strong className="text-sm md:text-base text-emerald-300 font-mono mt-1 block">
                  {panchang.timings.abhijitMuhurat}
                </strong>
                <span className="text-[10px] text-emerald-400/60 block mt-0.5">Most auspicious</span>
              </div>

              <div id="rahu-kaal" className="scroll-mt-24 p-4 rounded-xl bg-rose-950/20 border border-rose-500/30">
                <span className="text-[10px] text-rose-300/80 block uppercase">Rahu Kaal</span>
                <strong className="text-sm md:text-base text-rose-300 font-mono mt-1 block">
                  {panchang.timings.rahuKaal}
                </strong>
                <span className="text-[10px] text-rose-400/60 block mt-0.5">Avoid new beginnings</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
