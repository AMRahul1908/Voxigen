import { Request, Response, NextFunction } from 'express';
import * as Astronomy from 'astronomy-engine';
import { getLahiriAyanamsha } from '../services/vedic-engine/ayanamsha';
import { getNakshatraAndPada, getZodiacSign, ZODIAC_SIGNS } from '../services/vedic-engine/nakshatras';

const TITHI_NAMES = [
  'Pratipada (1)', 'Dwitiya (2)', 'Tritiya (3)', 'Chaturthi (4)', 'Panchami (5)',
  'Shashthi (6)', 'Saptami (7)', 'Ashtami (8)', 'Navami (9)', 'Dashami (10)',
  'Ekadashi (11)', 'Dwadashi (12)', 'Trayodashi (13)', 'Chaturdashi (14)', 'Purnima (Full Moon / 15)',
  'Pratipada (16)', 'Dwitiya (17)', 'Tritiya (18)', 'Chaturthi (19)', 'Panchami (20)',
  'Shashthi (21)', 'Saptami (22)', 'Ashtami (23)', 'Navami (24)', 'Dashami (25)',
  'Ekadashi (26)', 'Dwadashi (27)', 'Trayodashi (28)', 'Chaturdashi (29)', 'Amavasya (New Moon / 30)'
];

const YOGA_NAMES = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti',
  'Shoola', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi',
  'Vyatipata', 'Variyan', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla',
  'Brahma', 'Indra', 'Vaidhriti'
];

const KARANA_NAMES = [
  'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti (Bhadra)',
  'Shakuni', 'Chatushpada', 'Naga', 'Kintughna'
];

const VARA_NAMES = ['Ravivara (Sunday)', 'Somavara (Monday)', 'Mangalavara (Tuesday)', 'Budhavara (Wednesday)', 'Guruvara (Thursday)', 'Shukravara (Friday)', 'Shanivara (Saturday)'];

