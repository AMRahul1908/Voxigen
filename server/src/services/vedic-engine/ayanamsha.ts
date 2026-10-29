// Chitrapaksha (Lahiri) Ayanamsha Calculation
// Based on Indian Astronomical Ephemeris / standard IAU precession models

/**
 * Calculates the Lahiri (Chitrapaksha) Ayanamsha in degrees for a given Julian Day or Date.
 * At epoch J2000.0 (2000-01-01 12:00:00 UTC, JD 2451545.0), Lahiri Ayanamsha = 23° 51' 25.53" = 23.857092°.
 * Precession rate = 50.279" / Julian year = 0.013966° / year.
 */
export function getLahiriAyanamsha(utcDate: Date): number {
  const jd = getJulianDate(utcDate);
  const t = (jd - 2451545.0) / 36525.0; // Julian centuries since J2000.0

  // High-precision polynomial for Lahiri ayanamsha
  const ayanamsha = 23.857092 + 1.396971 * t + 0.000308 * t * t;
  return ayanamsha;
}

export function getJulianDate(date: Date): number {
  const time = date.getTime();
  return time / 86400000 + 2440587.5;
}

export function formatDegrees(deg: number): string {
  const positiveDeg = (deg % 360 + 360) % 360;
  const d = Math.floor(positiveDeg);
  const mFloat = (positiveDeg - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.round((mFloat - m) * 60);
  return `${d}° ${m.toString().padStart(2, '0')}' ${s.toString().padStart(2, '0')}"`;
}
