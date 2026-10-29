import { calculateAscendant } from './ascendant';
import { calculatePlanetaryPositions } from './ephemeris';
import { calculateDivisionalCharts, BodyInput } from './vargas';
import { calculateVimshottariDasha } from './dasha';
import { calculateYogas } from './yogas';
import { generateInterpretations } from './interpretations';
import { getLahiriAyanamsha } from './ayanamsha';
import { getNakshatraAndPada, ZODIAC_SIGNS } from './nakshatras';
import {
  BirthDetailsInput,
  NormalizedKundaliData,
  HouseData,
  GrahaDrishti
} from '../../types/astrology.types';

export const BHAVA_NAMES = [
  'Tanu Bhava (Self & Physique)',
  'Dhana Bhava (Wealth & Speech)',
  'Bhratri Bhava (Courage & Siblings)',
  'Sukha Bhava (Mother & Comforts)',
  'Putra Bhava (Intellect & Children)',
  'Ari Bhava (Debts, Enemies & Health)',
  'Yuvati Bhava (Spouse & Partnerships)',
  'Randhra Bhava (Longevity & Transformation)',
  'Dharma Bhava (Fortune, Duty & Higher Truth)',
  'Karma Bhava (Career & Authority)',
  'Labha Bhava (Gains & Aspirations)',
  'Vyaya Bhava (Expenditure & Liberation)'
];

export const BHAVA_SIGNIFICATIONS = [
  ['Physical appearance', 'vitality', 'head', 'general disposition'],
  ['Financial assets', 'speech', 'family heritage', 'right eye'],
  ['Courage', 'younger siblings', 'initiative', 'arms & shoulders'],
  ['Mother', 'conveyances', 'home sanctuary', 'inner peace'],
  ['Creative intelligence', 'children', 'purva punya (past merit)', 'romance'],
  ['Overcoming obstacles', 'daily work', 'health discipline', 'service'],
  ['Marriage', 'business partnerships', 'foreign residence', 'contracts'],
  ['Spiritual transformation', 'occult wisdom', 'unearned wealth', 'longevity'],
  ['Dharma', 'father / guru guidance', 'higher knowledge', 'long journeys'],
  ['Profession', 'status & fame', 'leadership impact', 'public karma'],
  ['Incoming profits', 'older siblings', 'fulfillment of dreams', 'networks'],
  ['Spiritual liberation (Moksha)', 'meditation retreats', 'expenditure', 'foreign lands']
];

/**
 * High-Precision Vedic Astrology Engine
 * Computes degree-accurate birth chart with Lahiri Ayanamsha, D1, D9, D10,
 * Vimshottari Dasha, and traditional Parashara astrological interpretations.
 */
