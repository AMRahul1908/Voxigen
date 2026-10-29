import * as Astronomy from 'astronomy-engine';
import { getLahiriAyanamsha, formatDegrees, getJulianDate } from './ayanamsha';
import { getNakshatraAndPada, getZodiacSign, ZODIAC_SIGNS } from './nakshatras';
import { PlanetPosition } from '../../types/astrology.types';

interface PlanetConfig {
  name: string;
  vedicName: string;
  symbol: string;
  astroBody?: Astronomy.Body;
  combustOrb?: number; // degrees within Sun to be considered combust
  exaltationSign: number; // 1-12
  exaltationDegree: number;
  debilitationSign: number; // 1-12
  ownSigns: number[];
}

const PLANET_CONFIGS: PlanetConfig[] = [
  {
    name: 'Sun',
    vedicName: 'Surya',
    symbol: '☉',
    astroBody: Astronomy.Body.Sun,
    exaltationSign: 1, // Aries
    exaltationDegree: 10,
    debilitationSign: 7, // Libra
    ownSigns: [5] // Leo
  },
  {
    name: 'Moon',
    vedicName: 'Chandra',
    symbol: '☽',
    astroBody: Astronomy.Body.Moon,
    combustOrb: 12,
    exaltationSign: 2, // Taurus
    exaltationDegree: 3,
    debilitationSign: 8, // Scorpio
    ownSigns: [4] // Cancer
  },
  {
    name: 'Mars',
    vedicName: 'Mangala',
    symbol: '♂',
    astroBody: Astronomy.Body.Mars,
    combustOrb: 17,
    exaltationSign: 10, // Capricorn
    exaltationDegree: 28,
    debilitationSign: 4, // Cancer
    ownSigns: [1, 8] // Aries, Scorpio
  },
  {
    name: 'Mercury',
    vedicName: 'Budha',
    symbol: '☿',
    astroBody: Astronomy.Body.Mercury,
    combustOrb: 14,
    exaltationSign: 6, // Virgo
    exaltationDegree: 15,
    debilitationSign: 12, // Pisces
    ownSigns: [3, 6] // Gemini, Virgo
  },
  {
    name: 'Jupiter',
    vedicName: 'Guru',
    symbol: '♃',
    astroBody: Astronomy.Body.Jupiter,
    combustOrb: 11,
    exaltationSign: 4, // Cancer
    exaltationDegree: 5,
    debilitationSign: 10, // Capricorn
    ownSigns: [9, 12] // Sagittarius, Pisces
  },
  {
    name: 'Venus',
    vedicName: 'Shukra',
    symbol: '♀',
    astroBody: Astronomy.Body.Venus,
    combustOrb: 10,
    exaltationSign: 12, // Pisces
    exaltationDegree: 27,
    debilitationSign: 6, // Virgo
    ownSigns: [2, 7] // Taurus, Libra
  },
  {
    name: 'Saturn',
    vedicName: 'Shani',
    symbol: '♄',
    astroBody: Astronomy.Body.Saturn,
    combustOrb: 15,
    exaltationSign: 7, // Libra
    exaltationDegree: 20,
    debilitationSign: 1, // Aries
    ownSigns: [10, 11] // Capricorn, Aquarius
  },
  {
    name: 'Uranus',
    vedicName: 'Aruna',
    symbol: '♅',
    astroBody: Astronomy.Body.Uranus,
    exaltationSign: 8,
    exaltationDegree: 0,
    debilitationSign: 2,
    ownSigns: [11]
  },
  {
    name: 'Neptune',
    vedicName: 'Varuna',
    symbol: '♆',
    astroBody: Astronomy.Body.Neptune,
    exaltationSign: 9,
    exaltationDegree: 0,
    debilitationSign: 3,
    ownSigns: [12]
  },
  {
    name: 'Pluto',
    vedicName: 'Yama',
    symbol: '♇',
    astroBody: Astronomy.Body.Pluto,
    exaltationSign: 1,
    exaltationDegree: 0,
    debilitationSign: 7,
    ownSigns: [8]
  }
];

/**
 * Calculates accurate Mean Lunar Node (Rahu) tropical longitude using IAU model
 * Mean Lunar Node longitude Omega = 125.04452 - 1934.136261 * T + 0.0020708 * T^2
 */
function getMeanRahuTropicalLongitude(utcDate: Date): number {
  const jd = getJulianDate(utcDate);
  const t = (jd - 2451545.0) / 36525.0;
  let omega = 125.04452 - 1934.136261 * t + 0.0020708 * t * t;
  omega = ((omega % 360) + 360) % 360;
  return omega;
}

/**
 * Calculates planetary positions using astronomy-engine and Lahiri Ayanamsha
 */
