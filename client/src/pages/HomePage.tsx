import { ArrowRight, AudioLines, ChevronRight, Compass, Heart, MoonStar, Sparkles, Star, Sun, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePreferences } from '../preferences/PreferencesContext';

const COPY = {
  en: {
    eyebrow: 'Astrology, made personal', title: <>Find a little more <span>clarity</span> in your stars.</>, lede: 'Explore your birth chart, understand your cosmic profile, and connect with an astrologer when you need a human perspective.', chartCta: 'Create your free chart', consultCta: 'Talk to an astrologer', proof: 'Thoughtful tools for your personal journey', art: 'YOUR COSMIC\nBLUEPRINT', artNote: 'Made for your journey', artChip: 'Birth chart insights', heroBottom: 'Discover what makes your path unique',
    sectionKicker: 'Explore Voxigen', sectionTitle: 'Guidance for every part of your journey', sectionText: 'Start with a chart, learn about your patterns, or find the right person to guide you.',
    offers: [['Birth chart', 'Explore your Vedic birth chart, planetary placements and chart details.', 'Create your chart'], ['Compatibility', 'Review relationship compatibility with birth details for both people.', 'Check compatibility'], ['Panchang', 'Browse the day’s traditional calendar details and auspicious timings.', 'View Panchang'], ['Voice analysis', 'See available voice analysis plans and member access in your account.', 'Explore plans'], ['Human Design', 'Explore a personal Human Design chart using your birth information.', 'Explore Human Design'], ['Gene Keys', 'Explore Gene Keys themes through your personal birth profile.', 'Explore Gene Keys']],
    consultKicker: 'A conversation can help', consultTitle: 'Bring your questions to a real astrologer.', consultText: 'Request an appointment and our team will follow up to confirm availability and the consultation details.', appointmentCta: 'Request an appointment', howKicker: 'A simple place to begin', howTitle: 'Your journey, one step at a time', howText: 'Choose the service that feels useful to you. You can explore the site without creating an account.',
    steps: [['Add your birth details', 'Enter the information needed for the service you choose.'], ['Explore your chart', 'Review the chart and insights available on Voxigen.'], ['Get personal guidance', 'Book a consultation when you would like to speak with an astrologer.']], accountKicker: 'Your Voxigen account', accountTitle: 'Keep your services and reports together.', accountText: 'Sign in to manage your account, view active access, and explore available plans.', accountCta: 'Visit your account',
  },
  kn: {
    eyebrow: 'ಜ್ಯೋತಿಷ್ಯ, ನಿಮಗಾಗಿ ವೈಯಕ್ತಿಕವಾಗಿ', title: <>ನಿಮ್ಮ ನಕ್ಷತ್ರಗಳಲ್ಲಿ ಇನ್ನಷ್ಟು <span>ಸ್ಪಷ್ಟತೆ</span> ಕಂಡುಕೊಳ್ಳಿ.</>, lede: 'ನಿಮ್ಮ ಜನ್ಮಜಾತಕವನ್ನು ಅನ್ವೇಷಿಸಿ, ನಿಮ್ಮ ಆಕಾಶೀಯ ಸ್ವರೂಪವನ್ನು ಅರಿತುಕೊಳ್ಳಿ ಮತ್ತು ವೈಯಕ್ತಿಕ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.', chartCta: 'ಉಚಿತ ಜಾತಕ ರಚಿಸಿ', consultCta: 'ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ', proof: 'ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಪಯಣಕ್ಕೆ ಉಪಯುಕ್ತ ಸಾಧನಗಳು', art: 'ನಿಮ್ಮ ಆಕಾಶೀಯ\nನಕ್ಷೆ', artNote: 'ನಿಮ್ಮ ಪಯಣಕ್ಕಾಗಿ', artChip: 'ಜನ್ಮಜಾತಕದ ಒಳನೋಟಗಳು', heroBottom: 'ನಿಮ್ಮ ಪಥದ ವಿಶೇಷತೆಯನ್ನು ಕಂಡುಕೊಳ್ಳಿ',
    sectionKicker: 'ವೋಕ್ಸಿಜೆನ್ ಅನ್ವೇಷಿಸಿ', sectionTitle: 'ನಿಮ್ಮ ಪಯಣದ ಪ್ರತಿಯೊಂದು ಹಂತಕ್ಕೂ ಮಾರ್ಗದರ್ಶನ', sectionText: 'ಜಾತಕದಿಂದ ಪ್ರಾರಂಭಿಸಿ, ನಿಮ್ಮ ಸ್ವಭಾವವನ್ನು ತಿಳಿದುಕೊಳ್ಳಿ ಅಥವಾ ಸೂಕ್ತ ಮಾರ್ಗದರ್ಶಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    offers: [['ಜನ್ಮಜಾತಕ', 'ಗ್ರಹಗಳ ಸ್ಥಾನ ಮತ್ತು ಜಾತಕದ ವಿವರಗಳೊಂದಿಗೆ ನಿಮ್ಮ ವೈದಿಕ ಜನ್ಮಜಾತಕವನ್ನು ಅನ್ವೇಷಿಸಿ.', 'ಜಾತಕ ರಚಿಸಿ'], ['ಹೊಂದಾಣಿಕೆ', 'ಇಬ್ಬರ ಜನ್ಮವಿವರಗಳ ಆಧಾರದಲ್ಲಿ ಸಂಬಂಧದ ಹೊಂದಾಣಿಕೆಯನ್ನು ಪರಿಶೀಲಿಸಿ.', 'ಹೊಂದಾಣಿಕೆ ನೋಡಿ'], ['ಪಂಚಾಂಗ', 'ದಿನದ ಸಾಂಪ್ರದಾಯಿಕ ಪಂಚಾಂಗ ವಿವರಗಳು ಮತ್ತು ಶುಭ ಸಮಯಗಳನ್ನು ನೋಡಿ.', 'ಪಂಚಾಂಗ ನೋಡಿ'], ['ಧ್ವನಿ ವಿಶ್ಲೇಷಣೆ', 'ನಿಮ್ಮ ಖಾತೆಯಲ್ಲಿ ಲಭ್ಯವಿರುವ ಧ್ವನಿ ವಿಶ್ಲೇಷಣೆ ಯೋಜನೆಗಳು ಮತ್ತು ಪ್ರವೇಶವನ್ನು ನೋಡಿ.', 'ಯೋಜನೆಗಳನ್ನು ನೋಡಿ'], ['ಹ್ಯೂಮನ್ ಡಿಸೈನ್', 'ನಿಮ್ಮ ಜನ್ಮವಿವರಗಳನ್ನು ಬಳಸಿ ವೈಯಕ್ತಿಕ ಹ್ಯೂಮನ್ ಡಿಸೈನ್ ಜಾತಕವನ್ನು ಅನ್ವೇಷಿಸಿ.', 'ಹ್ಯೂಮನ್ ಡಿಸೈನ್ ನೋಡಿ'], ['ಜೀನ್ ಕೀಸ್', 'ನಿಮ್ಮ ಜನ್ಮ ಪ್ರೊಫೈಲ್ ಮೂಲಕ ಜೀನ್ ಕೀಸ್‌ನ ವಿಷಯಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.', 'ಜೀನ್ ಕೀಸ್ ನೋಡಿ']],
    consultKicker: 'ಮಾತುಕತೆ ಸಹಾಯ ಮಾಡಬಹುದು', consultTitle: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳನ್ನು ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಚರ್ಚಿಸಿ.', consultText: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಕೋರಿಕೆ ಕಳುಹಿಸಿ. ಲಭ್ಯತೆ ಮತ್ತು ಸಲಹೆಯ ವಿವರಗಳನ್ನು ನಮ್ಮ ತಂಡ ಖಚಿತಪಡಿಸುತ್ತದೆ.', appointmentCta: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಕೋರಿಸಿ', howKicker: 'ಪ್ರಾರಂಭಿಸಲು ಸರಳ ಮಾರ್ಗ', howTitle: 'ನಿಮ್ಮ ಪಯಣ, ಒಂದೊಂದು ಹಂತವಾಗಿ', howText: 'ನಿಮಗೆ ಉಪಯುಕ್ತವೆನಿಸುವ ಸೇವೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ. ಖಾತೆ ತೆರೆಯದೆ ಕೂಡ ವೆಬ್‌ಸೈಟ್ ಅನ್ವೇಷಿಸಬಹುದು.',
    steps: [['ಜನ್ಮವಿವರಗಳನ್ನು ಸೇರಿಸಿ', 'ನೀವು ಆಯ್ಕೆಮಾಡುವ ಸೇವೆಗೆ ಅಗತ್ಯವಾದ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.'], ['ನಿಮ್ಮ ಜಾತಕವನ್ನು ಅನ್ವೇಷಿಸಿ', 'ವೋಕ್ಸಿಜೆನ್‌ನಲ್ಲಿ ಲಭ್ಯವಿರುವ ಜಾತಕ ಮತ್ತು ಒಳನೋಟಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.'], ['ವೈಯಕ್ತಿಕ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ', 'ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಮಾತನಾಡಲು ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಕೋರಿಸಿ.']], accountKicker: 'ನಿಮ್ಮ ವೋಕ್ಸಿಜೆನ್ ಖಾತೆ', accountTitle: 'ನಿಮ್ಮ ಸೇವೆಗಳು ಮತ್ತು ವರದಿಗಳನ್ನು ಒಂದೇ ಕಡೆ ಇರಿಸಿ.', accountText: 'ಖಾತೆಯನ್ನು ನಿರ್ವಹಿಸಲು, ಸಕ್ರಿಯ ಸೇವೆಗಳನ್ನು ನೋಡಲು ಮತ್ತು ಯೋಜನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ಸೈನ್ ಇನ್ ಮಾಡಿ.', accountCta: 'ನಿಮ್ಮ ಖಾತೆ ತೆರೆಯಿರಿ',
  },
  hi: {
    eyebrow: 'ज्योतिष, आपके लिए व्यक्तिगत रूप से', title: <>अपने सितारों में थोड़ी और <span>स्पष्टता</span> पाएँ।</>, lede: 'अपनी जन्म कुंडली देखें, अपनी ब्रह्मांडीय रूपरेखा समझें और व्यक्तिगत मार्गदर्शन के लिए ज्योतिषी से जुड़ें।', chartCta: 'मुफ़्त कुंडली बनाएँ', consultCta: 'ज्योतिषी से बात करें', proof: 'आपकी व्यक्तिगत यात्रा के लिए उपयोगी साधन', art: 'आपकी ब्रह्मांडीय\nरूपरेखा', artNote: 'आपकी यात्रा के लिए', artChip: 'जन्म कुंडली की जानकारी', heroBottom: 'अपने मार्ग की विशेषता जानें',
    sectionKicker: 'वॉक्सिजेन देखें', sectionTitle: 'आपकी यात्रा के हर पड़ाव के लिए मार्गदर्शन', sectionText: 'कुंडली से शुरुआत करें, अपने स्वभाव को समझें या सही मार्गदर्शक से जुड़ें।',
    offers: [['जन्म कुंडली', 'ग्रहों की स्थिति और कुंडली के विवरण के साथ अपनी वैदिक जन्म कुंडली देखें।', 'कुंडली बनाएँ'], ['अनुकूलता', 'दोनों लोगों के जन्म विवरण से रिश्ते की अनुकूलता देखें।', 'अनुकूलता देखें'], ['पंचांग', 'आज के पारंपरिक पंचांग विवरण और शुभ समय देखें।', 'पंचांग देखें'], ['आवाज़ विश्लेषण', 'अपने खाते में उपलब्ध आवाज़ विश्लेषण योजनाएँ और सेवाएँ देखें।', 'योजनाएँ देखें'], ['ह्यूमन डिज़ाइन', 'अपनी जन्म जानकारी से व्यक्तिगत ह्यूमन डिज़ाइन कुंडली देखें।', 'ह्यूमन डिज़ाइन देखें'], ['जीन कीज़', 'अपने जन्म प्रोफ़ाइल के माध्यम से जीन कीज़ के विषयों को जानें।', 'जीन कीज़ देखें']],
    consultKicker: 'बातचीत मदद कर सकती है', consultTitle: 'अपने सवाल किसी वास्तविक ज्योतिषी से पूछें।', consultText: 'अपॉइंटमेंट का अनुरोध करें। हमारी टीम उपलब्धता और सलाह के विवरण की पुष्टि करेगी।', appointmentCta: 'अपॉइंटमेंट का अनुरोध करें', howKicker: 'शुरुआत करने का आसान तरीका', howTitle: 'आपकी यात्रा, एक-एक कदम करके', howText: 'अपने लिए उपयोगी सेवा चुनें। खाता बनाए बिना भी वेबसाइट देख सकते हैं।',
    steps: [['जन्म विवरण जोड़ें', 'चुनी हुई सेवा के लिए आवश्यक जानकारी भरें।'], ['अपनी कुंडली देखें', 'वॉक्सिजेन पर उपलब्ध कुंडली और जानकारी पढ़ें।'], ['व्यक्तिगत मार्गदर्शन पाएँ', 'ज्योतिषी से बात करने के लिए अपॉइंटमेंट का अनुरोध करें।']], accountKicker: 'आपका वॉक्सिजेन खाता', accountTitle: 'अपनी सेवाएँ और रिपोर्ट एक जगह रखें।', accountText: 'खाता प्रबंधित करने, सक्रिय सेवाएँ देखने और योजनाएँ जानने के लिए साइन इन करें।', accountCta: 'अपना खाता खोलें',
  },
} as const;

