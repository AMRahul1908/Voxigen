import { BirthDetailsInput, NormalizedKundaliData, HouseData, GrahaDrishti } from '../types/astrology.types';
import { calculateFullVedicKundali, BHAVA_NAMES, BHAVA_SIGNIFICATIONS } from './vedic-engine';
import { ZODIAC_SIGNS, getNakshatraAndPada } from './vedic-engine/nakshatras';
import { formatDegrees } from './vedic-engine/ayanamsha';
import { calculateDivisionalCharts, BodyInput } from './vedic-engine/vargas';
import { calculateVimshottariDasha } from './vedic-engine/dasha';
import { calculateYogas } from './vedic-engine/yogas';
import { generateInterpretations } from './vedic-engine/interpretations';

export class AstrologyService {
  private navamshaApiKey: string | undefined;
  private navamshaBaseUrl: string = 'https://api.navamsha.in';

  constructor() {
    this.navamshaApiKey = process.env.NAVAMSHA_API_KEY?.trim();
  }

  /**
   * Generates or calculates a normalized Vedic Kundali
   */
  public async generateKundali(input: BirthDetailsInput, chartId: string): Promise<NormalizedKundaliData> {
    // 1. If Navamsha API key is present, attempt live provider call
    if (this.navamshaApiKey && this.navamshaApiKey !== 'your_api_key' && this.navamshaApiKey !== 'your_navamsha_api_key_here') {
      try {
        console.log(`[AstrologyService] Calling Navamsha API provider for ${input.name}...`);
        const navamshaResult = await this.callNavamshaProvider(input, chartId);
        if (navamshaResult) {
          console.log(`[AstrologyService] Successfully calculated chart using Navamsha API.`);
          return navamshaResult;
        }
      } catch (err: any) {
        console.warn(`[AstrologyService] Navamsha API call failed (${err?.message || err}). Falling back to high-precision Vedic astronomy calculation engine.`);
      }
    } else {
      console.log(`[AstrologyService] No valid NAVAMSHA_API_KEY configured. Using degree-accurate Vedic Astronomy Engine (Lahiri Ayanamsha + JPL algorithms).`);
    }

    // 2. High-precision fallback engine (real astronomical calculations, Lahiri Ayanamsha)
    return calculateFullVedicKundali(input, chartId);
  }

  /**
   * Integrates the Navamsha API schema and normalizes response
   */
  private async callNavamshaProvider(input: BirthDetailsInput, chartId: string): Promise<NormalizedKundaliData | null> {
    const [yearStr, monthStr, dayStr] = input.birthDate.split('-');
    const timeStr = input.birthTimeUnknown ? '12:00' : (input.birthTime || '12:00');
    const [hourStr, minStr] = timeStr.split(':');

    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);

    const payload = {
      year,
      month,
      date: day,
      hours: parseInt(hourStr, 10),
      minutes: parseInt(minStr, 10),
      latitude: Number(input.latitude),
      longitude: Number(input.longitude),
      timezone: Number(input.timeZone)
    };

