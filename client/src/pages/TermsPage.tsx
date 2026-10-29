import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="font-display text-4xl font-extrabold text-cosmic-ivory">
          Terms of Service
        </h1>
        <p className="text-xs text-cosmic-lavender/60">
          Last updated: October 2026
        </p>
      </div>

      <div className="bg-cosmic-card backdrop-blur-md rounded-3xl border border-cosmic-border p-6 md:p-10 shadow-cosmic-card space-y-6 text-sm text-cosmic-lavender/90 leading-relaxed font-sans">
        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-cosmic-ivory">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Voxigen web application ("Voxigen"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please discontinue using the service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-cosmic-ivory">2. Astrological Guidance Disclaimer</h2>
          <p>
            Vedic astrology (Jyotish) is an ancient symbolic, archetypal, and philosophical tradition. All calculations, interpretations, yogas, and dasha predictions provided by Voxigen are intended solely for educational, cultural, and personal self-reflection purposes.
          </p>
          <p className="p-4 rounded-xl bg-cosmic-purple/30 border border-cosmic-gold/30 text-cosmic-ivory font-medium">
            Astrological insights do not constitute, and should never replace, professional medical, psychological, legal, or financial advice. Voxigen does not guarantee specific future outcomes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-cosmic-ivory">3. Intellectual Property</h2>
          <p>
            All original algorithms, SVG chart visualization designs, branding ("Voxigen"), and UI elements are the intellectual property of Voxigen and protected under relevant copyright laws.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-cosmic-ivory">4. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-cosmic-ivory">5. Service purchases and access periods</h2>
          <p>
            Basic Horoscope is a single report view. Bronze Horoscope, Basic Voice Report, and the Silver Bundle include four calendar months of access from confirmed payment and do not renew automatically. Gold is a one-time purchase with lifetime support for the purchased report; that support does not include unlimited new reports or analyses.
          </p>
          <p>
            Voice insights are for personal reflection and general wellness only. They do not provide medical diagnosis, treatment advice, or a substitute for consultation with a qualified healthcare professional.
          </p>
        </section>
      </div>
    </div>
  );
};
