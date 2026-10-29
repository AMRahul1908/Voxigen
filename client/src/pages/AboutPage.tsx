import { Sparkles, Orbit, Compass, ShieldCheck } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cosmic-purple/40 border border-cosmic-gold/40 text-xs font-semibold text-cosmic-gold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Vision & Heritage</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-cosmic-ivory">
          About Voxigen
        </h1>
      </div>

      <div className="bg-cosmic-card backdrop-blur-md rounded-3xl border border-cosmic-border p-6 md:p-10 shadow-cosmic-card space-y-8 text-sm md:text-base text-cosmic-lavender/90 leading-relaxed font-sans">
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold text-cosmic-ivory flex items-center gap-2">
            <Orbit className="w-5 h-5 text-cosmic-gold" />
            The Intersection of Ancient Jyotish & Astronomical Ephemeris
          </h2>
          <p>
            Vedic astrology (Jyotisha — "the science of light") is among the world's most sophisticated systems for mapping human potential against the cosmic clock. Founded on the celestial treatises of Maharishi Parashara, Varahamihira, and Aryabhata, it recognizes that every soul enters the physical plane at an exact, mathematically coordinated cosmic configuration.
          </p>
          <p>
            Voxigen was built with a singular mission: to provide authentic, degree-accurate Vedic calculations without commercial sensationalism or fabricated data. By pairing classical Parashari algorithms with high-precision JPL planetary ephemeris, we calculate exact sidereal longitudes, true local sidereal time, and authentic Vimshottari Dasha cycles.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-cosmic-border-subtle">
          <h2 className="font-display text-2xl font-bold text-cosmic-ivory flex items-center gap-2">
            <Compass className="w-5 h-5 text-cosmic-gold" />
            The Lahiri (Chitrapaksha) Ayanamsha Standard
          </h2>
          <p>
            Vedic astrology operates on the <em>Nirayana</em> (sidereal) zodiac, which adjusts for the slow conical wobble of the Earth's rotational axis known as the Precession of the Equinoxes (~50.29 seconds of arc per year). Voxigen defaults to the Lahiri (Chitrapaksha) ayanamsha, officially adopted by the Government of India's Calendar Reform Committee and respected by astrologers worldwide.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-cosmic-border-subtle">
          <h2 className="font-display text-2xl font-bold text-cosmic-ivory flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cosmic-gold" />
            Commitment to Algorithmic Transparency
          </h2>
          <p>
            Unlike automated horoscope generators that output generic boilerplate, Voxigen computes your real planetary degrees, Nakshatras, and Padas in real time. If a particular time of birth is unknown, we state this clearly and perform noon standard analysis rather than guessing false ascendant coordinates.
          </p>
        </section>
      </div>
    </div>
  );
};