export const HomePage: React.FC = () => {
  const { language } = usePreferences();
  const copy = COPY[language];
  const offerings = [
    { icon: Compass, link: '/free-kundali' }, { icon: Heart, link: '/compatibility' }, { icon: Sun, link: '/panchang' },
    { icon: AudioLines, link: '/account' }, { icon: Sparkles, link: '/human-design' }, { icon: MoonStar, link: '/gene-keys' },
  ];
  return (
  <div className="vox-home">
    <section className="home-hero">
      <div className="home-hero-grid">
        <div className="home-hero-copy">
          <div className="home-eyebrow"><span className="home-eyebrow-dot" /> {copy.eyebrow}</div>
          <h1>{copy.title}</h1>
          <p className="home-hero-lede">{copy.lede}</p>
          <div className="home-hero-actions">
            <Link to="/free-kundali" className="home-button home-button-primary">{copy.chartCta} <ArrowRight size={17} /></Link>
            <Link to="/appointment" className="home-button home-button-secondary">{copy.consultCta}</Link>
          </div>
          <div className="home-proof"><span className="home-proof-avatars"><i>V</i><i>✦</i><i>☾</i></span><span>{copy.proof}</span></div>
        </div>
        <div className="home-hero-art" aria-label="Decorative astrological chart illustration" role="img">
          <div className="home-art-orbit home-art-orbit-one" /><div className="home-art-orbit home-art-orbit-two" />
          <div className="home-art-disc"><span className="home-art-sun">☼</span><span className="home-art-star home-art-star-one">✦</span><span className="home-art-star home-art-star-two">✧</span><span className="home-art-caption">{copy.art}</span></div>
          <div className="home-art-note"><Sparkles size={15} /><span>{copy.artNote}</span></div>
          <div className="home-art-chip"><MoonStar size={17} /><span>{copy.artChip}</span></div>
        </div>
      </div>
      <div className="home-hero-bottom"><span><Star size={14} fill="currentColor" /> {copy.heroBottom}</span><span className="home-hero-bottom-line" /></div>
    </section>

    <section className="home-services section-wrap">
      <div className="home-section-heading">
        <div><div className="home-kicker">{copy.sectionKicker}</div><h2>{copy.sectionTitle}</h2></div>
        <p>{copy.sectionText}</p>
      </div>
      <div className="home-service-grid">
        {offerings.map(({ icon: Icon, link }, index) => { const [title, text, label] = copy.offers[index]; return <Link to={link} className="home-service-card" key={title}>
          <span className="home-service-icon"><Icon size={21} strokeWidth={1.7} /></span>
          <h3>{title}</h3><p>{text}</p><span className="home-service-link">{label}<ChevronRight size={16} /></span>
        </Link>; })}
      </div>
    </section>

    <section className="home-consult-band">
      <div className="home-consult-inner"><div className="home-consult-icon"><Waves size={24} /></div><div><span className="home-kicker">{copy.consultKicker}</span><h2>{copy.consultTitle}</h2><p>{copy.consultText}</p></div><Link to="/appointment" className="home-button home-button-light">{copy.appointmentCta} <ArrowRight size={17} /></Link></div>
    </section>

    <section className="home-how section-wrap">
      <div className="home-section-heading home-section-heading-centered"><div><div className="home-kicker">{copy.howKicker}</div><h2>{copy.howTitle}</h2></div><p>{copy.howText}</p></div>
      <div className="home-steps">{copy.steps.map(([title, text], index) => <article className="home-step" key={title}><span className="home-step-number">{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>

    <section className="home-account-cta"><div className="home-account-cta-inner"><div><div className="home-kicker">{copy.accountKicker}</div><h2>{copy.accountTitle}</h2><p>{copy.accountText}</p></div><Link to="/account" className="home-button home-button-primary">{copy.accountCta} <ArrowRight size={17} /></Link></div></section>
  </div>
  );
};

export default HomePage;
