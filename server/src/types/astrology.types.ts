export interface BirthDetailsInput {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  birthTimeUnknown?: boolean;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timeZone: number; // UTC offset in decimal hours (e.g., 5.5 for IST)
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
}

export interface PlanetPosition {
  name: string;
  vedicName: string;
  symbol: string;
  fullDegree: number; // 0 - 359.999
  normDegree: number; // 0 - 29.999 in sign
  degreeFormatted: string; // e.g., "14° 22' 45\""
  zodiacSign: string; // Aries, Taurus...
  signNumber: number; // 1 to 12
  signLord: string;
  house: number; // 1 to 12 (whole sign system)
  nakshatra: string;
  nakshatraPada: number; // 1 to 4
  nakshatraLord: string;
  isRetrograde: boolean;
  isCombust?: boolean;
  dignity?: 'Exalted' | 'Debilitated' | 'Moolatrikona' | 'Own Sign' | 'Friendly' | 'Neutral' | 'Enemy' | 'Great Enemy';
  speed?: number;
}

export interface AscendantPosition {
  sign: string;
  signNumber: number;
  signLord: string;
  fullDegree: number;
  normDegree: number;
  degreeFormatted: string;
  nakshatra: string;
  nakshatraPada: number;
  nakshatraLord: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  modality: 'Chara (Movable)' | 'Sthira (Fixed)' | 'Dvisvabhava (Dual)';
}

export interface HouseData {
  houseNumber: number; // 1 to 12
  signNumber: number;
  signName: string;
  signLord: string;
  bhavaName: string;
  planets: string[]; // names of planets residing in this house
  significations: string[];
}

export interface DivisionalPlacement {
  body: string;
  symbol: string;
  signNumber: number;
  signName: string;
  houseNumber: number;
}

export interface DivisionalChart {
  code: 'D1' | 'D9' | 'D10';
  name: string;
  title: string;
  description: string;
  lagnaSignNumber: number;
  lagnaSignName: string;
  placements: DivisionalPlacement[];
}

export interface AntardashaPeriod {
  planet: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
}

export interface MahadashaPeriod {
  planet: string;
  startDate: string;
  endDate: string;
  durationYears: number;
  isCurrent?: boolean;
  antardashas: AntardashaPeriod[];
}

export interface VimshottariDasha {
  birthBalance: {
    rulingPlanet: string;
    yearsRemaining: number;
    fractionRemaining: number;
  };
  currentMahadasha?: string;
  currentAntardasha?: string;
  timeline: MahadashaPeriod[];
}

export interface AstrologicalYoga {
  name: string;
  category: 'Raja Yoga' | 'Dhana Yoga' | 'Pancha Mahapurusha' | 'Chandra Yoga' | 'Surya Yoga' | 'Other';
  description: string;
  effects: string;
  isPresent: boolean;
  planetsInvolved: string[];
}

export interface GrahaDrishti {
  planet: string;
  aspectsHouses: number[]; // house numbers receiving full drishti
  aspectsPlanets: string[];
}

export interface KundaliInterpretations {
  ascendantOverview: string;
  moonSignOverview: string;
  sunSignOverview: string;
  nakshatraOverview: string;
  lifeThemes: string[];
  strengths: string[];
  challenges: string[];
  spiritualGuidance: string;
}

export interface NormalizedKundaliData {
  chartId: string;
  name: string;
  birthDate: string;
  birthTime: string;
  birthTimeUnknown: boolean;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timeZone: number;
  gender?: string;
  calculationSystem: string;
  ayanamsha: string;
  ayanamshaDegree: number;
  ascendant: AscendantPosition;
  moonSign: {
    sign: string;
    signNumber: number;
    nakshatra: string;
    nakshatraPada: number;
    nakshatraLord: string;
  };
  sunSign: {
    sign: string;
    signNumber: number;
  };
  janmaNakshatra: {
    name: string;
    pada: number;
    lord: string;
    deity: string;
    symbol: string;
    element: string;
    gan: string;
    nadi: string;
    varna: string;
    yoni: string;
  };
  planetaryPositions: Record<string, PlanetPosition>;
  houses: HouseData[];
  divisionalCharts: {
    d1: DivisionalChart;
    d9: DivisionalChart;
    d10: DivisionalChart;
  };
  dashaPeriods: VimshottariDasha;
  aspects: GrahaDrishti[];
  yogas: AstrologicalYoga[];
  interpretations: KundaliInterpretations;
  calculationProvider: 'navamsha' | 'astronomy_engine_vedic';
  svgCharts?: {
    northIndianD1?: string;
    southIndianD1?: string;
  };
  createdAt: string;
  updatedAt?: string;
}
