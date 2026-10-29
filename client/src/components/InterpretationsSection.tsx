import React from 'react';
import { KundaliInterpretations, KundaliChartData } from '../types';
import { BookOpen, Compass, Moon, Sun, Star, CheckCircle, AlertCircle, Feather } from 'lucide-react';

interface InterpretationsSectionProps {
  data: KundaliChartData;
}

export const InterpretationsSection: React.FC<InterpretationsSectionProps> = ({ data }) => {
  const interp: KundaliInterpretations = data.interpretations;

  return (
    <div className="bg-cosmic-card backdrop-blur-md rounded-2xl border border-cosmic-border p-5 md:p-8 shadow-cosmic-card space-y-8">
      {/* Section Title */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-cosmic-border-subtle">
        <BookOpen className="w-6 h-6 text-cosmic-gold" />
        <div>
          <h3 className="text-xl md:text-2xl font-display font-semibold text-cosmic-ivory">
            Astrological Interpretations & Life Blueprint
          </h3>
          <p className="text-xs text-cosmic-lavender/70 mt-0.5">
            Ancient Parashara insights translated into actionable modern wisdom.
          </p>
        </div>
      </div>

      {/* Primary Trinity Cards: Lagna, Moon, Sun */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Lagna (Ascendant) */}
        <div className="p-5 rounded-2xl bg-cosmic-surface/60 border border-cosmic-border-subtle hover:border-cosmic-gold/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cosmic-gold mb-3">
              <Compass className="w-5 h-5" />
              <h4 className="font-display font-semibold text-base text-cosmic-ivory">
                Ascendant (Lagna)
              </h4>
            </div>
            <div className="mb-2">
              <span className="text-xl font-display font-bold text-cosmic-gold">
                {data.ascendant.sign}
              </span>
              <span className="text-xs text-cosmic-lavender/60 ml-2">
                ({data.ascendant.degreeFormatted})
              </span>
            </div>
            <p className="text-xs text-cosmic-lavender/90 leading-relaxed font-sans">
              {interp.ascendantOverview}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-cosmic-border-subtle/60 text-[11px] text-cosmic-lavender/60">
            Element: <strong className="text-cosmic-ivory">{data.ascendant.element}</strong> • Lord: <strong className="text-cosmic-ivory">{data.ascendant.signLord}</strong>
          </div>
        </div>

        {/* Chandra (Moon Sign) */}
        <div className="p-5 rounded-2xl bg-cosmic-surface/60 border border-cosmic-border-subtle hover:border-cosmic-gold/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cosmic-gold mb-3">
              <Moon className="w-5 h-5" />
              <h4 className="font-display font-semibold text-base text-cosmic-ivory">
                Moon Sign (Chandra Rashi)
              </h4>
            </div>
            <div className="mb-2">
              <span className="text-xl font-display font-bold text-cosmic-gold">
                {data.moonSign.sign}
              </span>
              <span className="text-xs text-cosmic-lavender/60 ml-2">
                (Nakshatra: {data.janmaNakshatra.name})
              </span>
            </div>
            <p className="text-xs text-cosmic-lavender/90 leading-relaxed font-sans">
              {interp.moonSignOverview}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-cosmic-border-subtle/60 text-[11px] text-cosmic-lavender/60">
            Mind & Emotions • Lord: <strong className="text-cosmic-ivory">{data.moonSign.nakshatraLord}</strong>
          </div>
        </div>

        {/* Surya (Sun Sign) */}
        <div className="p-5 rounded-2xl bg-cosmic-surface/60 border border-cosmic-border-subtle hover:border-cosmic-gold/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cosmic-gold mb-3">
              <Sun className="w-5 h-5" />
              <h4 className="font-display font-semibold text-base text-cosmic-ivory">
                Sun Sign (Surya Rashi)
              </h4>
            </div>
            <div className="mb-2">
              <span className="text-xl font-display font-bold text-cosmic-gold">
                {data.sunSign.sign}
              </span>
            </div>
            <p className="text-xs text-cosmic-lavender/90 leading-relaxed font-sans">
              {interp.sunSignOverview}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-cosmic-border-subtle/60 text-[11px] text-cosmic-lavender/60">
            Vitality & Soul Essence • Authority Drive
          </div>
        </div>
      </div>

      {/* Janma Nakshatra Deep Dive */}
      <div className="p-5 md:p-6 rounded-2xl bg-cosmic-indigo/50 border border-cosmic-border-subtle">
        <div className="flex items-center gap-2 text-cosmic-gold mb-3">
          <Star className="w-5 h-5" />
          <h4 className="font-display font-semibold text-lg text-cosmic-ivory">
            Janma Nakshatra: {data.janmaNakshatra.name} (Pada {data.janmaNakshatra.pada})
          </h4>
        </div>

        <p className="text-xs md:text-sm text-cosmic-ivory/90 leading-relaxed mb-4 font-sans">
          {interp.nakshatraOverview}
        </p>

        {/* Nakshatra Archetypal Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-4 border-t border-cosmic-border-subtle/60 text-xs">
          <div className="p-2.5 rounded-xl bg-cosmic-navy/60 border border-cosmic-border-subtle">
            <span className="text-[10px] text-cosmic-lavender/60 block uppercase">Deity</span>
            <strong className="text-cosmic-gold font-medium">{data.janmaNakshatra.deity}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-cosmic-navy/60 border border-cosmic-border-subtle">
            <span className="text-[10px] text-cosmic-lavender/60 block uppercase">Symbol</span>
            <strong className="text-cosmic-ivory font-medium">{data.janmaNakshatra.symbol}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-cosmic-navy/60 border border-cosmic-border-subtle">
            <span className="text-[10px] text-cosmic-lavender/60 block uppercase">Ruler Lord</span>
            <strong className="text-cosmic-gold font-medium">{data.janmaNakshatra.lord}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-cosmic-navy/60 border border-cosmic-border-subtle">
            <span className="text-[10px] text-cosmic-lavender/60 block uppercase">Gana</span>
            <strong className="text-cosmic-ivory font-medium">{data.janmaNakshatra.gan}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-cosmic-navy/60 border border-cosmic-border-subtle">
            <span className="text-[10px] text-cosmic-lavender/60 block uppercase">Nadi</span>
            <strong className="text-cosmic-ivory font-medium">{data.janmaNakshatra.nadi}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-cosmic-navy/60 border border-cosmic-border-subtle">
            <span className="text-[10px] text-cosmic-lavender/60 block uppercase">Yoni</span>
            <strong className="text-cosmic-ivory font-medium">{data.janmaNakshatra.yoni}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-cosmic-navy/60 border border-cosmic-border-subtle">
            <span className="text-[10px] text-cosmic-lavender/60 block uppercase">Varna</span>
            <strong className="text-cosmic-ivory font-medium">{data.janmaNakshatra.varna}</strong>
          </div>
        </div>
      </div>

      {/* Strengths & Challenges Dual Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Key Strengths */}
        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
          <h4 className="font-display font-semibold text-base text-emerald-300 flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            Cosmic Strengths & Talents
          </h4>
          <ul className="space-y-2">
            {interp.strengths.map((str, i) => (
              <li key={i} className="text-xs text-cosmic-ivory flex items-start gap-2">
                <span className="text-emerald-400 font-bold mt-0.5">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Growth Challenges */}
        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30">
          <h4 className="font-display font-semibold text-base text-amber-300 flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            Karmic Growth Challenges
          </h4>
          <ul className="space-y-2">
            {interp.challenges.map((ch, i) => (
              <li key={i} className="text-xs text-cosmic-ivory flex items-start gap-2">
                <span className="text-amber-400 font-bold mt-0.5">•</span>
                <span>{ch}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Spiritual Guidance & Remedies */}
      <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-cosmic-purple/30 via-cosmic-indigo/40 to-cosmic-purple/30 border border-cosmic-border">
        <div className="flex items-center gap-2.5 text-cosmic-gold mb-3">
          <Feather className="w-5 h-5" />
          <h4 className="font-display font-semibold text-lg text-cosmic-ivory">
            Vedic Spiritual Guidance & Evolutionary Dharma
          </h4>
        </div>
        <p className="text-xs md:text-sm text-cosmic-lavender/90 leading-relaxed font-sans">
          {interp.spiritualGuidance}
        </p>
      </div>
    </div>
  );
};
