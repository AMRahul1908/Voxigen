import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, CircleUserRound, Menu, Moon, Phone, Sun, X } from 'lucide-react';
import { usePreferences } from '../preferences/PreferencesContext';

const navCopy: Record<'en' | 'kn' | 'hi', Record<string, string>> = {
  en: {},
  kn: { Home: 'ಮುಖಪುಟ', 'Free birth chart': 'ಉಚಿತ ಜನ್ಮಜಾತಕ', Panchang: 'ಪಂಚಾಂಗ', 'Human Design': 'ಹ್ಯೂಮನ್ ಡಿಸೈನ್', 'Gene Keys': 'ಜೀನ್ ಕೀಸ್', Blog: 'ಬ್ಲಾಗ್', Compatibility: 'ಹೊಂದಾಣಿಕೆ', Horoscope: 'ರಾಶಿಫಲ', About: 'ನಮ್ಮ ಬಗ್ಗೆ', 'Talk to an astrologer': 'ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ', Account: 'ಖಾತೆ', More: 'ಇನ್ನಷ್ಟು', 'Astrology and self-discovery, at your pace': 'ಜ್ಯೋತಿಷ್ಯ ಮತ್ತು ಸ್ವ-ಅನ್ವೇಷಣೆ, ನಿಮ್ಮ ವೇಗದಲ್ಲಿ', 'Contact us': 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ' },
  hi: { Home: 'होम', 'Free birth chart': 'मुफ़्त जन्म कुंडली', Panchang: 'पंचांग', 'Human Design': 'ह्यूमन डिज़ाइन', 'Gene Keys': 'जीन कीज़', Blog: 'ब्लॉग', Compatibility: 'अनुकूलता', Horoscope: 'राशिफल', About: 'हमारे बारे में', 'Talk to an astrologer': 'ज्योतिषी से बात करें', Account: 'खाता', More: 'और सेवाएँ', 'Astrology and self-discovery, at your pace': 'ज्योतिष और आत्म-खोज, आपकी गति से', 'Contact us': 'संपर्क करें' },
};

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { language, setLanguage, theme, setTheme } = usePreferences();
  const [open, setOpen] = useState(false);
  const label = (name: string) => navCopy[language][name] || name;
  const active = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  const primary = [
    { label: 'Home', path: '/' },
    { label: 'Free birth chart', path: '/free-kundali' },
    { label: 'Panchang', path: '/panchang' },
    { label: 'Human Design', path: '/human-design' },
    { label: 'Gene Keys', path: '/gene-keys' },
    { label: 'Blog', path: '/blog' },
  ];
  const more = [
    { label: 'Compatibility', path: '/compatibility' },
    { label: 'Horoscope', path: '/horoscope' },
    { label: 'About', path: '/about' },
  ];

  const close = () => setOpen(false);
  return <>
    <div className="site-topline"><div className="site-topline-inner"><span>{label('Astrology and self-discovery, at your pace')}</span><div className="site-topline-actions"><label className="site-language"><span className="sr-only">Language</span><select value={language} onChange={event => setLanguage(event.target.value as 'en' | 'kn' | 'hi')} aria-label="Language"><option value="en">EN</option><option value="kn">ಕನ್ನಡ</option><option value="hi">हिन्दी</option></select></label><button className="site-theme-toggle" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>{theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}</button><a href="tel:+918970171999"><Phone size={13} /> {label('Contact us')} <strong>+91 89701 71999</strong></a></div></div></div>
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="site-brand" aria-label="Voxigen home" onClick={close}><span className="site-brand-mark"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3 37 20 20 37 3 20 20 3Z"/><circle cx="20" cy="20" r="5" /></svg></span><span>VOXIGEN<small>ASTROLOGY & INSIGHT</small></span></Link>
        <nav className="site-nav-desktop" aria-label="Main navigation">
          {primary.map(item => <Link key={item.path} to={item.path} aria-current={active(item.path) ? 'page' : undefined} className={active(item.path) ? 'is-active' : ''}>{label(item.label)}</Link>)}
          <div className="site-nav-more"><button type="button" aria-expanded={open} onClick={() => setOpen(!open)}>{label('More')} <ChevronDown size={14} /></button><div className="site-dropdown">{more.map(item => <Link key={item.path} to={item.path} onClick={close}>{label(item.label)}</Link>)}</div></div>
        </nav>
        <div className="site-header-actions"><Link to="/appointment" className="site-consult-link">{label('Talk to an astrologer')}</Link><Link to="/account" className="site-account-link" aria-current={active('/account') ? 'page' : undefined}><CircleUserRound size={17} />{label('Account')}</Link></div>
        <button className="site-mobile-toggle" type="button" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav className="site-mobile-nav" aria-label="Mobile navigation">{[...primary, ...more, { label: 'Talk to an astrologer', path: '/appointment' }, { label: 'Account', path: '/account' }].map(item => <Link key={item.path} to={item.path} onClick={close} aria-current={active(item.path) ? 'page' : undefined}>{label(item.label)}<span>›</span></Link>)}</nav>}
    </header>
  </>;
};
