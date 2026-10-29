import { KundaliInterpretations } from '../../types/astrology.types';

export function generateInterpretations(
  lagnaSign: string,
  moonSign: string,
  sunSign: string,
  nakshatra: string,
  pada: number
): KundaliInterpretations {
  const lagnaGuides: Record<string, { overview: string; strengths: string[]; challenges: string[] }> = {
    Aries: {
      overview: "As an Aries (Mesha) Ascendant ruled by Mars, your cosmic blueprint is ignited by pioneering vigor, natural initiative, and an indomitable will to forge new trails. You experience life as an adventure requiring courage and direct action.",
      strengths: ["Undaunted courage in crisis", "Decisive leadership", "Dynamic physical energy", "Authentic self-expression"],
      challenges: ["Impatience with slow processes", "Tendency toward impulsiveness", "Burnout from over-assertion"]
    },
    Taurus: {
      overview: "With a Taurus (Vrishabha) Ascendant ruled by Venus, your journey centers on stability, material artistry, and building enduring foundations. You possess grounded persistence, sensory refinement, and an instinct for sustainable abundance.",
      strengths: ["Exceptional tenacity", "Aesthetic discernment", "Financial pragmatism", "Calm and steady temperament"],
      challenges: ["Resistance to necessary change", "Excessive attachment to comfort", "Reluctance to pivot quickly"]
    },
    Gemini: {
      overview: "As a Gemini (Mithuna) Ascendant ruled by Mercury, your life unfolds through intellectual curiosity, mental agility, and the versatile exchange of ideas. You are a natural connector, communicator, and perpetual learner.",
      strengths: ["Quick-witted intellect", "Multifaceted adaptability", "Persuasive communication", "Innovative problem-solving"],
      challenges: ["Mental restlessness", "Scattering energy across too many projects", "Superficiality under stress"]
    },
    Cancer: {
      overview: "With a Cancer (Karka) Ascendant ruled by the Moon, your cosmic nature is defined by deep emotional intuition, protective instincts, and a profound attunement to family, heritage, and psychic currents.",
      strengths: ["Profound empathy and emotional intelligence", "Tenacious loyalty", "Nuturing leadership", "Acute protective instincts"],
      challenges: ["Vulnerability to mood fluctuations", "Defensive withdrawal when hurt", "Clinging to past grievances"]
    },
    Leo: {
      overview: "With a Leo (Simha) Ascendant ruled by the Sun, you radiate solar vitality, regal confidence, and a deep innate desire to lead with generosity and dignity. You are drawn to center stage and noble enterprise.",
      strengths: ["Magnanimous generosity", "Inspiring commanding presence", "Creative self-confidence", "Steadfast loyalty to allies"],
      challenges: ["Pride and sensitivity to disrespect", "Difficulty delegating humble tasks", "Craving continuous external validation"]
    },
    Virgo: {
      overview: "As a Virgo (Kanya) Ascendant ruled by Mercury, your path is characterized by meticulous discernment, dedication to service, analytical rigor, and the continuous refinement of systems and skills.",
      strengths: ["Flawless attention to detail", "Methodical diagnostic ability", "Humility in meaningful service", "Practical problem-solving"],
      challenges: ["Tendency toward perfectionist paralysis", "Overly critical self-talk", "Internalized stress and worry"]
    },
    Libra: {
      overview: "With a Libra (Tula) Ascendant ruled by Venus, your cosmic blueprint seeks balance, diplomatic harmony, aesthetic beauty, and equitable partnership. You possess an instinct for justice and social grace.",
      strengths: ["Tactful diplomacy", "Innate design and aesthetic sense", "Skill in mediating disputes", "Charismatic interpersonal charm"],
      challenges: ["Indecisiveness when weighing sides", "Avoiding necessary confrontation", "Compromising core values to keep peace"]
    },
    Scorpio: {
      overview: "With a Scorpio (Vrischika) Ascendant ruled by Mars and Ketu, you are driven by intense depth, psychological insight, unwavering investigative willpower, and the capacity for total transformative rebirth.",
      strengths: ["Unflinching psychological courage", "Exceptional focus and determination", "Magnetic presence", "Intuitive detection of hidden truths"],
      challenges: ["Suspicious guardedness", "Harboring emotional grudges", "All-or-nothing emotional extremes"]
    },
    Sagittarius: {
      overview: "As a Sagittarius (Dhanu) Ascendant ruled by Jupiter, your life purpose is guided by philosophical expansion, truth-seeking, infectious optimism, and a quest for higher wisdom across expansive horizons.",
      strengths: ["Visionary optimism", "High ethical and philosophical ideals", "Generous broad-mindedness", "Inspirational mentorship"],
      challenges: ["Dogmatic bluntness", "Overpromising without operational follow-through", "Restlessness with routine"]
    },
    Capricorn: {
      overview: "With a Capricorn (Makara) Ascendant ruled by Saturn, your cosmic blueprint is defined by methodical ambition, structural mastery, patience, and the ability to scale formidable heights through discipline.",
      strengths: ["Strategic long-term vision", "Unshakable work ethic", "Pragmatic organizational skill", "Integrity under pressure"],
      challenges: ["Excessive emotional austerity", "Pessimism during delays", "Over-identifying worth with worldly status"]
    },
    Aquarius: {
      overview: "As an Aquarius (Kumbha) Ascendant ruled by Saturn and Rahu, your destiny is shaped by humanitarian ideals, progressive innovation, intellectual independence, and a commitment to societal reform.",
      strengths: ["Original, unconventional thinking", "Humanitarian compassion", "Objective detached perspective", "Visionary foresight"],
      challenges: ["Emotional detachment or aloofness", "Rebelliousness for its own sake", "Difficulty with intimate vulnerability"]
    },
    Pisces: {
      overview: "With a Pisces (Meena) Ascendant ruled by Jupiter, your nature is imbued with transcendent compassion, imaginative vision, mystical sensitivity, and a natural affinity for unseen spiritual realms.",
      strengths: ["Boundless creative imagination", "Deep spiritual receptivity", "Selfless empathy", "Healing and artistic gifts"],
      challenges: ["Escapism when facing harsh reality", "Poor emotional boundary maintenance", "Tendency toward martyrdom"]
    }
  };

  const lagnaInfo = lagnaGuides[lagnaSign] || lagnaGuides['Aries'];

  const moonSignGuides: Record<string, string> = {
    Aries: "Your Moon in Aries creates an instinctively courageous, fast-reacting emotional core. You process feelings through physical movement and immediate honesty.",
    Taurus: "Your Moon in exalted Taurus imparts deep emotional resilience, calm equanimity, and a serene inner sanctuary that remains unshakable in storms.",
    Gemini: "Your Moon in Gemini processes emotion through verbalization and intellectual analysis. You feel safest when you can learn, talk, and read through feelings.",
    Cancer: "Your Moon in its own sign Cancer bestows profound emotional depth, oceanic intuition, and an innate capacity to nurture and protect loved ones.",
    Leo: "Your Moon in Leo feels emotions with theatrical warmth, nobility, and fierce loyalty. You need genuine appreciation and creative outlets for emotional joy.",
    Virgo: "Your Moon in Virgo tends to heal through practical utility, order, and quiet helpfulness. You process emotions by organizing your environment.",
    Libra: "Your Moon in Libra seeks emotional peace through harmony, aesthetic beauty, and balanced relationships. Clashing environments trigger inner unease.",
    Scorpio: "Your Moon in Scorpio feels with intense, penetrating depth. You experience emotional alchemy, moving from vulnerability to supreme psychic power.",
    Sagittarius: "Your Moon in Sagittarius maintains an emotional baseline of philosophical faith, freedom, and an instinctual belief that everything serves evolution.",
    Capricorn: "Your Moon in Capricorn processes feelings through responsibility and endurance. You demonstrate love through steady reliability and protective care.",
    Aquarius: "Your Moon in Aquarius experiences feelings through the lens of human fellowship and philosophical detachment, offering broad, non-judgmental acceptance.",
    Pisces: "Your Moon in Pisces dissolves boundaries into cosmic compassion, possessing vivid dreams, musical sensitivity, and intuitive empathy."
  };

  const sunSignGuides: Record<string, string> = {
    Aries: "Your Sun in Aries fuels an unwavering core drive for sovereignty, innovation, and pioneer leadership.",
    Taurus: "Your Sun in Taurus establishes a deep solar willpower anchored in craftsmanship, value creation, and enduring stewardship.",
    Gemini: "Your Sun in Gemini radiates illumination through the synthesis of concepts, teaching, and lively community dialogue.",
    Cancer: "Your Sun in Cancer directs its core purpose toward building security, honoring ancestral roots, and providing emotional shelter.",
    Leo: "Your Sun in its own regal sign Leo shines with supreme confidence, radiant creative expression, and authentic sovereign leadership.",
    Virgo: "Your Sun in Virgo channels its vital force into purposeful mastery, diagnostic precision, and practical perfection of work.",
    Libra: "Your Sun in Libra realizes its destiny through creating harmony, fostering ethical justice, and building alliances.",
    Scorpio: "Your Sun in Scorpio burns with transformative power, penetrating behind facades to uncover hidden laws of nature.",
    Sagittarius: "Your Sun in Sagittarius shoots arrows toward higher wisdom, dharma, cultural synthesis, and philosophical truth.",
    Capricorn: "Your Sun in Capricorn builds monumental achievements through patient endurance, institutional stewardship, and integrity.",
    Aquarius: "Your Sun in Aquarius champions egalitarian progress, technological breakthroughs, and collective enlightenment.",
    Pisces: "Your Sun in Pisces connects with universal unity, artistic inspiration, and the quiet dissolution of ego into higher purpose."
  };

  return {
    ascendantOverview: lagnaInfo.overview,
    moonSignOverview: moonSignGuides[moonSign] || `Your Moon in ${moonSign} guides your inner mental instincts and instinctive responses to life events.`,
    sunSignOverview: sunSignGuides[sunSign] || `Your Sun in ${sunSign} illuminates your core vitality, soul purpose, and outward career path.`,
    nakshatraOverview: `Born under ${nakshatra} Nakshatra in Pada ${pada}, your conscious awareness is patterned with specialized archetypal power, giving you an innate karmic destiny and psychological gifts distinct to this lunar mansion.`,
    lifeThemes: [
      "Harmonizing personal ambition with spiritual dharma (righteous duty)",
      "Cultivating emotional mastery and inner discernment in key relationships",
      "Translating innate creative insight into structured material outcomes",
      "Using life challenges as catalysts for transformative personal evolution"
    ],
    strengths: lagnaInfo.strengths,
    challenges: lagnaInfo.challenges,
    spiritualGuidance: "Vedic wisdom advises aligning daily actions with your natural cosmic constitution. Focus on meditation during the Sandhya periods (dawn and dusk), honor your Janma Nakshatra ruler through mindful contemplation, and cultivate detached awareness across both triumphs and setbacks."
  };
}
