import { jsPDF } from 'jspdf';
import { KundaliChartData } from '../types';

export function exportKundaliPDF(data: KundaliChartData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 15;

  // Background Header Banner
  doc.setFillColor(16, 19, 41); // #101329 Midnight Navy
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Gold accent line
  doc.setDrawColor(214, 180, 106); // #D6B46A
  doc.setLineWidth(1);
  doc.line(0, 38, pageWidth, 38);

  // Brand Name & Tagline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(214, 180, 106); // Gold
  doc.text('VOXIGEN', margin, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(255, 248, 233); // Ivory
  doc.text('Vedic Janam Kundali Report', margin, 26);

  doc.setFontSize(8);
  doc.setTextColor(233, 225, 245);
  doc.text(`Chart ID: ${data.chartId} | System: Lahiri Nirayana`, margin, 32);

  y = 48;

  // --- 1. Native's Personal & Birth Details ---
  doc.setFillColor(33, 27, 69); // Indigo
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 28, 3, 3, 'F');
  doc.setDrawColor(214, 180, 106);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 28, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 248, 233);
  doc.text(data.name, margin + 5, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(233, 225, 245);
  doc.text(`Date of Birth: ${data.birthDate}`, margin + 5, y + 16);
  doc.text(`Time of Birth: ${data.birthTimeUnknown ? 'Time Unknown (Noon Analysis)' : data.birthTime}`, margin + 5, y + 22);

  doc.text(`Place of Birth: ${data.birthPlace}`, margin + 85, y + 16);
  doc.text(`Timezone: UTC ${data.timeZone >= 0 ? '+' : ''}${data.timeZone}`, margin + 85, y + 22);

  y += 36;

  // --- 2. Core Astrological Identifiers ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(16, 19, 41);
  doc.text('PRIMARY ASTROLOGICAL IDENTIFIERS', margin, y);
  y += 4;

  const colWidth = (pageWidth - 2 * margin - 9) / 4;
  const metrics = [
    { label: 'Ascendant (Lagna)', val: data.ascendant.sign, sub: data.ascendant.degreeFormatted },
    { label: 'Moon Sign (Rashi)', val: data.moonSign.sign, sub: `Lord: ${data.moonSign.nakshatraLord}` },
    { label: 'Sun Sign (Surya)', val: data.sunSign.sign, sub: `House ${data.planetaryPositions.Sun?.house || 1}` },
    { label: 'Janma Nakshatra', val: data.janmaNakshatra.name, sub: `Pada ${data.janmaNakshatra.pada} (${data.janmaNakshatra.deity})` }
  ];

  metrics.forEach((m, idx) => {
    const bx = margin + idx * (colWidth + 3);
    doc.setFillColor(245, 243, 250);
    doc.roundedRect(bx, y, colWidth, 18, 2, 2, 'F');
    doc.setDrawColor(210, 205, 225);
    doc.setLineWidth(0.2);
    doc.roundedRect(bx, y, colWidth, 18, 2, 2, 'D');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(90, 80, 120);
    doc.text(m.label, bx + 3, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(16, 19, 41);
    doc.text(m.val, bx + 3, y + 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(120, 110, 140);
    doc.text(m.sub, bx + 3, y + 15);
  });

  y += 26;

  // --- 3. Planetary Positions Table ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(16, 19, 41);
  doc.text('PLANETARY POSITIONS (GRAHA STHITI)', margin, y);
  y += 4;

  // Table Header
  doc.setFillColor(33, 27, 69);
  doc.rect(margin, y, pageWidth - 2 * margin, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(214, 180, 106);

  doc.text('Planet', margin + 3, y + 5);
  doc.text('Zodiac Sign', margin + 35, y + 5);
  doc.text('House', margin + 70, y + 5);
  doc.text('Degrees', margin + 90, y + 5);
  doc.text('Nakshatra (Pada)', margin + 120, y + 5);
  doc.text('Status / Dignity', margin + 155, y + 5);

  y += 7;

  // Table Rows
  const planets = Object.values(data.planetaryPositions);
  planets.forEach((p, index) => {
    const isEven = index % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 246, isEven ? 255 : 252);
    doc.rect(margin, y, pageWidth - 2 * margin, 6.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(20, 20, 30);
    doc.text(`${p.name} (${p.symbol})`, margin + 3, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.text(p.zodiacSign, margin + 35, y + 4.5);
    doc.text(`House ${p.house}`, margin + 70, y + 4.5);
    doc.text(p.degreeFormatted, margin + 90, y + 4.5);
    doc.text(`${p.nakshatra} (${p.nakshatraPada})`, margin + 120, y + 4.5);

    const statusText = [
      p.isRetrograde ? 'Retro' : '',
      p.isCombust ? 'Combust' : '',
      p.dignity !== 'Neutral' ? p.dignity : ''
    ].filter(Boolean).join(' • ') || 'Direct';
    doc.text(statusText, margin + 155, y + 4.5);

    y += 6.5;
  });

  y += 8;

  // --- 4. Vimshottari Dasha Summary ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(16, 19, 41);
  doc.text('VIMSHOTTARI DASHA TIMELINE', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(40, 40, 50);
  doc.text(`Birth Balance Lord: ${data.dashaPeriods.birthBalance.rulingPlanet} (${data.dashaPeriods.birthBalance.yearsRemaining} years remaining at birth)`, margin, y);
  doc.text(`Active Now: ${data.dashaPeriods.currentMahadasha} Mahadasha / ${data.dashaPeriods.currentAntardasha} Antardasha`, margin + 100, y);
  y += 7;

  // Render first 5 Mahadashas
  const dashaColW = (pageWidth - 2 * margin - 8) / 5;
  data.dashaPeriods.timeline.slice(0, 5).forEach((d, i) => {
    const dx = margin + i * (dashaColW + 2);
    doc.setFillColor(d.isCurrent ? 245 : 252, d.isCurrent ? 240 : 250, d.isCurrent ? 220 : 255);
    doc.roundedRect(dx, y, dashaColW, 14, 1.5, 1.5, 'F');
    doc.setDrawColor(d.isCurrent ? 214 : 220, d.isCurrent ? 180 : 220, d.isCurrent ? 106 : 220);
    doc.setLineWidth(0.3);
    doc.roundedRect(dx, y, dashaColW, 14, 1.5, 1.5, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(d.isCurrent ? 140 : 20, d.isCurrent ? 90 : 20, d.isCurrent ? 0 : 30);
    doc.text(`${d.planet} (${d.durationYears}y)`, dx + 2.5, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(90, 90, 100);
    doc.text(`${d.startDate.substring(0, 4)} - ${d.endDate.substring(0, 4)}`, dx + 2.5, y + 10);
  });

  y += 20;

  // --- 5. Key Yogas Summary ---
  if (data.yogas && data.yogas.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(16, 19, 41);
    doc.text('KEY AUSPICIOUS VEDIC YOGAS', margin, y);
    y += 5;

    data.yogas.slice(0, 3).forEach(yoga => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(76, 42, 133); // Royal Purple
      doc.text(`• ${yoga.name} (${yoga.category}):`, margin + 2, y);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 40, 50);
      const yogaText = `${yoga.description} ${yoga.effects}`;
      const splitText = doc.splitTextToSize(yogaText, pageWidth - 2 * margin - 10);
      doc.text(splitText, margin + 4, y + 4.5);
      y += 5 + splitText.length * 4;
    });
  }

  // Footer Disclaimer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(130, 130, 140);
  doc.text(
    'Generated by Voxigen (https://voxigen.astro) • Vedic calculations powered by Lahiri Ayanamsha & high-precision astronomical algorithms.',
    margin,
    285
  );

  doc.save(`Voxigen_Kundali_${data.name.replace(/\s+/g, '_')}_${data.chartId}.pdf`);
}
