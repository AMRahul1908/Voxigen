import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { KundaliPage } from './pages/KundaliPage';
import { FreeKundaliPage } from './pages/FreeKundaliPage';
import { HoroscopePage } from './pages/HoroscopePage';
import { PanchangPage } from './pages/PanchangPage';
import { CompatibilityPage } from './pages/CompatibilityPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { BlueprintPage } from './pages/BlueprintPage';
import { BlogPage } from './pages/BlogPage';
import { VoiceAnalysisPage } from './pages/VoiceAnalysisPage';
import { AccountPage } from './pages/AccountPage';
import { AppointmentPage } from './pages/AppointmentPage';
import { apiFetch } from './utils/api';

function PremiumRoute({ children }: { children: React.ReactNode }) {
  const [access, setAccess] = useState<'checking' | 'allowed' | 'denied'>('checking');
  const location = useLocation();
  useEffect(() => {
    let current = true;
    apiFetch<{ user: { servicesAllowed: string[] } }>('/account/me')
      .then(({ user }) => { const service = location.pathname === '/voice-analysis' ? 'voice' : 'horoscope'; if (current) setAccess(user.servicesAllowed.includes(service) ? 'allowed' : 'denied'); })
      .catch(() => { if (current) setAccess('denied'); });
    return () => { current = false; };
  }, [location.pathname]);
  if (access === 'checking') return <div className="mx-auto max-w-4xl px-4 py-20 text-center text-cosmic-lavender">Checking your membership…</div>;
  return access === 'allowed' ? <>{children}</> : <Navigate to="/account" replace state={{ from: location.pathname }} />;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export const App: React.FC = () => {
  return (
    <div className="app-shell flex min-h-screen flex-col bg-cosmic-navy text-cosmic-ivory">
      <ScrollToTop />
      <Navbar />
      <main className="app-main flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/kundali/:id" element={<KundaliPage />} />
          <Route path="/free-kundali" element={<FreeKundaliPage />} />
          <Route path="/human-design" element={<BlueprintPage kind="humandesign" />} />
          <Route path="/gene-keys" element={<BlueprintPage kind="genekeys" />} />
          <Route path="/horoscope" element={<PremiumRoute><HoroscopePage /></PremiumRoute>} />
          <Route path="/panchang" element={<PanchangPage />} />
          <Route path="/compatibility" element={<CompatibilityPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/appointment" element={<AppointmentPage />} />
          <Route path="/voice-analysis" element={<PremiumRoute><VoiceAnalysisPage /></PremiumRoute>} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          {/* Fallback 404 */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};
