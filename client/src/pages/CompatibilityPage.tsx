import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { HeartHandshake, ShieldCheck } from 'lucide-react';

const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
  'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

export const CompatibilityPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const matchType = searchParams.get('type');
  const pageTitle = matchType === 'love' ? 'Love Compatibility' : matchType === 'marriage' ? 'Marriage Compatibility' : 'Kundali Matching';
  const [groomNak, setGroomNak] = useState('Rohini');
  const [brideNak, setBrideNak] = useState('Pushya');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiFetch<{ success: boolean; data: any }>('/compatibility/calculate', {
        method: 'POST',
        body: JSON.stringify({
          groomNakshatra: groomNak,
          brideNakshatra: brideNak
        })
      });

      if (res.success) {
        setResult(res.data);
      }
    } catch (err) {
      console.error('Failed to calculate compatibility:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cosmic-purple/40 border border-cosmic-gold/40 text-xs font-semibold text-cosmic-gold">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Vedic Ashtakoot Gun Milan (36 Points)</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-cosmic-ivory">
          {pageTitle}
        </h1>
        <p className="text-xs md:text-sm text-cosmic-lavender/70 font-sans">
          Evaluate 8-fold cosmic compatibility between prospective partners according to classical Vedic principles.
        </p>
      </div>

      {/* Input Form */}
      <div className="max-w-2xl mx-auto bg-cosmic-card backdrop-blur-md rounded-3xl border border-cosmic-border p-6 md:p-8 shadow-cosmic-card">
        <form onSubmit={handleCalculate} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-cosmic-lavender mb-2">
                Groom’s Janma Nakshatra
              </label>
              <select
                value={groomNak}
                onChange={e => setGroomNak(e.target.value)}
                className="w-full px-4 py-3 bg-cosmic-surface border border-cosmic-border-subtle rounded-xl text-sm text-cosmic-ivory focus:outline-none focus:ring-2 focus:ring-cosmic-gold/50"
              >
                {NAKSHATRA_NAMES.map(n => (
                  <option key={n} value={n} className="bg-cosmic-navy text-cosmic-ivory">
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-cosmic-lavender mb-2">
                Bride’s Janma Nakshatra
              </label>
              <select
                value={brideNak}
                onChange={e => setBrideNak(e.target.value)}
                className="w-full px-4 py-3 bg-cosmic-surface border border-cosmic-border-subtle rounded-xl text-sm text-cosmic-ivory focus:outline-none focus:ring-2 focus:ring-cosmic-gold/50"
              >
                {NAKSHATRA_NAMES.map(n => (
                  <option key={n} value={n} className="bg-cosmic-navy text-cosmic-ivory">
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-display font-semibold text-sm bg-gradient-to-r from-cosmic-gold via-[#E8CF8C] to-cosmic-gold text-cosmic-navy shadow-gold hover:shadow-lg transition-all"
          >
            {loading ? 'Evaluating Gun Milan…' : 'Calculate Compatibility Score'}
          </button>
        </form>
      </div>

      {/* Results Display */}
      {result && (
        <div className="max-w-3xl mx-auto bg-cosmic-card backdrop-blur-md rounded-3xl border border-cosmic-border p-6 md:p-10 shadow-cosmic-card space-y-8 animate-fadeIn">
          {/* Top Score Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-cosmic-border-subtle text-center sm:text-left">
            <div>
              <span className="text-xs text-cosmic-gold uppercase tracking-wider font-semibold">
                Gun Milan Score
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display text-4xl md:text-5xl font-extrabold text-cosmic-gold">
                  {result.totalScore}
                </span>
                <span className="text-xl text-cosmic-lavender/60">/ {result.maxScore}</span>
                <span className="text-sm font-semibold text-cosmic-ivory ml-2">
                  ({result.percentage}%)
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-cosmic-purple/40 border border-cosmic-gold/40 max-w-xs text-xs text-cosmic-ivory">
              <strong className="text-cosmic-gold block mb-1">Vedic Verdict:</strong>
              {result.verdict}
            </div>
          </div>

          {/* 8 Kootas Breakdown Table */}
          <div className="space-y-3">
            <h3 className="font-display text-lg font-semibold text-cosmic-ivory">
              Ashtakoot (8-Fold) Dimensional Analysis
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.kootas.map((koota: any) => (
                <div
                  key={koota.name}
                  className="p-3.5 rounded-xl bg-cosmic-surface/60 border border-cosmic-border-subtle flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-cosmic-ivory">{koota.name}</p>
                    <p className="text-[11px] text-cosmic-lavender/60">{koota.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-display font-bold text-sm text-cosmic-gold">
                      {koota.score} / {koota.max}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Manglik Analysis */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{result.manglikAnalysis.status}</span>
          </div>
        </div>
      )}
    </div>
  );
};
