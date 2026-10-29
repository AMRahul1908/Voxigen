import { PlanetPosition, AstrologicalYoga } from '../../types/astrology.types';

export function calculateYogas(
  planets: Record<string, PlanetPosition>,
  lagnaSignNumber: number
): AstrologicalYoga[] {
  const yogas: AstrologicalYoga[] = [];

  const sun = planets['Sun'];
  const moon = planets['Moon'];
  const mars = planets['Mars'];
  const mercury = planets['Mercury'];
  const jupiter = planets['Jupiter'];
  const venus = planets['Venus'];
  const saturn = planets['Saturn'];

  if (!sun || !moon || !mars || !mercury || !jupiter || !venus || !saturn) {
    return yogas;
  }

  // Helper to determine house distance from A to B (1-indexed)
  const houseDistance = (fromHouse: number, toHouse: number): number => {
    return ((toHouse - fromHouse + 12) % 12) + 1;
  };

  const isKendra = (h: number): boolean => [1, 4, 7, 10].includes(h);

  // 1. Gaja Kesari Yoga: Jupiter in Kendra from Moon
  const jupFromMoon = houseDistance(moon.house, jupiter.house);
  if (isKendra(jupFromMoon)) {
    yogas.push({
      name: 'Gaja Kesari Yoga',
      category: 'Raja Yoga',
      description: 'Jupiter occupies a Kendra (1st, 4th, 7th, or 10th house) from the Moon.',
      effects: 'Bestows noble character, enduring reputation, scholarly wisdom, eloquence, and protection from life adversities.',
      isPresent: true,
      planetsInvolved: ['Jupiter', 'Moon']
    });
  }

  // 2. Budhaditya Yoga: Sun and Mercury in the same house
  if (sun.house === mercury.house) {
    yogas.push({
      name: 'Budhaditya Yoga',
      category: 'Surya Yoga',
      description: 'The Sun (illumination) and Mercury (intellect) conjunction.',
      effects: 'Grants keen analytical acumen, administrative capability, persuasive communication, and intellectual distinction.',
      isPresent: true,
      planetsInvolved: ['Sun', 'Mercury']
    });
  }

  // 3. Chandra-Mangala Yoga: Moon and Mars together or in 7th mutual aspect
  if (moon.house === mars.house || houseDistance(moon.house, mars.house) === 7) {
    yogas.push({
      name: 'Chandra-Mangala Yoga',
      category: 'Dhana Yoga',
      description: 'Moon (mind) and Mars (vitality & real assets) in conjunction or mutual aspect.',
      effects: 'Enhances entrepreneurial drive, financial resourcefulness, wealth accumulation through enterprise, and decisive action.',
      isPresent: true,
      planetsInvolved: ['Moon', 'Mars']
    });
  }

  // 4. Pancha Mahapurusha Yogas (Mars, Mercury, Jupiter, Venus, Saturn in Kendra in own/exaltation)
  if (isKendra(mars.house) && ['Capricorn', 'Aries', 'Scorpio'].includes(mars.zodiacSign)) {
    yogas.push({
      name: 'Ruchaka Yoga',
      category: 'Pancha Mahapurusha',
      description: 'Mars placed in a Kendra house in its exaltation or own sign.',
      effects: 'Cultivates courage, leadership, martial physical vitality, triumph over competitors, and high executive authority.',
      isPresent: true,
      planetsInvolved: ['Mars']
    });
  }

  if (isKendra(mercury.house) && ['Virgo', 'Gemini'].includes(mercury.zodiacSign)) {
    yogas.push({
      name: 'Bhadra Yoga',
      category: 'Pancha Mahapurusha',
      description: 'Mercury placed in a Kendra house in its exaltation or own sign.',
      effects: 'Conveys intellectual mastery, research genius, mastery of commerce, eloquence, and a respected advisors mindset.',
      isPresent: true,
      planetsInvolved: ['Mercury']
    });
  }

  if (isKendra(jupiter.house) && ['Cancer', 'Sagittarius', 'Pisces'].includes(jupiter.zodiacSign)) {
    yogas.push({
      name: 'Hamsa Yoga',
      category: 'Pancha Mahapurusha',
      description: 'Jupiter placed in a Kendra house in its exaltation or own sign.',
      effects: 'Bestows spiritual nobility, righteous judgment, widespread reverence, charitable instincts, and philosophical clarity.',
      isPresent: true,
      planetsInvolved: ['Jupiter']
    });
  }

  if (isKendra(venus.house) && ['Pisces', 'Taurus', 'Libra'].includes(venus.zodiacSign)) {
    yogas.push({
      name: 'Malavya Yoga',
      category: 'Pancha Mahapurusha',
      description: 'Venus placed in a Kendra house in its exaltation or own sign.',
      effects: 'Grants aesthetic elegance, artistic gifts, luxurious living, magnetic charm, and harmonious relationship blessings.',
      isPresent: true,
      planetsInvolved: ['Venus']
    });
  }

  if (isKendra(saturn.house) && ['Libra', 'Capricorn', 'Aquarius'].includes(saturn.zodiacSign)) {
    yogas.push({
      name: 'Sasa Yoga',
      category: 'Pancha Mahapurusha',
      description: 'Saturn placed in a Kendra house in its exaltation or own sign.',
      effects: 'Imparts steadfast endurance, command over organizations, deep patience, public leadership, and grounded humility.',
      isPresent: true,
      planetsInvolved: ['Saturn']
    });
  }

  // 5. Amala Yoga: Benefic (Jupiter, Venus, Mercury) in the 10th house
  const tenthBenefics = [jupiter, venus, mercury].filter(p => p.house === 10);
  if (tenthBenefics.length > 0) {
    yogas.push({
      name: 'Amala Yoga',
      category: 'Raja Yoga',
      description: 'Natural benefic planet residing in the 10th house of career and karma.',
      effects: 'Guarantees spotless professional reputation, benevolent authority, ethical success, and lasting social goodwill.',
      isPresent: true,
      planetsInvolved: tenthBenefics.map(p => p.name)
    });
  }

  // 6. Guru-Shukra (Jupiter-Venus) mutual aspect or connection
  if (houseDistance(jupiter.house, venus.house) === 7 || jupiter.house === venus.house) {
    yogas.push({
      name: 'Dharmacharya Yoga',
      category: 'Raja Yoga',
      description: 'Both great preceptors (Jupiter & Venus) in mutual conjunction or opposition.',
      effects: 'Harmonizes high ethical principles with practical aesthetic execution; visionary mentorship capacity.',
      isPresent: true,
      planetsInvolved: ['Jupiter', 'Venus']
    });
  }

  return yogas;
}
