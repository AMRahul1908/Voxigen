import * as Astronomy from 'astronomy-engine';
import { getLahiriAyanamsha, formatDegrees } from './ayanamsha';
import { getNakshatraAndPada, getZodiacSign } from './nakshatras';
import { AscendantPosition } from '../../types/astrology.types';

/**
 * Calculates the exact Sidereal Ascendant (Lagna) in degrees (0 - 360)
 *
 * Mathematical derivation:
 * 1. Calculate Greenwich Apparent Sidereal Time (GAST) in hours.
 * 2. Convert to Local Apparent Sidereal Time (LAST / RAMC) in degrees: RAMC = (GAST * 15 + Longitude) % 360.
 * 3. True obliquity of the ecliptic eps.
 * 4. Tropical Ascendant lambda_trop:
 *    tan(lambda) = -cos(RAMC) / (sin(RAMC)*cos(eps) + tan(lat)*sin(eps))
 * 5. Sidereal Ascendant = (lambda_trop - LahiriAyanamsha + 360) % 360.
 */
export function calculateAscendant(
  utcDate: Date,
  latitude: number,
  longitude: number
): AscendantPosition {
  const astroTime = Astronomy.MakeTime(utcDate);
  const gastHours = Astronomy.SiderealTime(astroTime); // GAST in hours (0 - 24)

  // Local Sidereal Time in degrees
  let ramc = (gastHours * 15.0 + longitude) % 360;
  if (ramc < 0) ramc += 360;

  // Obliquity of ecliptic (mean obliquity with high accuracy)
  const jd = utcDate.getTime() / 86400000 + 2440587.5;
  const t = (jd - 2451545.0) / 36525.0;
  // IAU formula for true obliquity
  const epsDeg = 23.43929111 - (46.8150 * t) / 3600;

  const ramcRad = (ramc * Math.PI) / 180;
  const latRad = (latitude * Math.PI) / 180;
  const epsRad = (epsDeg * Math.PI) / 180;

  // y = -cos(RAMC)
  const y = -Math.cos(ramcRad);
  // x = sin(RAMC) * cos(eps) + tan(lat) * sin(eps)
  const x = Math.sin(ramcRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad);

  let tropAscDeg = (Math.atan2(y, x) * 180) / Math.PI;
  if (tropAscDeg < 0) tropAscDeg += 360;

  // Subtract Lahiri Ayanamsha to get Sidereal Ascendant
  const ayanamsha = getLahiriAyanamsha(utcDate);
  let siderealAscDeg = (tropAscDeg - ayanamsha) % 360;
  if (siderealAscDeg < 0) siderealAscDeg += 360;

  const { sign, normDegree } = getZodiacSign(siderealAscDeg);
  const nakInfo = getNakshatraAndPada(siderealAscDeg);

  return {
    sign: sign.name,
    signNumber: sign.number,
    signLord: sign.lord,
    fullDegree: Number(siderealAscDeg.toFixed(4)),
    normDegree: Number(normDegree.toFixed(4)),
    degreeFormatted: formatDegrees(normDegree),
    nakshatra: nakInfo.nakshatra.name,
    nakshatraPada: nakInfo.pada,
    nakshatraLord: nakInfo.nakshatra.ruler,
    element: sign.element,
    modality: sign.modality
  };
}