export function calculateFullVedicKundali(input: BirthDetailsInput, chartId: string): NormalizedKundaliData {
  const isUnknownTime = Boolean(input.birthTimeUnknown);
  const timeStr = isUnknownTime ? '12:00' : (input.birthTime || '12:00');

  // Parse YYYY-MM-DD and HH:mm
  const [yearStr, monthStr, dayStr] = input.birthDate.split('-');
  const [hourStr, minStr] = timeStr.split(':');

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  const hours = parseInt(hourStr, 10);
  const minutes = parseInt(minStr, 10);

  // Convert local time to UTC using timeZone offset (decimal hours, e.g. 5.5)
  // UTC Date = Local Date - (timeZone hours * 3600000 ms)
  const localDateObj = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  const utcMs = localDateObj.getTime() - input.timeZone * 3600000;
  const utcDate = new Date(utcMs);

  const ayanamshaDeg = getLahiriAyanamsha(utcDate);

  // 1. Calculate Ascendant (Lagna)
  const ascendant = calculateAscendant(utcDate, input.latitude, input.longitude);

  // 2. Calculate Planets
  const planets = calculatePlanetaryPositions(utcDate, ascendant.signNumber);

  // 3. Assemble Houses (Whole-sign house system)
  const houses: HouseData[] = [];
  for (let h = 1; h <= 12; h++) {
    const signNum = ((ascendant.signNumber - 1 + (h - 1)) % 12) + 1;
    const signInfo = ZODIAC_SIGNS[signNum - 1];

    const occupyingPlanets = Object.values(planets)
      .filter(p => p.house === h)
      .map(p => p.name);

    houses.push({
      houseNumber: h,
      signNumber: signNum,
      signName: signInfo.name,
      signLord: signInfo.lord,
      bhavaName: BHAVA_NAMES[h - 1],
      planets: occupyingPlanets,
      significations: BHAVA_SIGNIFICATIONS[h - 1]
    });
  }

  // 4. Divisional Charts (D1, D9, D10)
  const bodies: BodyInput[] = Object.values(planets).map(p => ({
    name: p.name,
    symbol: p.symbol,
    fullDegree: p.fullDegree
  }));

  const divisionalCharts = calculateDivisionalCharts(ascendant.fullDegree, bodies);

  // 5. Janma Nakshatra and Moon Sign
  const moon = planets['Moon'];
  const moonNakInfo = getNakshatraAndPada(moon ? moon.fullDegree : 0);
  const sun = planets['Sun'];

  // 6. Vimshottari Dasha
  const dashaPeriods = calculateVimshottariDasha(
    moon ? moon.fullDegree : 0,
    new Date(year, month - 1, day)
  );

  // 7. Graha Drishti (Aspects)
  const aspects: GrahaDrishti[] = [];
  for (const p of Object.values(planets)) {
    const aspectsHouses: number[] = [];

    // All planets aspect the 7th house from themselves
    aspectsHouses.push(((p.house - 1 + 6) % 12) + 1);

    // Special aspects:
    if (p.name === 'Mars') {
      // 4th and 8th
      aspectsHouses.push(((p.house - 1 + 3) % 12) + 1);
      aspectsHouses.push(((p.house - 1 + 7) % 12) + 1);
    } else if (p.name === 'Jupiter') {
      // 5th and 9th
      aspectsHouses.push(((p.house - 1 + 4) % 12) + 1);
      aspectsHouses.push(((p.house - 1 + 8) % 12) + 1);
    } else if (p.name === 'Saturn') {
      // 3rd and 10th
      aspectsHouses.push(((p.house - 1 + 2) % 12) + 1);
      aspectsHouses.push(((p.house - 1 + 9) % 12) + 1);
    }

    const aspectedPlanets = Object.values(planets)
      .filter(other => other.name !== p.name && aspectsHouses.includes(other.house))
      .map(other => other.name);

    aspects.push({
      planet: p.name,
      aspectsHouses,
      aspectsPlanets: aspectedPlanets
    });
  }

  // 8. Vedic Yogas
  const yogas = calculateYogas(planets, ascendant.signNumber);

  // 9. Interpretations
  const interpretations = generateInterpretations(
    ascendant.sign,
    moon ? moon.zodiacSign : 'Taurus',
    sun ? sun.zodiacSign : 'Aries',
    moonNakInfo.nakshatra.name,
    moonNakInfo.pada
  );

  return {
    chartId,
    name: input.name,
    birthDate: input.birthDate,
    birthTime: input.birthTime,
    birthTimeUnknown: isUnknownTime,
    birthPlace: input.birthPlace,
    latitude: input.latitude,
    longitude: input.longitude,
    timeZone: input.timeZone,
    gender: input.gender,
    calculationSystem: 'Vedic Sidereal (Nirayana)',
    ayanamsha: 'Chitrapaksha / Lahiri',
    ayanamshaDegree: Number(ayanamshaDeg.toFixed(4)),
    ascendant,
    moonSign: {
      sign: moon ? moon.zodiacSign : 'Unknown',
      signNumber: moon ? moon.signNumber : 1,
      nakshatra: moonNakInfo.nakshatra.name,
      nakshatraPada: moonNakInfo.pada,
      nakshatraLord: moonNakInfo.nakshatra.ruler
    },
    sunSign: {
      sign: sun ? sun.zodiacSign : 'Unknown',
      signNumber: sun ? sun.signNumber : 1
    },
    janmaNakshatra: {
      name: moonNakInfo.nakshatra.name,
      pada: moonNakInfo.pada,
      lord: moonNakInfo.nakshatra.ruler,
      deity: moonNakInfo.nakshatra.deity,
      symbol: moonNakInfo.nakshatra.symbol,
      element: moonNakInfo.nakshatra.element,
      gan: moonNakInfo.nakshatra.gan,
      nadi: moonNakInfo.nakshatra.nadi,
      varna: moonNakInfo.nakshatra.varna,
      yoni: moonNakInfo.nakshatra.yoni
    },
    planetaryPositions: planets,
    houses,
    divisionalCharts,
    dashaPeriods,
    aspects,
    yogas,
    interpretations,
    calculationProvider: 'astronomy_engine_vedic',
    createdAt: new Date().toISOString()
  };
}