    // Abort controller for timeout safety (8 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`${this.navamshaBaseUrl}/api/v1/kundali/basic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.navamshaApiKey!
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Navamsha API responded with status ${response.status}: ${errText}`);
    }

    const data: any = await response.json();
    if (!data || !data.output || !data.output.ascendant) {
      throw new Error('Invalid response structure from Navamsha API');
    }

    const out = data.output;

    // Call fallback engine to build baseline
    const baseline = calculateFullVedicKundali(input, chartId);

    // Normalize and override with Navamsha calculated coordinates
    const signObj = ZODIAC_SIGNS.find(s => s.name.toLowerCase() === out.ascendant.zodiac_sign_name?.toLowerCase());

    baseline.ascendant = {
      sign: out.ascendant.zodiac_sign_name || baseline.ascendant.sign,
      signNumber: signObj ? signObj.number : (out.ascendant.current_sign || baseline.ascendant.signNumber),
      signLord: out.ascendant.zodiac_sign_lord || (signObj ? signObj.lord : baseline.ascendant.signLord),
      fullDegree: Number(out.ascendant.fullDegree?.toFixed(4)) || baseline.ascendant.fullDegree,
      normDegree: Number(out.ascendant.normDegree?.toFixed(4)) || baseline.ascendant.normDegree,
      degreeFormatted: formatDegrees(out.ascendant.normDegree || baseline.ascendant.normDegree),
      nakshatra: out.ascendant.nakshatra_name || baseline.ascendant.nakshatra,
      nakshatraPada: out.ascendant.nakshatra_pada || baseline.ascendant.nakshatraPada,
      nakshatraLord: out.ascendant.nakshatra_vimsottari_lord || baseline.ascendant.nakshatraLord,
      element: signObj ? signObj.element : baseline.ascendant.element,
      modality: signObj ? signObj.modality : baseline.ascendant.modality
    };

    // Normalize Navamsha planets
    if (out.planets) {
      for (const [pName, pData] of Object.entries<any>(out.planets)) {
        if (baseline.planetaryPositions[pName]) {
          const pSign = ZODIAC_SIGNS.find(s => s.name.toLowerCase() === pData.zodiac_sign_name?.toLowerCase());
          const signNum = pData.current_sign || (pSign ? pSign.number : baseline.planetaryPositions[pName].signNumber);
          const normDeg = pData.normDegree !== undefined ? Number(pData.normDegree.toFixed(4)) : baseline.planetaryPositions[pName].normDegree;
          const fullDeg = pData.fullDegree !== undefined ? Number(pData.fullDegree.toFixed(4)) : (signNum - 1) * 30 + normDeg;

          baseline.planetaryPositions[pName] = {
            ...baseline.planetaryPositions[pName],
            zodiacSign: pData.zodiac_sign_name || baseline.planetaryPositions[pName].zodiacSign,
            signNumber: signNum,
            signLord: pData.zodiac_sign_lord || (pSign ? pSign.lord : baseline.planetaryPositions[pName].signLord),
            normDegree: normDeg,
            fullDegree: fullDeg,
            degreeFormatted: formatDegrees(normDeg),
            house: pData.house_number || baseline.planetaryPositions[pName].house,
            nakshatra: pData.nakshatra_name || baseline.planetaryPositions[pName].nakshatra,
            nakshatraPada: pData.nakshatra_pada || baseline.planetaryPositions[pName].nakshatraPada,
            nakshatraLord: pData.nakshatra_vimsottari_lord || baseline.planetaryPositions[pName].nakshatraLord,
            isRetrograde: pData.isRetro === 'true' || pData.isRetro === true
          };
        }
      }
    }

    // Synchronize Houses with Navamsha Lagna and Planet Placements
    const houses: HouseData[] = [];
    for (let h = 1; h <= 12; h++) {
      const signNum = ((baseline.ascendant.signNumber - 1 + (h - 1)) % 12) + 1;
      const signInfo = ZODIAC_SIGNS[signNum - 1];

      const occupyingPlanets = Object.values(baseline.planetaryPositions)
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
    baseline.houses = houses;

    // Synchronize Divisional Charts (D1, D9, D10)
    const bodies: BodyInput[] = Object.values(baseline.planetaryPositions).map(p => ({
      name: p.name,
      symbol: p.symbol,
      fullDegree: p.fullDegree
    }));
    baseline.divisionalCharts = calculateDivisionalCharts(baseline.ascendant.fullDegree, bodies);

    // Synchronize Moon & Sun Sign metadata
    const moon = baseline.planetaryPositions['Moon'];
    const sun = baseline.planetaryPositions['Sun'];
    if (moon) {
      const moonNakInfo = getNakshatraAndPada(moon.fullDegree);
      baseline.moonSign = {
        sign: moon.zodiacSign,
        signNumber: moon.signNumber,
        nakshatra: moon.nakshatra,
        nakshatraPada: moon.nakshatraPada,
        nakshatraLord: moon.nakshatraLord
      };
      baseline.janmaNakshatra = {
        name: moon.nakshatra,
        pada: moon.nakshatraPada,
        lord: moon.nakshatraLord,
        deity: moonNakInfo.nakshatra.deity,
        symbol: moonNakInfo.nakshatra.symbol,
        element: moonNakInfo.nakshatra.element,
        gan: moonNakInfo.nakshatra.gan,
        nadi: moonNakInfo.nakshatra.nadi,
        varna: moonNakInfo.nakshatra.varna,
        yoni: moonNakInfo.nakshatra.yoni
      };

      // Synchronize Vimshottari Dasha with Navamsha Moon
      baseline.dashaPeriods = calculateVimshottariDasha(
        moon.fullDegree,
        new Date(year, month - 1, day)
      );
    }

    if (sun) {
      baseline.sunSign = {
        sign: sun.zodiacSign,
        signNumber: sun.signNumber
      };
    }

    // Synchronize Aspects (Graha Drishti)
    const aspects: GrahaDrishti[] = [];
    for (const p of Object.values(baseline.planetaryPositions)) {
      const aspectsHouses: number[] = [];
      aspectsHouses.push(((p.house - 1 + 6) % 12) + 1);

      if (p.name === 'Mars') {
        aspectsHouses.push(((p.house - 1 + 3) % 12) + 1);
        aspectsHouses.push(((p.house - 1 + 7) % 12) + 1);
      } else if (p.name === 'Jupiter') {
        aspectsHouses.push(((p.house - 1 + 4) % 12) + 1);
        aspectsHouses.push(((p.house - 1 + 8) % 12) + 1);
      } else if (p.name === 'Saturn') {
        aspectsHouses.push(((p.house - 1 + 2) % 12) + 1);
        aspectsHouses.push(((p.house - 1 + 9) % 12) + 1);
      }

      const aspectedPlanets = Object.values(baseline.planetaryPositions)
        .filter(other => other.name !== p.name && aspectsHouses.includes(other.house))
        .map(other => other.name);

      aspects.push({
        planet: p.name,
        aspectsHouses,
        aspectsPlanets: aspectedPlanets
      });
    }
    baseline.aspects = aspects;

    // Synchronize Yogas & Interpretations
    baseline.yogas = calculateYogas(baseline.planetaryPositions, baseline.ascendant.signNumber);
    baseline.interpretations = generateInterpretations(
      baseline.ascendant.sign,
      moon ? moon.zodiacSign : 'Taurus',
      sun ? sun.zodiacSign : 'Aries',
      baseline.janmaNakshatra.name,
      baseline.janmaNakshatra.pada
    );

    baseline.calculationProvider = 'navamsha';
    return baseline;
  }
}

export const astrologyService = new AstrologyService();
