import { ZODIAC_SIGNS } from './nakshatras';
import { DivisionalChart, DivisionalPlacement } from '../../types/astrology.types';

export interface BodyInput {
  name: string;
  symbol: string;
  fullDegree: number;
}

/**
 * Calculates D1 Rashi, D9 Navamsa, and D10 Dashamsa divisional charts
 * according to Maharishi Parashara's Brihat Parashara Hora Shastra (BPHS).
 */
export function calculateDivisionalCharts(
  ascendantFullDegree: number,
  bodies: BodyInput[]
): {
  d1: DivisionalChart;
  d9: DivisionalChart;
  d10: DivisionalChart;
} {
  // --- 1. D1 Rashi Chart ---
  const d1LagnaSignNum = Math.floor(ascendantFullDegree / 30) + 1;
  const d1LagnaSign = ZODIAC_SIGNS[d1LagnaSignNum - 1];

  const d1Placements: DivisionalPlacement[] = bodies.map(b => {
    const signNum = Math.floor(b.fullDegree / 30) + 1;
    const houseNum = ((signNum - d1LagnaSignNum + 12) % 12) + 1;
    return {
      body: b.name,
      symbol: b.symbol,
      signNumber: signNum,
      signName: ZODIAC_SIGNS[signNum - 1].name,
      houseNumber: houseNum
    };
  });

  const d1: DivisionalChart = {
    code: 'D1',
    name: 'Rashi',
    title: 'D1 Rashi Chart (Birth Chart)',
    description: 'The foundational natal chart representing physical reality, core personality, and life path.',
    lagnaSignNumber: d1LagnaSignNum,
    lagnaSignName: d1LagnaSign.name,
    placements: d1Placements
  };

  // --- 2. D9 Navamsa Chart ---
  // Mathematical identity: Navamsa sign = (total pada from 0° Aries % 12) + 1
  const padaSpan = 360 / 108; // 3° 20' = 3.333333333°
  const d9LagnaPada = Math.floor(ascendantFullDegree / padaSpan);
  const d9LagnaSignNum = (d9LagnaPada % 12) + 1;
  const d9LagnaSign = ZODIAC_SIGNS[d9LagnaSignNum - 1];

  const d9Placements: DivisionalPlacement[] = bodies.map(b => {
    const pada = Math.floor(b.fullDegree / padaSpan);
    const signNum = (pada % 12) + 1;
    const houseNum = ((signNum - d9LagnaSignNum + 12) % 12) + 1;
    return {
      body: b.name,
      symbol: b.symbol,
      signNumber: signNum,
      signName: ZODIAC_SIGNS[signNum - 1].name,
      houseNumber: houseNum
    };
  });

  const d9: DivisionalChart = {
    code: 'D9',
    name: 'Navamsa',
    title: 'D9 Navamsa Chart (Soul & Dharma)',
    description: 'The soul chart revealing inner potential, spiritual destiny, marriage compatibility, and fortunes in the second half of life.',
    lagnaSignNumber: d9LagnaSignNum,
    lagnaSignName: d9LagnaSign.name,
    placements: d9Placements
  };

  // --- 3. D10 Dashamsa Chart ---
  // Each sign of 30° is divided into 10 divisions of 3° each.
  // Odd signs: starts from the sign itself.
  // Even signs: starts from the 9th sign from it.
  const calculateD10Sign = (deg: number): number => {
    const signNum = Math.floor(deg / 30) + 1;
    const normDeg = deg - (signNum - 1) * 30;
    const part = Math.min(9, Math.floor(normDeg / 3.0));
    const isOdd = signNum % 2 !== 0;

    if (isOdd) {
      return ((signNum - 1 + part) % 12) + 1;
    } else {
      // 9th from sign: (signNum - 1 + 8 + part) % 12 + 1
      return ((signNum - 1 + 8 + part) % 12) + 1;
    }
  };

  const d10LagnaSignNum = calculateD10Sign(ascendantFullDegree);
  const d10LagnaSign = ZODIAC_SIGNS[d10LagnaSignNum - 1];

  const d10Placements: DivisionalPlacement[] = bodies.map(b => {
    const signNum = calculateD10Sign(b.fullDegree);
    const houseNum = ((signNum - d10LagnaSignNum + 12) % 12) + 1;
    return {
      body: b.name,
      symbol: b.symbol,
      signNumber: signNum,
      signName: ZODIAC_SIGNS[signNum - 1].name,
      houseNumber: houseNum
    };
  });

  const d10: DivisionalChart = {
    code: 'D10',
    name: 'Dashamsa',
    title: 'D10 Dashamsa Chart (Career & Status)',
    description: 'The professional chart governing vocation, worldly achievements, authority, reputation, and public recognition.',
    lagnaSignNumber: d10LagnaSignNum,
    lagnaSignName: d10LagnaSign.name,
    placements: d10Placements
  };

  return { d1, d9, d10 };
}