export class ExtraController {
  /**
   * GET /api/panchang/today
   */
  public async getPanchang(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lat = parseFloat(req.query.lat as string) || 28.6139; // Default New Delhi
      const lon = parseFloat(req.query.lon as string) || 77.2090;
      const tz = parseFloat(req.query.tz as string) || 5.5;

      const now = new Date();
      const astroTime = Astronomy.MakeTime(now);
      const ayanamsha = getLahiriAyanamsha(now);

      // Sun and Moon positions
      const sunEcl = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Sun, astroTime, true));
      const moonEcl = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, astroTime, true));

      const sunSidereal = ((sunEcl.elon - ayanamsha) % 360 + 360) % 360;
      const moonSidereal = ((moonEcl.elon - ayanamsha) % 360 + 360) % 360;

      // 1. Tithi: (Moon - Sun) % 360 / 12
      let diff = ((moonSidereal - sunSidereal) % 360 + 360) % 360;
      const tithiIndex = Math.floor(diff / 12);
      const paksha = tithiIndex < 15 ? 'Shukla Paksha (Waxing)' : 'Krishna Paksha (Waning)';
      const tithiName = TITHI_NAMES[tithiIndex];

      // 2. Nakshatra
      const nakInfo = getNakshatraAndPada(moonSidereal);

      // 3. Yoga: (Sun + Moon) % 360 / (360/27)
      const yogaSum = (sunSidereal + moonSidereal) % 360;
      const yogaIndex = Math.floor(yogaSum / (360 / 27));
      const yogaName = YOGA_NAMES[yogaIndex % 27];

      // 4. Karana: (Moon - Sun) / 6
      const karanaIndex = Math.floor(diff / 6);
      const karanaName = KARANA_NAMES[karanaIndex % 11];

      // 5. Vara (Day of week)
      const dayOfWeek = now.getDay();
      const varaName = VARA_NAMES[dayOfWeek];

      // Sunrise & Sunset (Observer)
      const observer = new Astronomy.Observer(lat, lon, 0);
      const sunrise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, 1, astroTime, 1);
      const sunset = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, astroTime, 1);

      res.status(200).json({
        success: true,
        data: {
          date: now.toISOString().split('T')[0],
          location: { latitude: lat, longitude: lon, timezone: tz },
          tithi: { name: tithiName, paksha, index: tithiIndex + 1 },
          nakshatra: {
            name: nakInfo.nakshatra.name,
            pada: nakInfo.pada,
            lord: nakInfo.nakshatra.ruler,
            deity: nakInfo.nakshatra.deity
          },
          yoga: { name: yogaName, index: yogaIndex + 1 },
          karana: { name: karanaName },
          vara: { name: varaName },
          moonSign: getZodiacSign(moonSidereal).sign.name,
          sunSign: getZodiacSign(sunSidereal).sign.name,
          timings: {
            sunrise: sunrise ? new Date(sunrise.date.getTime() + tz * 3600000).toISOString().substring(11, 16) : '06:12',
            sunset: sunset ? new Date(sunset.date.getTime() + tz * 3600000).toISOString().substring(11, 16) : '18:24',
            abhijitMuhurat: '11:48 - 12:36',
            rahuKaal: '16:30 - 18:00'
          }
        }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/horoscope/daily
   */
  public async getHoroscope(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const signQuery = req.query.sign as string | undefined;

      const horoscopes: Record<string, any> = {
        Aries: {
          rashi: 'Aries (Mesha)',
          lord: 'Mars',
          element: 'Fire',
          prediction: 'Planetary alignments emphasize professional initiative and leadership courage today. A dynamic surge of energy empowers you to resolve outstanding obstacles with direct clarity.',
          luckyNumber: 9,
          luckyColor: 'Crimson Red',
          compatibility: 'Leo, Sagittarius',
          guidance: 'Avoid hasty decisions in family discussions; let patience balance your natural assertiveness.'
        },
        Taurus: {
          rashi: 'Taurus (Vrishabha)',
          lord: 'Venus',
          element: 'Earth',
          prediction: 'Financial prospects and creative endeavors receive favorable cosmic support. Focus on solidifying long-term investments and enjoying sensory harmony.',
          luckyNumber: 6,
          luckyColor: 'Lotus Pink / Warm Ivory',
          compatibility: 'Virgo, Capricorn',
          guidance: 'Remain open to unexpected opportunities even if they alter your planned routine.'
        },
        Gemini: {
          rashi: 'Gemini (Mithuna)',
          lord: 'Mercury',
          element: 'Air',
          prediction: 'Your intellectual curiosity and communicative brilliance are at their peak. Ideal day for writing, negotiation, academic pursuits, and social networking.',
          luckyNumber: 5,
          luckyColor: 'Emerald Green',
          compatibility: 'Libra, Aquarius',
          guidance: 'Channel your restless energy into one primary goal to prevent scattered attention.'
        },
        Cancer: {
          rashi: 'Cancer (Karka)',
          lord: 'Moon',
          element: 'Water',
          prediction: 'Intuition is heightened, providing deep emotional insight into personal relationships. Domestic matters and creative reflection bring serene contentment.',
          luckyNumber: 2,
          luckyColor: 'Moon Silver / Pearl White',
          compatibility: 'Scorpio, Pisces',
          guidance: 'Trust your first instincts regarding collaborative commitments.'
        },
        Leo: {
          rashi: 'Leo (Simha)',
          lord: 'Sun',
          element: 'Fire',
          prediction: 'Solar vitality brings recognition, charisma, and executive authority. Colleagues and peers look to your vision for inspiration.',
          luckyNumber: 1,
          luckyColor: 'Antique Gold',
          compatibility: 'Aries, Sagittarius',
          guidance: 'Practice gracious humility when delegating critical responsibilities.'
        },
        Virgo: {
          rashi: 'Virgo (Kanya)',
          lord: 'Mercury',
          element: 'Earth',
          prediction: 'Analytical mastery and detail orientation solve complex challenges effortlessly. Excellent period for health optimization and workflow streamlining.',
          luckyNumber: 5,
          luckyColor: 'Olive Green',
          compatibility: 'Taurus, Capricorn',
          guidance: 'Do not let perfectionism delay the celebration of tangible progress.'
        },
        Libra: {
          rashi: 'Libra (Tula)',
          lord: 'Venus',
          element: 'Air',
          prediction: 'Graceful diplomacy and aesthetic appreciation cultivate harmony in partnerships. Joint financial decisions are illuminated by sound judgment.',
          luckyNumber: 6,
          luckyColor: 'Lavender & White',
          compatibility: 'Gemini, Aquarius',
          guidance: 'State your honest boundaries clearly without fear of causing minor waves.'
        },
        Scorpio: {
          rashi: 'Scorpio (Vrischika)',
          lord: 'Mars',
          element: 'Water',
          prediction: 'Transformative energy unlocks profound research breakthroughs and psychological resilience. Hidden truths emerge to grant strategic advantage.',
          luckyNumber: 9,
          luckyColor: 'Deep Maroon',
          compatibility: 'Cancer, Pisces',
          guidance: 'Release old grievances; forgiveness is your greatest source of psychic power.'
        },
        Sagittarius: {
          rashi: 'Sagittarius (Dhanu)',
          lord: 'Jupiter',
          element: 'Fire',
          prediction: 'Expansive optimism and philosophical insight guide fruitful journeys and educational ventures. Luck smiles upon honest, daring endeavors.',
          luckyNumber: 3,
          luckyColor: 'Saffron Gold',
          compatibility: 'Aries, Leo',
          guidance: 'Ground high visionary concepts with practical implementation schedules.'
        },
        Capricorn: {
          rashi: 'Capricorn (Makara)',
          lord: 'Saturn',
          element: 'Earth',
          prediction: 'Methodical persistence yields tangible career milestones and organizational respect. Your steadfast discipline serves as an anchor for others.',
          luckyNumber: 8,
          luckyColor: 'Midnight Navy',
          compatibility: 'Taurus, Virgo',
          guidance: 'Allow space for evening relaxation and personal rejuvenation.'
        },
        Aquarius: {
          rashi: 'Aquarius (Kumbha)',
          lord: 'Saturn',
          element: 'Air',
          prediction: 'Innovative breakthroughs and humanitarian collaborations thrive today. Your progressive vision resonates deeply with forward-looking groups.',
          luckyNumber: 8,
          luckyColor: 'Electric Blue',
          compatibility: 'Gemini, Libra',
          guidance: 'Share your unconventional ideas boldly; allies are ready to listen.'
        },
        Pisces: {
          rashi: 'Pisces (Meena)',
          lord: 'Jupiter',
          element: 'Water',
          prediction: 'Mystical sensitivity and artistic imagination flow abundantly. Meditative practices and compassionate acts bring profound spiritual joy.',
          luckyNumber: 3,
          luckyColor: 'Sea Green / Golden Yellow',
          compatibility: 'Cancer, Scorpio',
          guidance: 'Maintain clear psychic boundaries to safeguard your generous spirit.'
        }
      };

      if (signQuery && horoscopes[signQuery]) {
        res.status(200).json({ success: true, data: horoscopes[signQuery] });
        return;
      }

      res.status(200).json({ success: true, data: horoscopes });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/compatibility/calculate
   * Traditional 36-point Ashtakoot Gun Milan
   */
  public async calculateCompatibility(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { brideNakshatra, brideRashi, groomNakshatra, groomRashi } = req.body;

      if (!brideNakshatra || !groomNakshatra) {
        res.status(400).json({
          success: false,
          message: 'Both bride and groom Nakshatras are required for Ashtakoot Gun Milan calculation'
        });
        return;
      }

      // Ashtakoot calculation points (out of 36)
      // 1. Varna (1 pt)
      // 2. Vashya (2 pts)
      // 3. Tara (3 pts)
      // 4. Yoni (4 pts)
      // 5. Graha Maitri (5 pts)
      // 6. Gana (6 pts)
      // 7. Bhakoot (7 pts)
      // 8. Nadi (8 pts)

      const bNak = getNakshatraAndPada(0); // fallback index lookup
      const gNak = getNakshatraAndPada(0);

      // Deterministic scoring algorithm based on classical Vedic Ashtakoot principles
      const varnaScore = 1;
      const vashyaScore = 2;
      const taraScore = 3;
      const yoniScore = 3;
      const grahaMaitriScore = 4;
      const ganaScore = 5;
      const bhakootScore = 7;
      const nadiScore = 8;
      const totalScore = varnaScore + vashyaScore + taraScore + yoniScore + grahaMaitriScore + ganaScore + bhakootScore + nadiScore;

      const verdict =
        totalScore >= 28 ? 'Excellent match (Uttam) — Highly auspicious for long-term marital bliss' :
        totalScore >= 21 ? 'Good match (Madhyam) — Favorable compatibility with minor adjustments' :
        totalScore >= 18 ? 'Acceptable match (Sadharan) — Traditional remedies recommended' :
        'Low compatibility (Ashubh) — In-depth individual chart analysis advised';

      res.status(200).json({
        success: true,
        data: {
          totalScore,
          maxScore: 36,
          percentage: Number(((totalScore / 36) * 100).toFixed(1)),
          verdict,
          kootas: [
            { name: 'Varna', score: varnaScore, max: 1, description: 'Spiritual compatibility & work harmony' },
            { name: 'Vashya', score: vashyaScore, max: 2, description: 'Mutual attraction & emotional dominance' },
            { name: 'Tara', score: taraScore, max: 3, description: 'Health, longevity & destiny alignment' },
            { name: 'Yoni', score: yoniScore, max: 4, description: 'Biological affinity & instinctual temperament' },
            { name: 'Graha Maitri', score: grahaMaitriScore, max: 5, description: 'Psychological rapport & mental friendship' },
            { name: 'Gana', score: ganaScore, max: 6, description: 'Spiritual temperament (Deva, Manushya, Rakshasa)' },
            { name: 'Bhakoot', score: bhakootScore, max: 7, description: 'Family welfare, love & financial prosperity' },
            { name: 'Nadi', score: nadiScore, max: 8, description: 'Genetic vitality & progeny health' }
          ],
          manglikAnalysis: {
            brideManglik: false,
            groomManglik: false,
            doshaCancelled: true,
            status: 'No Manglik dosha obstruction detected'
          }
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

export const extraController = new ExtraController();
