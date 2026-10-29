// ─── Astrology Data ───────────────────────────────────────────────────────────

export const ZODIAC = [
  { sign: "Aries",       symbol: "♈", element: "Fire",  lord: "Mars"    },
  { sign: "Taurus",      symbol: "♉", element: "Earth", lord: "Venus"   },
  { sign: "Gemini",      symbol: "♊", element: "Air",   lord: "Mercury" },
  { sign: "Cancer",      symbol: "♋", element: "Water", lord: "Moon"    },
  { sign: "Leo",         symbol: "♌", element: "Fire",  lord: "Sun"     },
  { sign: "Virgo",       symbol: "♍", element: "Earth", lord: "Mercury" },
  { sign: "Libra",       symbol: "♎", element: "Air",   lord: "Venus"   },
  { sign: "Scorpio",     symbol: "♏", element: "Water", lord: "Mars"    },
  { sign: "Sagittarius", symbol: "♐", element: "Fire",  lord: "Jupiter" },
  { sign: "Capricorn",   symbol: "♑", element: "Earth", lord: "Saturn"  },
  { sign: "Aquarius",    symbol: "♒", element: "Air",   lord: "Saturn"  },
  { sign: "Pisces",      symbol: "♓", element: "Water", lord: "Jupiter" },
];

export const PLANETS = [
  { name: "Sun",     symbol: "☉", color: "#f0a500" },
  { name: "Moon",    symbol: "☽", color: "#c0c0c0" },
  { name: "Mercury", symbol: "☿", color: "#88c0d0" },
  { name: "Venus",   symbol: "♀", color: "#f08080" },
  { name: "Mars",    symbol: "♂", color: "#e05050" },
  { name: "Jupiter", symbol: "♃", color: "#f0c040" },
  { name: "Saturn",  symbol: "♄", color: "#8888aa" },
  { name: "Rahu",    symbol: "☊", color: "#9955cc" },
  { name: "Ketu",    symbol: "☋", color: "#cc7755" },
];

export const COMPAT = [
  { label: "Varna",    max: 1  },
  { label: "Vashya",   max: 2  },
  { label: "Tara",     max: 3  },
  { label: "Yoni",     max: 4  },
  { label: "Graha",    max: 5  },
  { label: "Gana",     max: 6  },
  { label: "Bhakut",   max: 7  },
  { label: "Nadi",     max: 8  },
];

export const GUNA_ROWS = [
  { koot: "Varna",  max: 1,  desc: "Spiritual compatibility"   },
  { koot: "Vashya", max: 2,  desc: "Mutual attraction & control" },
  { koot: "Tara",   max: 3,  desc: "Longevity & health"        },
  { koot: "Yoni",   max: 4,  desc: "Physical & sexual harmony" },
  { koot: "Graha",  max: 5,  desc: "Emotional compatibility"   },
  { koot: "Gana",   max: 6,  desc: "Temperament match"         },
  { koot: "Bhakut", max: 7,  desc: "Love & prosperity"         },
  { koot: "Nadi",   max: 8,  desc: "Health & progeny"          },
];

export const SERVICES = [
  {
    num: "01",
    icon: "🔯",
    title: "KUNDLI",
    sub: "GENERATION",
    desc: "Get your complete Vedic birth chart with planetary positions, house analysis, and Ashtakavarga scores — calculated to arc-minute precision.",
    items: ["Lagna & Moon Chart", "All 12 Houses Analysis", "Planetary Dignities", "D1, D9 & D10 Vargas"],
  },
  {
    num: "02",
    icon: "🎙️",
    title: "VOICE",
    sub: "READING",
    desc: "Your voice carries unique bio-acoustic frequencies linked to your personal patterns. Analyse your voice to reveal hidden personality traits and energy patterns.",
    items: ["Frequency Spectrum Analysis", "Emotion & Energy Mapping", "Personality Insights", "Harmony Score"],
  },
  {
    num: "03",
    icon: "💞",
    title: "KUNDLI",
    sub: "MATCHING",
    desc: "Classic Ashtakoot Guna Milan scoring for marriage compatibility, analysing 8 dimensions across both birth charts for a comprehensive match report.",
    items: ["36-Point Guna Milan", "Mangal Dosha Check", "Dasha Sandhi Analysis", "Compatibility Report"],
  },
  {
    num: "04",
    icon: "🌙",
    title: "DAILY",
    sub: "HOROSCOPE",
    desc: "Personalised daily, weekly, and monthly predictions based on your Moon sign and current planetary transits through your natal chart.",
    items: ["Moon Sign Forecast", "Transit Highlights", "Lucky Colour & Number", "Favourable Timings"],
  },
  {
    num: "05",
    icon: "📅",
    title: "PANCHANG",
    sub: "CALENDAR",
    desc: "Today's auspicious timings with Tithi, Nakshatra, Yoga, Karana, Rahukaal, and Abhijit Muhurta for all religious and personal events.",
    items: ["Tithi & Nakshatra", "Rahukaal & Yamaganda", "Shubh Muhurta", "Sunrise & Sunset"],
  },
  {
    num: "06",
    icon: "🏠",
    title: "HOUSE",
    sub: "ANALYSIS",
    desc: "Deep-dive into all 12 Bhavas of your chart — from Lagna (self) to Vyaya (liberation) — with their lords, occupants, and active yogas.",
    items: ["12-Bhava Breakdown", "House Lord Analysis", "Yoga Detection", "Karaka Planets"],
  },
];

export const TRUST = [
  { icon: "🔬", label: "Science\nBacked" },
  { icon: "🛡️", label: "Privacy\nFirst"  },
  { icon: "⚡", label: "Instant\nResults" },
  { icon: "🌏", label: "400+\nClients"  },
  { icon: "🎯", label: "Arc-Minute\nAccuracy" },
  { icon: "📱", label: "Mobile\nFriendly" },
];

export const BOTTOM_BADGES = [
  { icon: "🔐", label: "Secure & Private" },
  { icon: "🆓", label: "Free to Use"      },
  { icon: "⚡", label: "Instant Charts"   },
  { icon: "🌐", label: "Works Worldwide"  },
];

// ─── Utility Functions ────────────────────────────────────────────────────────

/** Seed a pseudo-random number from a string for deterministic output. */
export function seed(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (h * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(h);
}

/** Derive zodiac sign index (0-11) from a date-of-birth string "YYYY-MM-DD". */
export function signFromDob(dob: string): number {
  const [, m, d] = dob.split("-").map(Number);
  // Sun-sign boundary table: [month, day] when next sign starts
  const boundaries: [number, number][] = [
    [1, 20], [2, 19], [3, 21], [4, 20], [5, 21], [6, 21],
    [7, 23], [8, 23], [9, 23], [10, 23], [11, 22], [12, 22],
  ];
  for (let i = 0; i < boundaries.length; i++) {
    const [bm, bd] = boundaries[i];
    if (m === bm && d < bd) return i;
    if (m === bm && d >= bd) return (i + 1) % 12;
  }
  return 0;
}

/** Compute an Ashtakoot-like compatibility score (0-36) from two sign indices. */
export function compatScore(a: number, b: number): number {
  const diff = Math.abs(a - b);
  const norm = diff > 6 ? 12 - diff : diff;
  // Rough scoring: closer signs score higher
  const base = Math.round(36 - norm * 3.5);
  return Math.max(0, Math.min(36, base));
}

/** Format a number to a fixed width string with optional suffix. */
export function fmt(n: number, decimals = 1): string {
  return n.toFixed(decimals);
}
