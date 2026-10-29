import { getNakshatraAndPada } from './nakshatras';
import { VimshottariDasha, MahadashaPeriod, AntardashaPeriod } from '../../types/astrology.types';

interface DashaLordInfo {
  planet: string;
  years: number;
}

export const DASHA_LORDS: DashaLordInfo[] = [
  { planet: 'Ketu', years: 7 },
  { planet: 'Venus', years: 20 },
  { planet: 'Sun', years: 6 },
  { planet: 'Moon', years: 10 },
  { planet: 'Mars', years: 7 },
  { planet: 'Rahu', years: 18 },
  { planet: 'Jupiter', years: 16 },
  { planet: 'Saturn', years: 19 },
  { planet: 'Mercury', years: 17 }
];

function addDays(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setTime(result.getTime() + days * 86400000);
  return result;
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

/**
 * Calculates the complete 120-year Vimshottari Dasha timeline based on the Moon's sidereal position.
 */
export function calculateVimshottariDasha(
  moonSiderealDegree: number,
  birthDate: Date
): VimshottariDasha {
  const nakInfo = getNakshatraAndPada(moonSiderealDegree);
  const rulingPlanet = nakInfo.nakshatra.ruler;

  // Find index in DASHA_LORDS sequence
  const startIndex = DASHA_LORDS.findIndex(d => d.planet.toLowerCase() === rulingPlanet.toLowerCase());
  const initialLord = DASHA_LORDS[startIndex !== -1 ? startIndex : 0];

  const fractionRemaining = nakInfo.fractionRemaining;
  const yearsRemaining = Number((initialLord.years * fractionRemaining).toFixed(3));

  const now = new Date();
  let currentMahadasha = '';
  let currentAntardasha = '';

  const timeline: MahadashaPeriod[] = [];

  // Start with the balance of the first Mahadasha
  let cursorDate = new Date(birthDate.getTime());
  const firstMahaDays = yearsRemaining * 365.2425;
  const firstMahaEndDate = addDays(cursorDate, firstMahaDays);

  // Generate Antardashas for the first Mahadasha based on full period then sliced
  const generateAntardashas = (
    mahaLord: DashaLordInfo,
    start: Date,
    end: Date,
    isPartialFirst = false
  ): AntardashaPeriod[] => {
    const mahaIndex = DASHA_LORDS.findIndex(d => d.planet === mahaLord.planet);
    const antardashas: AntardashaPeriod[] = [];
    let subCursor = new Date(start.getTime());

    // In Vimshottari, sub-periods start from the Mahadasha lord itself
    for (let i = 0; i < 9; i++) {
      const antarLord = DASHA_LORDS[(mahaIndex + i) % 9];
      // Total duration for this Antar in a full Mahadasha: (M * A * 365.2425) / 120 days
      const antarDays = (mahaLord.years * antarLord.years * 365.2425) / 120;
      const antarEndDate = addDays(subCursor, isPartialFirst ? antarDays * fractionRemaining : antarDays);

      antardashas.push({
        planet: antarLord.planet,
        startDate: formatDate(subCursor),
        endDate: formatDate(antarEndDate),
        durationMonths: Number(((mahaLord.years * antarLord.years) / 10).toFixed(1))
      });

      if (now >= subCursor && now <= antarEndDate) {
        currentMahadasha = mahaLord.planet;
        currentAntardasha = antarLord.planet;
      }

      subCursor = antarEndDate;
    }

    return antardashas;
  };

  // First Mahadasha (partial)
  const firstAntardashas = generateAntardashas(initialLord, cursorDate, firstMahaEndDate, true);
  timeline.push({
    planet: initialLord.planet,
    startDate: formatDate(cursorDate),
    endDate: formatDate(firstMahaEndDate),
    durationYears: yearsRemaining,
    antardashas: firstAntardashas
  });

  if (now >= cursorDate && now <= firstMahaEndDate) {
    timeline[0].isCurrent = true;
  }

  cursorDate = firstMahaEndDate;

  // Next Mahadashas (up to 120 years from birth)
  for (let step = 1; step < 9; step++) {
    const mahaLord = DASHA_LORDS[(startIndex + step) % 9];
    const mahaDays = mahaLord.years * 365.2425;
    const mahaEndDate = addDays(cursorDate, mahaDays);

    const antardashas = generateAntardashas(mahaLord, cursorDate, mahaEndDate, false);
    const isCurrent = now >= cursorDate && now <= mahaEndDate;

    if (isCurrent) {
      currentMahadasha = mahaLord.planet;
    }

    timeline.push({
      planet: mahaLord.planet,
      startDate: formatDate(cursorDate),
      endDate: formatDate(mahaEndDate),
      durationYears: mahaLord.years,
      isCurrent,
      antardashas
    });

    cursorDate = mahaEndDate;
  }

  return {
    birthBalance: {
      rulingPlanet: initialLord.planet,
      yearsRemaining,
      fractionRemaining: Number(fractionRemaining.toFixed(4))
    },
    currentMahadasha: currentMahadasha || timeline[0]?.planet,
    currentAntardasha: currentAntardasha || timeline[0]?.antardashas[0]?.planet,
    timeline
  };
}