export function calculatePlanetaryPositions(
  utcDate: Date,
  lagnaSignNumber: number
): Record<string, PlanetPosition> {
  const astroTime = Astronomy.MakeTime(utcDate);
  const ayanamsha = getLahiriAyanamsha(utcDate);

  // Time delta to check retrograde motion (1 hour later)
  const dtHours = 1;
  const timeLater = Astronomy.MakeTime(new Date(utcDate.getTime() + dtHours * 3600000));

  const result: Record<string, PlanetPosition> = {};
  let sunSiderealLon = 0;

  // 1. Calculate physical planets
  for (const cfg of PLANET_CONFIGS) {
    if (!cfg.astroBody) continue;

    // Tropical ecliptic position
    const vec = Astronomy.GeoVector(cfg.astroBody, astroTime, true);
    const ecl = Astronomy.Ecliptic(vec);
    let tropLon = ecl.elon;

    // Check retrograde status by checking longitude 1 hour later
    const vecLater = Astronomy.GeoVector(cfg.astroBody, timeLater, true);
    const eclLater = Astronomy.Ecliptic(vecLater);
    let diff = eclLater.elon - tropLon;
    // Handle 0/360 wrap-around
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    const isRetrograde = diff < 0;

    // Convert to sidereal
    let siderealLon = ((tropLon - ayanamsha) % 360 + 360) % 360;

    if (cfg.name === 'Sun') {
      sunSiderealLon = siderealLon;
    }

    const { sign, normDegree } = getZodiacSign(siderealLon);
    const nakInfo = getNakshatraAndPada(siderealLon);

    // Calculate house (Whole-sign house from Lagna: (sign - lagna + 12) % 12 + 1)
    const house = ((sign.number - lagnaSignNumber + 12) % 12) + 1;

    // Determine dignity
    let dignity: PlanetPosition['dignity'] = 'Neutral';
    if (sign.number === cfg.exaltationSign) {
      dignity = 'Exalted';
    } else if (sign.number === cfg.debilitationSign) {
      dignity = 'Debilitated';
    } else if (cfg.ownSigns.includes(sign.number)) {
      dignity = 'Own Sign';
    }

    result[cfg.name] = {
      name: cfg.name,
      vedicName: cfg.vedicName,
      symbol: cfg.symbol,
      fullDegree: Number(siderealLon.toFixed(4)),
      normDegree: Number(normDegree.toFixed(4)),
      degreeFormatted: formatDegrees(normDegree),
      zodiacSign: sign.name,
      signNumber: sign.number,
      signLord: sign.lord,
      house,
      nakshatra: nakInfo.nakshatra.name,
      nakshatraPada: nakInfo.pada,
      nakshatraLord: nakInfo.nakshatra.ruler,
      isRetrograde,
      dignity,
      speed: Number((diff / dtHours).toFixed(4))
    };
  }

  // 2. Check combustion relative to Sun
  for (const cfg of PLANET_CONFIGS) {
    if (cfg.name === 'Sun' || !cfg.combustOrb) continue;
    const p = result[cfg.name];
    if (!p) continue;

    let sep = Math.abs(p.fullDegree - sunSiderealLon);
    if (sep > 180) sep = 360 - sep;
    p.isCombust = sep <= cfg.combustOrb;
  }

  // 3. Rahu (North Node) and Ketu (South Node)
  const rahuTropLon = getMeanRahuTropicalLongitude(utcDate);
  const rahuSiderealLon = ((rahuTropLon - ayanamsha) % 360 + 360) % 360;
  const ketuSiderealLon = ((rahuSiderealLon + 180) % 360 + 360) % 360;

  const rahuSign = getZodiacSign(rahuSiderealLon);
  const ketuSign = getZodiacSign(ketuSiderealLon);

  const rahuNak = getNakshatraAndPada(rahuSiderealLon);
  const ketuNak = getNakshatraAndPada(ketuSiderealLon);

  const rahuHouse = ((rahuSign.sign.number - lagnaSignNumber + 12) % 12) + 1;
  const ketuHouse = ((ketuSign.sign.number - lagnaSignNumber + 12) % 12) + 1;

  result['Rahu'] = {
    name: 'Rahu',
    vedicName: 'Rahu',
    symbol: '☊',
    fullDegree: Number(rahuSiderealLon.toFixed(4)),
    normDegree: Number(rahuSign.normDegree.toFixed(4)),
    degreeFormatted: formatDegrees(rahuSign.normDegree),
    zodiacSign: rahuSign.sign.name,
    signNumber: rahuSign.sign.number,
    signLord: rahuSign.sign.lord,
    house: rahuHouse,
    nakshatra: rahuNak.nakshatra.name,
    nakshatraPada: rahuNak.pada,
    nakshatraLord: rahuNak.nakshatra.ruler,
    isRetrograde: true, // Lunar nodes are always in retrograde motion in Vedic astrology
    dignity: [2, 3].includes(rahuSign.sign.number) ? 'Exalted' : [8, 9].includes(rahuSign.sign.number) ? 'Debilitated' : 'Neutral'
  };

  result['Ketu'] = {
    name: 'Ketu',
    vedicName: 'Ketu',
    symbol: '☋',
    fullDegree: Number(ketuSiderealLon.toFixed(4)),
    normDegree: Number(ketuSign.normDegree.toFixed(4)),
    degreeFormatted: formatDegrees(ketuSign.normDegree),
    zodiacSign: ketuSign.sign.name,
    signNumber: ketuSign.sign.number,
    signLord: ketuSign.sign.lord,
    house: ketuHouse,
    nakshatra: ketuNak.nakshatra.name,
    nakshatraPada: ketuNak.pada,
    nakshatraLord: ketuNak.nakshatra.ruler,
    isRetrograde: true,
    dignity: [8, 9].includes(ketuSign.sign.number) ? 'Exalted' : [2, 3].includes(ketuSign.sign.number) ? 'Debilitated' : 'Neutral'
  };

  return result;
}
