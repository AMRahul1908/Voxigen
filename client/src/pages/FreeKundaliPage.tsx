import React from 'react';
import { BirthForm } from '../components/BirthForm';
import { Sparkles, CheckCircle } from 'lucide-react';

export const FreeKundaliPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
      {/* Hero with Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cosmic-purple/40 border border-cosmic-gold/40 text-xs font-semibold text-cosmic-gold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Free & Unlimited Vedic Janam Kundali</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-cosmic-ivory leading-tight">
            Free Online Vedic <br />
            <span className="text-cosmic-gold">Kundali Generator</span>
          </h1>

          <p className="text-sm sm:text-base text-cosmic-lavender/80 leading-relaxed font-sans">
            Generate your degree-accurate Janam Kundali (birth chart) calculated with astronomical ephemeris standards. Explore your Lagna, planetary positions, D9 Navamsa, Vimshottari Dasha, and personal Vedic yogas.
          </p>

          <div className="space-y-3 pt-2">
            {[
              'Precise Lahiri (Chitrapaksha) sidereal ayanamsha calculations',
              'Traditional North, South, and East Indian chart layouts',
              'Comprehensive 120-year Vimshottari Mahadasha timeline',
              'Free instant PDF download and print-ready report'
            ].map((text, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-cosmic-ivory">
                <CheckCircle className="w-4 h-4 text-cosmic-gold shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 w-full max-w-xl mx-auto">
          <BirthForm buttonText="Calculate My Free Kundali" />
        </div>
      </div>

      {/* Educational Guide */}
      <div className="pt-12 border-t border-cosmic-border-subtle max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-cosmic-ivory">
            Understanding Your Vedic Birth Chart
          </h2>
          <p className="text-xs md:text-sm text-cosmic-lavender/70 mt-2">
            A Janam Kundali is a snapshot of the heavens at the exact minute and latitude of your birth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-cosmic-card border border-cosmic-border-subtle space-y-2">
            <h3 className="font-display text-base font-semibold text-cosmic-gold">1. Lagna (Ascendant)</h3>
            <p className="text-xs text-cosmic-lavender/80 leading-relaxed font-sans">
              The zodiac constellation rising on the eastern horizon at the moment of birth. It defines physical constitution, personality, and outer life trajectory.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-cosmic-card border border-cosmic-border-subtle space-y-2">
            <h3 className="font-display text-base font-semibold text-cosmic-gold">2. Chandra Rashi (Moon)</h3>
            <p className="text-xs text-cosmic-lavender/80 leading-relaxed font-sans">
              The zodiac sign occupied by the Moon. In Vedic astrology, the Moon governs mental equilibrium, instinctual emotional reactions, and Janma Nakshatra.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-cosmic-card border border-cosmic-border-subtle space-y-2">
            <h3 className="font-display text-base font-semibold text-cosmic-gold">3. D9 Navamsa Chart</h3>
            <p className="text-xs text-cosmic-lavender/80 leading-relaxed font-sans">
              The 9th harmonic divisional chart. Essential for evaluating inner spiritual potential, marital compatibility, and planetary strength in mature life.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
