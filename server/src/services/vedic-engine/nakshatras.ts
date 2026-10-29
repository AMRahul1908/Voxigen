export interface NakshatraInfo {
  index: number; // 0 to 26
  name: string;
  ruler: string;
  deity: string;
  symbol: string;
  element: string;
  gan: string; // Deva, Manushya, Rakshasa
  nadi: string; // Adi, Madhya, Antya
  varna: string; // Brahmin, Kshatriya, Vaishya, Shudra
  yoni: string;
}

export const NAKSHATRAS: NakshatraInfo[] = [
  { index: 0, name: "Ashwini", ruler: "Ketu", deity: "Ashwini Kumaras", symbol: "Horse's head", element: "Earth", gan: "Deva", nadi: "Adi", varna: "Vaishya", yoni: "Horse" },
  { index: 1, name: "Bharani", ruler: "Venus", deity: "Yama", symbol: "Yoni", element: "Earth", gan: "Manushya", nadi: "Madhya", varna: "Mleccha", yoni: "Elephant" },
  { index: 2, name: "Krittika", ruler: "Sun", deity: "Agni", symbol: "Razor / Knife", element: "Earth", gan: "Rakshasa", nadi: "Antya", varna: "Brahmin", yoni: "Sheep" },
  { index: 3, name: "Rohini", ruler: "Moon", deity: "Brahma / Prajapati", symbol: "Chariot / Cart", element: "Earth", gan: "Manushya", nadi: "Antya", varna: "Shudra", yoni: "Serpent" },
  { index: 4, name: "Mrigashira", ruler: "Mars", deity: "Soma", symbol: "Deer's head", element: "Earth", gan: "Deva", nadi: "Madhya", varna: "Vaishya", yoni: "Serpent" },
  { index: 5, name: "Ardra", ruler: "Rahu", deity: "Rudra", symbol: "Teardrop", element: "Water", gan: "Manushya", nadi: "Adi", varna: "Shudra", yoni: "Dog" },
  { index: 6, name: "Punarvasu", ruler: "Jupiter", deity: "Aditi", symbol: "Bow and Quiver", element: "Water", gan: "Deva", nadi: "Adi", varna: "Vaishya", yoni: "Cat" },
  { index: 7, name: "Pushya", ruler: "Saturn", deity: "Brihaspati", symbol: "Cow's udder / Lotus", element: "Water", gan: "Deva", nadi: "Madhya", varna: "Kshatriya", yoni: "Sheep" },
  { index: 8, name: "Ashlesha", ruler: "Mercury", deity: "Nagas (Serpents)", symbol: "Coiled serpent", element: "Water", gan: "Rakshasa", nadi: "Antya", varna: "Mleccha", yoni: "Cat" },
  { index: 9, name: "Magha", ruler: "Ketu", deity: "Pitris (Ancestors)", symbol: "Royal Throne", element: "Fire", gan: "Rakshasa", nadi: "Antya", varna: "Shudra", yoni: "Rat" },
  { index: 10, name: "Purva Phalguni", ruler: "Venus", deity: "Bhaga", symbol: "Front legs of bed", element: "Fire", gan: "Manushya", nadi: "Madhya", varna: "Brahmin", yoni: "Rat" },
  { index: 11, name: "Uttara Phalguni", ruler: "Sun", deity: "Aryaman", symbol: "Back legs of bed", element: "Fire", gan: "Manushya", nadi: "Adi", varna: "Kshatriya", yoni: "Cow" },
  { index: 12, name: "Hasta", ruler: "Moon", deity: "Savitr (Sun)", symbol: "Open Hand / Fist", element: "Fire", gan: "Deva", nadi: "Adi", varna: "Vaishya", yoni: "Buffalo" },
  { index: 13, name: "Chitra", ruler: "Mars", deity: "Vishwakarma", symbol: "Bright jewel / Pearl", element: "Fire", gan: "Rakshasa", nadi: "Madhya", varna: "Shudra", yoni: "Tiger" },
  { index: 14, name: "Swati", ruler: "Rahu", deity: "Vayu (Wind)", symbol: "Young shoot / Coral", element: "Air", gan: "Deva", nadi: "Antya", varna: "Mleccha", yoni: "Buffalo" },
  { index: 15, name: "Vishakha", ruler: "Jupiter", deity: "Indra-Agni", symbol: "Triumphal Arch", element: "Air", gan: "Rakshasa", nadi: "Antya", varna: "Mleccha", yoni: "Tiger" },
  { index: 16, name: "Anuradha", ruler: "Saturn", deity: "Mitra", symbol: "Lotus / Staff", element: "Air", gan: "Deva", nadi: "Madhya", varna: "Shudra", yoni: "Deer" },
  { index: 17, name: "Jyeshtha", ruler: "Mercury", deity: "Indra", symbol: "Earring / Talisman", element: "Air", gan: "Rakshasa", nadi: "Adi", varna: "Vaishya", yoni: "Deer" },
  { index: 18, name: "Mula", ruler: "Ketu", deity: "Nirriti", symbol: "Tied bundle of roots", element: "Air", gan: "Rakshasa", nadi: "Adi", varna: "Kshatriya", yoni: "Dog" },
  { index: 19, name: "Purva Ashadha", ruler: "Venus", deity: "Apas (Cosmic Waters)", symbol: "Elephant tusk / Fan", element: "Water", gan: "Manushya", nadi: "Madhya", varna: "Brahmin", yoni: "Monkey" },
  { index: 20, name: "Uttara Ashadha", ruler: "Sun", deity: "Vishwadevas", symbol: "Small cot / Planks", element: "Water", gan: "Manushya", nadi: "Antya", varna: "Kshatriya", yoni: "Mongoose" },
  { index: 21, name: "Shravana", ruler: "Moon", deity: "Vishnu", symbol: "Ear / Three footprints", element: "Water", gan: "Deva", nadi: "Antya", varna: "Mleccha", yoni: "Monkey" },
  { index: 22, name: "Dhanishta", ruler: "Mars", deity: "Ashta Vasus", symbol: "Drum (Mridanga)", element: "Ether", gan: "Rakshasa", nadi: "Madhya", varna: "Shudra", yoni: "Lion" },
  { index: 23, name: "Shatabhisha", ruler: "Rahu", deity: "Varuna", symbol: "Empty circle / 100 healers", element: "Ether", gan: "Rakshasa", nadi: "Adi", varna: "Mleccha", yoni: "Horse" },
  { index: 24, name: "Purva Bhadrapada", ruler: "Jupiter", deity: "Aja Ekapada", symbol: "Sword / Two front legs", element: "Ether", gan: "Manushya", nadi: "Adi", varna: "Brahmin", yoni: "Lion" },
  { index: 25, name: "Uttara Bhadrapada", ruler: "Saturn", deity: "Ahirbudhnya", symbol: "Twin / Back legs", element: "Ether", gan: "Manushya", nadi: "Madhya", varna: "Kshatriya", yoni: "Cow" },
  { index: 26, name: "Revati", ruler: "Mercury", deity: "Pushan", symbol: "Fish / Pair of fish", element: "Water", gan: "Deva", nadi: "Antya", varna: "Shudra", yoni: "Elephant" }
];

