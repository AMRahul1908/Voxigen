import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="font-display text-4xl font-extrabold text-cosmic-ivory">
          Privacy Policy
        </h1>
        <p className="text-xs text-cosmic-lavender/60">
          Last updated: October 2026
        </p>
      </div>

      <div className="bg-cosmic-card backdrop-blur-md rounded-3xl border border-cosmic-border p-6 md:p-10 shadow-cosmic-card space-y-6 text-sm text-cosmic-lavender/90 leading-relaxed font-sans">
        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-cosmic-ivory">1. Introduction</h2>
          <p>
            At Voxigen (“we”, “our”, or “us”), your privacy and the confidentiality of your birth data are paramount. This Privacy Policy details our practices concerning the collection, use, and security of information entered into our Vedic birth chart calculations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-cosmic-ivory">2. Information We Collect</h2>
          <p>
            When you create an account, purchase a plan, or calculate a Janam Kundali on Voxigen, we collect:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Full Name (for report identification purposes)</li>
            <li>Date of Birth and Time of Birth</li>
            <li>Place of Birth (City, State, Country) and resolved Geographic Coordinates (Latitude and Longitude)</li>
            <li>Gender (optional)</li>
            <li>Account email address and password hash used to authenticate your account</li>
            <li>Contact phone number and current location</li>
            <li>Selected plan, membership status, and payment order and transaction identifiers</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-cosmic-ivory">3. How Your Information Is Used</h2>
          <p>
            Your birth details are used to provide astrology services. Account details are used to secure your login, manage membership access, and contact you about your account or appointment. Payment is processed by our payment provider; Voxigen does not ask for or store card or bank credentials. We do not sell personal birth records to advertising networks.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-cosmic-ivory">4. Security & Storage</h2>
          <p>
            Network communication should use TLS in production. Account profiles, birth details, and membership records are stored in MongoDB. Passwords are stored as salted cryptographic hashes, and login sessions use random, expiring server-side tokens in HttpOnly cookies. Payment card or bank credentials are handled by the payment provider and are not stored by Voxigen. Please use the Contact Us channel to request access to or deletion of your account data.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-bold text-cosmic-ivory">5. Contact Us</h2>
          <p>
            If you have questions regarding this Privacy Policy or wish to request the deletion of your chart records, please reach out through our official contact channels.
          </p>
        </section>
      </div>
    </div>
  );
};
