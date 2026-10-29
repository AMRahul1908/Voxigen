import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Phone } from 'lucide-react';
import { usePreferences } from '../preferences/PreferencesContext';

const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => <Link to={to}>{children}</Link>;

const FOOTER_COPY = {
  en: { description: 'Explore astrology, personal charts, and self-discovery tools with Voxigen.', explore: 'Explore', discover: 'Discover', contact: 'Get in touch', chart: 'Free birth chart', compatibility: 'Compatibility', panchang: 'Panchang', horoscope: 'Horoscope', human: 'Human Design', gene: 'Gene Keys', voice: 'Voice analysis', journal: 'Journal', appointment: 'Request an appointment', about: 'About Voxigen', privacy: 'Privacy', terms: 'Terms', top: 'Back to top', rights: 'All rights reserved.' },
  kn: { description: 'ವೋಕ್ಸಿಜೆನ್‌ನೊಂದಿಗೆ ಜ್ಯೋತಿಷ್ಯ, ವೈಯಕ್ತಿಕ ಜಾತಕ ಮತ್ತು ಸ್ವ-ಅನ್ವೇಷಣಾ ಸಾಧನಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.', explore: 'ಅನ್ವೇಷಿಸಿ', discover: 'ತಿಳಿಯಿರಿ', contact: 'ಸಂಪರ್ಕಿಸಿ', chart: 'ಉಚಿತ ಜನ್ಮಜಾತಕ', compatibility: 'ಹೊಂದಾಣಿಕೆ', panchang: 'ಪಂಚಾಂಗ', horoscope: 'ರಾಶಿಫಲ', human: 'ಹ್ಯೂಮನ್ ಡಿಸೈನ್', gene: 'ಜೀನ್ ಕೀಸ್', voice: 'ಧ್ವನಿ ವಿಶ್ಲೇಷಣೆ', journal: 'ಲೇಖನಗಳು', appointment: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಕೋರಿಸಿ', about: 'ವೋಕ್ಸಿಜೆನ್ ಬಗ್ಗೆ', privacy: 'ಗೌಪ್ಯತೆ', terms: 'ನಿಯಮಗಳು', top: 'ಮೇಲಕ್ಕೆ ಹೋಗಿ', rights: 'ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.' },
  hi: { description: 'वॉक्सिजेन के साथ ज्योतिष, व्यक्तिगत कुंडली और आत्म-खोज के साधन देखें।', explore: 'देखें', discover: 'जानें', contact: 'संपर्क करें', chart: 'मुफ़्त जन्म कुंडली', compatibility: 'अनुकूलता', panchang: 'पंचांग', horoscope: 'राशिफल', human: 'ह्यूमन डिज़ाइन', gene: 'जीन कीज़', voice: 'आवाज़ विश्लेषण', journal: 'लेख', appointment: 'अपॉइंटमेंट का अनुरोध करें', about: 'वॉक्सिजेन के बारे में', privacy: 'गोपनीयता', terms: 'नियम', top: 'ऊपर जाएँ', rights: 'सर्वाधिकार सुरक्षित।' },
};

export const Footer: React.FC = () => {
  const { language } = usePreferences();
  const copy = FOOTER_COPY[language];
  return <footer className="site-footer">
  <div className="site-footer-main">
    <div className="site-footer-brand"><Link to="/" className="site-brand"><span className="site-brand-mark"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3 37 20 20 37 3 20 20 3Z"/><circle cx="20" cy="20" r="5" /></svg></span><span>VOXIGEN<small>ASTROLOGY & INSIGHT</small></span></Link><p>{copy.description}</p></div>
    <div className="site-footer-column"><h3>{copy.explore}</h3><FooterLink to="/free-kundali">{copy.chart}</FooterLink><FooterLink to="/compatibility">{copy.compatibility}</FooterLink><FooterLink to="/panchang">{copy.panchang}</FooterLink><FooterLink to="/horoscope">{copy.horoscope}</FooterLink></div>
    <div className="site-footer-column"><h3>{copy.discover}</h3><FooterLink to="/human-design">{copy.human}</FooterLink><FooterLink to="/gene-keys">{copy.gene}</FooterLink><FooterLink to="/account">{copy.voice}</FooterLink><FooterLink to="/blog">{copy.journal}</FooterLink></div>
    <div className="site-footer-column"><h3>{copy.contact}</h3><FooterLink to="/appointment">{copy.appointment}</FooterLink><FooterLink to="/about">{copy.about}</FooterLink><a href="tel:+918970171999"><Phone size={14} /> +91 89701 71999</a><a href="tel:+919449607538"><Phone size={14} /> +91 94496 07538</a></div>
  </div>
  <div className="site-footer-bottom"><span>© {new Date().getFullYear()} Voxigen. {copy.rights}</span><div><FooterLink to="/privacy">{copy.privacy}</FooterLink><FooterLink to="/terms">{copy.terms}</FooterLink><a href="#top" onClick={event => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>{copy.top} <ArrowUpRight size={13} /></a></div></div>
</footer>;
};