export interface ZodiacSignInfo {
  number: number; // 1 to 12
  name: string;
  sanskritName: string;
  lord: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  modality: 'Chara (Movable)' | 'Sthira (Fixed)' | 'Dvisvabhava (Dual)';
}

export const ZODIAC_SIGNS: ZodiacSignInfo[] = [
  { number: 1, name: "Aries", sanskritName: "Mesha", lord: "Mars", element: "Fire", modality: "Chara (Movable)" },
  { number: 2, name: "Taurus", sanskritName: "Vrishabha", lord: "Venus", element: "Earth", modality: "Sthira (Fixed)" },
  { number: 3, name: "Gemini", sanskritName: "Mithuna", lord: "Mercury", element: "Air", modality: "Dvisvabhava (Dual)" },
  { number: 4, name: "Cancer", sanskritName: "Karka", lord: "Moon", element: "Water", modality: "Chara (Movable)" },
  { number: 5, name: "Leo", sanskritName: "Simha", lord: "Sun", element: "Fire", modality: "Sthira (Fixed)" },
  { number: 6, name: "Virgo", sanskritName: "Kanya", lord: "Mercury", element: "Earth", modality: "Dvisvabhava (Dual)" },
  { number: 7, name: "Libra", sanskritName: "Tula", lord: "Venus", element: "Air", modality: "Chara (Movable)" },
  { number: 8, name: "Scorpio", sanskritName: "Vrischika", lord: "Mars", element: "Water", modality: "Sthira (Fixed)" },
  { number: 9, name: "Sagittarius", sanskritName: "Dhanu", lord: "Jupiter", element: "Fire", modality: "Dvisvabhava (Dual)" },
  { number: 10, name: "Capricorn", sanskritName: "Makara", lord: "Saturn", element: "Earth", modality: "Chara (Movable)" },
  { number: 11, name: "Aquarius", sanskritName: "Kumbha", lord: "Saturn", element: "Air", modality: "Sthira (Fixed)" },
  { number: 12, name: "Pisces", sanskritName: "Meena", lord: "Jupiter", element: "Water", modality: "Dvisvabhava (Dual)" }
];

/**
 * Calculates Nakshatra and Pada from sidereal longitude (0 - 360)
 */
export function getNakshatraAndPada(siderealLongitude: number): {
  nakshatra: NakshatraInfo;
  pada: number; // 1 to 4
  degreesInNakshatra: number;
  fractionElapsed: number; // 0 to 1
  fractionRemaining: number; // 0 to 1
} {
  const normalizedLon = ((siderealLongitude % 360) + 360) % 360;
  const nakshatraSpan = 360 / 27; // 13.333333333° (13° 20')
  const padaSpan = nakshatraSpan / 4; // 3.333333333° (3° 20')

  const nakshatraIndex = Math.min(26, Math.floor(normalizedLon / nakshatraSpan));
  const degInNak = normalizedLon - nakshatraIndex * nakshatraSpan;
  const pada = Math.min(4, Math.floor(degInNak / padaSpan) + 1);

  const fractionElapsed = degInNak / nakshatraSpan;
  const fractionRemaining = 1 - fractionElapsed;

  return {
    nakshatra: NAKSHATRAS[nakshatraIndex],
    pada,
    degreesInNakshatra: degInNak,
    fractionElapsed,
    fractionRemaining
  };
}

export function getZodiacSign(siderealLongitude: number): {
  sign: ZodiacSignInfo;
  normDegree: number;
} {
  const normalizedLon = ((siderealLongitude % 360) + 360) % 360;
  const signIndex = Math.min(11, Math.floor(normalizedLon / 30));
  const normDegree = normalizedLon - signIndex * 30;
  return {
    sign: ZODIAC_SIGNS[signIndex],
    normDegree
  };
}
