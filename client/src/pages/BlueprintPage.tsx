import React, { FormEvent, useRef, useState } from 'react';
import { AlertTriangle, Download, LoaderCircle, Sparkles } from 'lucide-react';
import { CityAutocomplete } from '../components/CityAutocomplete';
import { LocationItem } from '../types';

type ChartKind = 'humandesign' | 'genekeys';
type BirthDetails = { name: string; date: string; time: string; place: string };

const API_ROOT = 'https://freehumandesign.blvckstudios.com/api';

function titleCase(value: string) {
  return value.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function ChartSection({ title, value }: { title: string; value: unknown }) {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'object') {
    return <div className="rounded-xl bg-cosmic-navy/60 border border-cosmic-border-subtle p-4"><p className="text-[11px] uppercase tracking-wider text-cosmic-lavender/60">{title}</p><p className="mt-1 text-sm font-semibold text-cosmic-ivory break-words">{String(value)}</p></div>;
  }
  if (Array.isArray(value)) {
    return <div className="rounded-xl bg-cosmic-navy/60 border border-cosmic-border-subtle p-4"><h3 className="text-xs uppercase tracking-wider text-cosmic-gold mb-3">{title}</h3><div className="flex flex-wrap gap-2">{value.length ? value.map((item, i) => <span key={i} className="rounded-lg bg-cosmic-purple/30 border border-cosmic-border-subtle px-3 py-1.5 text-xs text-cosmic-ivory">{typeof item === 'object' ? JSON.stringify(item) : String(item)}</span>) : <span className="text-xs text-cosmic-lavender/60">None</span>}</div></div>;
  }
  const entries = Object.entries(value as Record<string, unknown>).filter(([, item]) => item !== undefined && item !== null);
  if (!entries.length) return null;
  return <section className="rounded-2xl bg-cosmic-card border border-cosmic-border-subtle p-5 md:p-6"><h3 className="font-display text-lg font-semibold text-cosmic-gold mb-4">{title}</h3><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{entries.map(([key, item]) => <ChartSection key={key} title={titleCase(key)} value={item} />)}</div></section>;
}

function displayValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(displayValue).filter(Boolean).join(', ');
  return Object.entries(value as Record<string, unknown>)
    .filter(([, item]) => item !== null && item !== undefined && typeof item !== 'object')
    .map(([key, item]) => `${titleCase(key)}: ${String(item)}`).join(' · ');
}

function downloadDisplayedReport(element: HTMLElement | null, filename: string, language = 'en') {
  if (!element) return;
  const clone = element.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.report-exclude').forEach(item => item.remove());
  const css = Array.from(document.styleSheets).flatMap(sheet => {
    try { return Array.from(sheet.cssRules, rule => rule.cssText); } catch { return []; }
  }).join('\n');
  const html = `<!doctype html><html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Voxigen Chart Report</title><style>${css}\n@page{size:A4;margin:12mm}.report-print{position:fixed;top:16px;right:16px;z-index:9999;border:0;border-radius:8px;background:#66509a;color:#fff;padding:10px 14px;font:600 14px Arial,sans-serif;cursor:pointer}@media print{body{background:#fff!important}.report-content{box-shadow:none!important}.report-print{display:none}}</style></head><body><button class="report-print" onclick="window.print()">Print / Save as PDF</button><main class="report-content">${clone.outerHTML}</main></body></html>`;
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function DownloadReportButton({ onClick }: { onClick: () => void }) {
  return <button type="button" onClick={onClick} className="inline-flex items-center gap-2 rounded-xl bg-cosmic-gold px-4 py-2.5 text-sm font-semibold text-cosmic-navy transition-colors hover:bg-cosmic-gold-light"><Download className="h-4 w-4" />Download Report</button>;
}

const PLANET_GLYPHS: Record<string, string> = { sun: '☉', earth: '⊕', moon: '☾', north_node: '☊', south_node: '☋', mercury: '☿', venus: '♀', mars: '♂', jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇' };
const CENTER_POSITIONS: Record<string, [number, number]> = { head: [150, 28], ajna: [150, 92], throat: [150, 164], g: [150, 246], heart: [202, 319], spleen: [90, 350], sacral: [150, 371], solarplexus: [210, 350], root: [150, 442] };
const CENTER_LABELS: Record<string, string> = { head: 'Head', ajna: 'Ajna', throat: 'Throat', g: 'G / Identity', heart: 'Heart / Ego', spleen: 'Spleen', sacral: 'Sacral', solarplexus: 'Solar Plexus', root: 'Root' };
const CENTER_SHAPES: Record<string, string> = {
  head: '150,5 185,65 115,65', ajna: '150,62 185,92 150,122 115,92', throat: '120,132 180,132 180,192 120,192',
  g: '150,207 192,246 150,285 108,246', heart: '202,298 225,319 202,340 179,319',
  spleen: '90,324 115,340 115,371 90,387 65,371 65,340', sacral: '120,344 180,344 180,398 120,398',
  solarplexus: '210,324 235,340 235,371 210,387 185,371 185,340', root: '150,416 185,442 150,468 115,442'
};

function activationEntries(data: Record<string, unknown>, side: 'personality' | 'design'): Array<{ body: string; gate: unknown; line: unknown; retrograde: boolean }> {
  const activations = data.activations as Record<string, unknown> | undefined;
  const raw = activations?.[side];
  if (Array.isArray(raw)) return raw.map((entry: any) => ({ body: String(entry.body ?? entry.planet?.name ?? ''), gate: entry.gate ?? entry.hexagram, line: entry.line, retrograde: Boolean(entry.retrograde) })).filter(item => item.body);
  const legacyKey = side === 'personality' ? 'p_' : 'd_';
  const legacy = data[legacyKey] as Record<string, any> | undefined;
  return Object.entries(legacy || {}).map(([body, entry]) => ({ body, gate: entry?.gate ?? entry?.hexagram, line: entry?.line, retrograde: Boolean(entry?.retrograde) }));
}

function incarnationCross(data: Record<string, unknown>): string {
  const given = data.incarnationCross ?? data.incarnation_cross;
  if (given) return displayValue(given);
  const personality = activationEntries(data, 'personality');
  const design = activationEntries(data, 'design');
  const findGate = (items: typeof personality, body: string) => items.find(item => item.body.toLowerCase().replace(/\s+/g, '_') === body)?.gate;
  const pSun = findGate(personality, 'sun');
  const pEarth = findGate(personality, 'earth');
  const dSun = findGate(design, 'sun');
  const dEarth = findGate(design, 'earth');
  if ([pSun, pEarth, dSun, dEarth].some(value => value === undefined)) return '';
  const profile = String(data.profile || '');
  const profileFirst = Number(profile.split('/')[0]);
  const profileSecond = Number(profile.split('/')[1]);
  const angle = profileFirst === 4 && profileSecond === 1 ? 'Juxtaposition Cross' : [5, 6].includes(profileFirst) ? 'Left Angle Cross' : 'Right Angle Cross';
  return `${angle} (${pSun}/${pEarth} | ${dSun}/${dEarth})`;
}

function HumanDesignBodygraph({ data }: { data: Record<string, unknown> }) {
  const channels = Array.isArray(data.definedChannels) ? data.definedChannels as Array<{ key?: string; gates?: number[]; centers?: string[]; name?: string }> : [];
  const defined = new Set(Array.isArray(data.definedCenters) ? data.definedCenters.map(String) : []);
  const personality = activationEntries(data, 'personality');
  const design = activationEntries(data, 'design');
  return <div className="rounded-2xl border border-cosmic-border-subtle bg-[#f8f8fa] p-2 sm:p-4">
    <svg viewBox="0 0 300 475" role="img" aria-label="Human Design bodygraph showing defined centers and channels" className="mx-auto h-auto w-full max-w-[430px]">
      <defs><linearGradient id="bodygraph-silhouette" x1="0" x2="1"><stop offset="0" stopColor="#e9e9ec" /><stop offset=".5" stopColor="#f1f1f3" /><stop offset="1" stopColor="#e5e5e8" /></linearGradient><filter id="center-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#111827" floodOpacity=".12" /></filter></defs>
      <path d="M150 9 C119 9 101 29 104 57 C105 78 111 96 102 116 C90 140 68 154 61 184 C54 214 57 246 45 273 C31 305 34 355 48 391 C59 421 79 447 105 462 C122 472 178 472 195 462 C221 447 241 421 252 391 C266 355 269 305 255 273 C243 246 246 214 239 184 C232 154 210 140 198 116 C189 96 195 78 196 57 C199 29 181 9 150 9Z" fill="url(#bodygraph-silhouette)" />
      <path d="M150 21 C126 21 115 36 117 57 C119 78 125 96 115 121 M150 21 C174 21 185 36 183 57 C181 78 175 96 185 121 M78 176 C102 159 118 148 125 129 M222 176 C198 159 182 148 175 129 M55 288 C82 270 102 259 112 244 M245 288 C218 270 198 259 188 244 M70 385 C98 368 112 355 121 342 M230 385 C202 368 188 355 179 342" fill="none" stroke="#fff" strokeWidth="8" opacity=".9" />
      {channels.map((channel, index) => {
        const centers = channel.centers || [];
        const [from, to] = centers.map(center => CENTER_POSITIONS[center]) as ([number, number] | undefined)[];
        if (!from || !to) return null;
        const activated = new Set([...personality, ...design].map(item => Number(item.gate)));
        const gatePair = channel.gates || (channel.key || '').split('-').map(Number);
        const p = gatePair.every(gate => personality.some(item => Number(item.gate) === gate));
        const d = gatePair.every(gate => design.some(item => Number(item.gate) === gate));
        const color = p && d ? '#66514b' : p ? '#26242a' : d ? '#d95353' : '#c5c5c9';
        return <g key={channel.key || index}><line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke="#fff" strokeWidth="14" strokeLinecap="round" /><line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke={color} strokeWidth="8" strokeLinecap="round" />{gatePair.map((gate, i) => { const cx = from[0] + (to[0] - from[0]) * (i + 1) / 3; const cy = from[1] + (to[1] - from[1]) * (i + 1) / 3; return <g key={`${gate}-${i}`}><circle cx={cx} cy={cy} r="8" fill={activated.has(gate) ? '#608ba0' : '#fff'} stroke="#fff" strokeWidth="2" /><text x={cx} y={cy + 2.7} textAnchor="middle" fontSize="7" fontWeight="700" fill={activated.has(gate) ? '#fff' : '#64748b'}>{gate}</text></g>; })}</g>;
      })}
      {Object.entries(CENTER_SHAPES).map(([center, points]) => <g key={center} filter="url(#center-shadow)"><polygon points={points} fill={defined.has(center) ? (center === 'sacral' ? '#d94a4a' : center === 'g' ? '#f5e77c' : center === 'throat' ? '#78534c' : '#66534d') : '#fff'} stroke={defined.has(center) ? '#fff' : '#dedee2'} strokeWidth="2.5" /><text x={CENTER_POSITIONS[center][0]} y={CENTER_POSITIONS[center][1] + 4} textAnchor="middle" fontSize="9" fontWeight="700" fill={defined.has(center) ? (center === 'g' ? '#755b18' : '#fff') : '#96969c'}>{CENTER_LABELS[center]}</text></g>)}
    </svg>
    <div className="mt-2 flex justify-center gap-4 text-[10px] text-slate-600"><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-[#26242a]" />Personality</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-[#d95353]" />Design</span></div>
  </div>;
}

function ActivationColumn({ title, side, data }: { title: string; side: 'personality' | 'design'; data: Record<string, unknown> }) {
  const entries = activationEntries(data, side);
  return <section className="min-w-0 px-1"><h3 className={`mb-4 border-b-[3px] pb-2 text-center text-[10px] font-bold uppercase tracking-wider ${side === 'design' ? 'border-rose-400 text-rose-500' : 'border-slate-800 text-slate-800'}`}>{title}</h3>
    {entries.length ? <ol className="space-y-3">{entries.map((entry, index) => { const bodyKey = entry.body.toLowerCase().replace(/\s+/g, '_'); return <li key={`${bodyKey}-${index}`} className={`flex items-center gap-1.5 font-semibold ${side === 'design' ? 'justify-start text-rose-500' : 'justify-end text-slate-800'}`} title={`${title} ${entry.body}${entry.retrograde ? ' (retrograde)' : ''}`}><span className="text-[10px] tabular-nums">{String(entry.gate)}{entry.line !== undefined ? `.${String(entry.line)}` : ''}</span><span className="text-sm" aria-label={entry.body}>{PLANET_GLYPHS[bodyKey] || '·'}</span>{entry.retrograde && <span className="text-[9px] text-slate-500">R</span>}</li>; })}</ol> : <p className="text-center text-xs text-slate-500">No activations</p>}
  </section>;
}

function HumanDesignChart({ data, name, date, time, place, utc }: { data: Record<string, unknown>; name: string; date: string; time: string; place: string; utc?: string }) {
  const reportRef = useRef<HTMLDivElement>(null);
  const type = String(data.type || '');
  const typeProperties: Record<string, [string, string, string]> = {
    'Manifesting Generator': ['Wait to Respond', 'Satisfaction', 'Frustration'], Generator: ['Wait to Respond', 'Satisfaction', 'Frustration'],
    Manifestor: ['Inform', 'Peace', 'Anger'], Projector: ['Wait for the Invitation', 'Success', 'Bitterness'], Reflector: ['Wait a Lunar Cycle', 'Surprise', 'Disappointment']
  };
  const [defaultStrategy, defaultSignature, defaultNotSelf] = typeProperties[type] || ['', '', ''];
  const properties: Array<[string, unknown]> = ([
    ['Name', name], ['Date and Time (Local)', `${date} · ${time}`],
    ['Date and Time (UTC)', utc || ''],
    ['Location', place], ['Type', data.type], ['Strategy', data.strategy || defaultStrategy], ['Signature', data.signature || defaultSignature], ['Not-Self Theme', data.notSelfTheme ?? data.not_self_theme ?? defaultNotSelf],
    ['Authority', data.authority], ['Definition', data.definition], ['Incarnation Cross', incarnationCross(data)], ['Profile', data.profile], ['Variable', data.variable], ['Channel Count', data.channelCount], ['Definition Groups', data.definitionGroups]
  ] as Array<[string, unknown]>).filter(([, value]) => value !== undefined && value !== null && value !== '');
  const birthProperties = properties.filter(([label]) => ['Name', 'Date and Time (Local)', 'Date and Time (UTC)', 'Location'].includes(label));
  const chartProperties = properties.filter(([label]) => !['Name', 'Date and Time (Local)', 'Date and Time (UTC)', 'Location'].includes(label));
  const downloadHumanDesignReport = () => downloadDisplayedReport(reportRef.current, `Voxigen_Human_Design_${name.trim().replace(/\s+/g, '_') || 'Profile'}.html`);
  return <div ref={reportRef} className="space-y-6 rounded-3xl bg-white p-4 text-slate-900 shadow-xl sm:p-6">
    <div className="report-exclude flex justify-end"><DownloadReportButton onClick={downloadHumanDesignReport} /></div>
    <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-xl text-slate-700">←</div><h3 className="text-xl font-bold uppercase">Properties</h3></div>
    <div className="grid gap-6 xl:grid-cols-[minmax(340px,1.15fr)_minmax(90px,.34fr)_minmax(340px,1fr)_minmax(90px,.34fr)]">
      <section className="min-w-0"><h4 className="mb-4 text-sm font-semibold text-slate-500">Birth Data</h4><dl className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">{birthProperties.map(([label, value]) => <div key={label} className="min-w-0"><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 break-words text-sm font-semibold text-slate-800">{displayValue(value)}</dd></div>)}</dl><h4 className="mb-4 mt-7 text-sm font-semibold text-slate-500">Properties</h4><dl className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">{chartProperties.map(([label, value]) => <div key={label} className="min-w-0"><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 break-words text-sm font-semibold text-slate-800">{displayValue(value)}</dd></div>)}</dl><div className="mt-6 grid gap-4 sm:grid-cols-2">{Array.isArray(data.definedCenters) && <ChartSection title="Defined Centers" value={data.definedCenters} />}{Array.isArray(data.openCenters) && <ChartSection title="Open Centers" value={data.openCenters} />}{Array.isArray(data.definedChannels) && <ChartSection title="Defined Channels" value={data.definedChannels.map((channel: any) => channel.name ? `${channel.key} · ${channel.name}` : channel.key)} />}{Array.isArray(data.activatedGates) && <ChartSection title="Activated Gates" value={data.activatedGates} />}</div></section>
      <ActivationColumn title="Design" side="design" data={data} />
      <HumanDesignBodygraph data={data} />
      <ActivationColumn title="Personality" side="personality" data={data} />
    </div>
  </div>;
}

type SphereInfo = { key: string; title: string; prompt: string; gk: string; line: string; group: 'activation' | 'venus' | 'pearl'; x: number; y: number };
const SPHERE_INFO: Record<string, Omit<SphereInfo, 'key' | 'gk' | 'line' | 'x' | 'y'>> = {
  lifeswork: { title: "Life's Work", prompt: "What I'm here to do", group: 'activation' },
  evolution: { title: 'Evolution', prompt: "What I'm here to learn", group: 'activation' },
  radiance: { title: 'Radiance', prompt: 'What keeps me healthy', group: 'activation' },
  purpose: { title: 'Purpose', prompt: 'What deeply fulfils me', group: 'activation' },
  attraction: { title: 'Attraction', prompt: 'What draws me into relationship', group: 'venus' },
  iq: { title: 'IQ', prompt: 'My mental patterns', group: 'venus' },
  eq: { title: 'EQ', prompt: 'My emotional patterns', group: 'venus' },
  sq: { title: 'SQ', prompt: 'My heart’s intelligence', group: 'venus' },
  core: { title: 'Core / Vocation', prompt: 'The wound that becomes my vocation', group: 'venus' },
  culture: { title: 'Culture', prompt: 'How I thrive in community', group: 'pearl' },
  stability: { title: 'Stability', prompt: 'What grounds my prosperity', group: 'pearl' },
  creativity: { title: 'Creativity', prompt: 'My creative contribution', group: 'pearl' },
  relating: { title: 'Relating', prompt: 'How I connect with others', group: 'pearl' },
  pearl: { title: 'Pearl', prompt: 'The essence of my prosperity', group: 'pearl' }
};
const SPHERE_ORDER = ['lifeswork', 'evolution', 'radiance', 'purpose', 'attraction', 'iq', 'eq', 'sq', 'core', 'culture', 'stability', 'creativity', 'relating', 'pearl'];
const SEQUENCES = {
  full: { title: 'Full Profile', button: 'Full', spheres: SPHERE_ORDER },
  genius: { title: 'Activation Sequence', button: 'Genius', spheres: ['lifeswork', 'evolution', 'radiance', 'purpose'] },
  love: { title: 'Venus Sequence', button: 'Love', spheres: ['attraction', 'iq', 'eq', 'sq', 'core'] },
  prosperity: { title: 'Pearl Sequence', button: 'Prosperity', spheres: ['core', 'culture', 'lifeswork', 'pearl'] },
  harmony: { title: 'Star Pearl', button: 'Harmony', spheres: ['lifeswork', 'pearl', 'culture', 'creativity', 'relating', 'stability', 'core'] }
} as const;
const SPHERE_POSITIONS: Record<string, [number, number]> = {
  lifeswork: [500, 80], evolution: [735, 205], radiance: [265, 205], purpose: [500, 520],
  attraction: [500, 365], iq: [350, 365], eq: [650, 365], sq: [500, 285], core: [350, 235],
  pearl: [500, 155], culture: [650, 235], creativity: [350, 455], relating: [650, 455], stability: [500, 455]
};
const VIEW_POSITIONS: Record<keyof typeof SEQUENCES, Record<string, [number, number]>> = {
  full: SPHERE_POSITIONS,
  genius: { lifeswork: [500, 95], evolution: [710, 300], radiance: [290, 300], purpose: [500, 495] },
  love: { core: [355, 205], sq: [500, 155], iq: [355, 325], eq: [645, 325], attraction: [500, 435] },
  prosperity: { lifeswork: [500, 115], pearl: [500, 275], culture: [700, 390], core: [300, 390] },
  harmony: { lifeswork: [500, 90], pearl: [500, 250], creativity: [335, 190], relating: [665, 190], core: [335, 390], culture: [665, 390], stability: [500, 485] }
};
const SPHERE_COLORS: Record<SphereInfo['group'], string> = { activation: '#70a56e', venus: '#d24d48', pearl: '#4d8fd7' };
const SPHERE_GUIDANCE: Record<string, string> = {
  'lifeswork:29': 'Stay open to a life that unfolds in unexpected ways. Commit to each moment and make the next clear choice instead of trying to control a final destination.',
  'evolution:30': 'Meet desire and relationships wholeheartedly. Let lived emotional experience teach you, and hold nothing back from being human.',
  'radiance:8': 'Protect and express what makes you unique in how you live and create. Choose what feels true to you instead of copying someone else’s image.',
  'purpose:14': 'Your power grows when you follow work you love. Empowering others can arise naturally from that passion, without needing to make it your agenda.'
};
const SPHERE_GUIDANCE_KN: Record<string, string> = {
  'lifeswork:29': 'ನಿಮ್ಮ ಜೀವನವು ಅನಿರೀಕ್ಷಿತ ರೀತಿಯಲ್ಲಿ ತೆರೆದುಕೊಳ್ಳಲು ಅವಕಾಶ ನೀಡಿ. ಪ್ರತಿಯೊಂದು ಕ್ಷಣಕ್ಕೂ ಬದ್ಧರಾಗಿ, ಅಂತಿಮ ಗುರಿಯನ್ನು ನಿಯಂತ್ರಿಸಲು ಪ್ರಯತ್ನಿಸುವ ಬದಲು ಮುಂದಿನ ಸ್ಪಷ್ಟ ಹೆಜ್ಜೆಯನ್ನು ಆರಿಸಿ.',
  'evolution:30': 'ಬಯಕೆ ಮತ್ತು ಸಂಬಂಧಗಳನ್ನು ಪೂರ್ಣ ಮನಸ್ಸಿನಿಂದ ಅನುಭವಿಸಿ. ಬದುಕಿನ ಅನುಭವಗಳಿಂದ ಕಲಿಯಿರಿ ಮತ್ತು ಮಾನವೀಯ ಅನುಭವಗಳಿಂದ ದೂರ ಸರಿಯಬೇಡಿ.',
  'radiance:8': 'ನಿಮ್ಮ ವೈಶಿಷ್ಟ್ಯವನ್ನು ನಿಮ್ಮ ಜೀವನ ಮತ್ತು ಸೃಜನಶೀಲತೆಯಲ್ಲಿ ವ್ಯಕ್ತಪಡಿಸಿ. ಇತರರನ್ನು ಅನುಕರಿಸುವ ಬದಲು ನಿಮಗೆ ಸತ್ಯವೆನಿಸುವುದನ್ನು ಆರಿಸಿ.',
  'purpose:14': 'ನೀವು ಪ್ರೀತಿಸುವ ಕೆಲಸವನ್ನು ಅನುಸರಿಸಿದಾಗ ನಿಮ್ಮ ಶಕ್ತಿ ಬೆಳೆಯುತ್ತದೆ. ಆ ಉತ್ಸಾಹದಿಂದ ಇತರರಿಗೆ ಸಹಜವಾಗಿ ಶಕ್ತಿ ನೀಡಬಹುದು.'
};
const GENE_KEYS_COPY = {
  en: { profile: 'My Hologenetic Profile', heading: 'My', selected: 'Selected sphere', line: 'Line', key: 'Gene Key', sequence: 'Explore each sphere in this sequence. Select a sphere to focus it.', noSpheres: 'The API response did not include Gene Keys sphere values.', prompts: { lifeswork: "What I'm here to do", evolution: "What I'm here to learn", radiance: 'What keeps me healthy', purpose: 'What deeply fulfils me', attraction: 'What draws me into relationship', iq: 'My mental patterns', eq: 'My emotional patterns', sq: "My heart's intelligence", core: 'The wound that becomes my vocation', culture: 'How I thrive in community', stability: 'What grounds my prosperity', creativity: 'My creative contribution', relating: 'How I connect with others', pearl: 'The essence of my prosperity' }, labels: { lifeswork: "Life's Work", evolution: 'Evolution', radiance: 'Radiance', purpose: 'Purpose', attraction: 'Attraction', iq: 'IQ', eq: 'EQ', sq: 'SQ', core: 'Core / Vocation', culture: 'Culture', stability: 'Stability', creativity: 'Creativity', relating: 'Relating', pearl: 'Pearl' } },
  kn: { profile: 'ನನ್ನ ಹೊಲೊಜೆನೆಟಿಕ್ ಪ್ರೊಫೈಲ್', heading: 'ನನ್ನ', selected: 'ಆಯ್ದ ಗೋಳ', line: 'ಸಾಲು', key: 'ಜೀನ್ ಕೀ', sequence: 'ಈ ಕ್ರಮದಲ್ಲಿನ ಪ್ರತಿ ಗೋಳವನ್ನು ಅನ್ವೇಷಿಸಿ. ಗಮನಿಸಲು ಗೋಳವನ್ನು ಆಯ್ಕೆಮಾಡಿ.', noSpheres: 'API ಪ್ರತಿಕ್ರಿಯೆಯಲ್ಲಿ ಜೀನ್ ಕೀ ಗೋಳದ ಮೌಲ್ಯಗಳು ಇಲ್ಲ.', prompts: { lifeswork: 'ನಾನು ಮಾಡಲು ಬಂದಿರುವುದು', evolution: 'ನಾನು ಕಲಿಯಲು ಬಂದಿರುವುದು', radiance: 'ನನ್ನ ಆರೋಗ್ಯವನ್ನು ಕಾಪಾಡುವುದು', purpose: 'ನನಗೆ ಆಳವಾದ ತೃಪ್ತಿ ನೀಡುವುದು', attraction: 'ಸಂಬಂಧಗಳತ್ತ ನನ್ನನ್ನು ಸೆಳೆಯುವುದು', iq: 'ನನ್ನ ಮಾನಸಿಕ ಮಾದರಿಗಳು', eq: 'ನನ್ನ ಭಾವನಾತ್ಮಕ ಮಾದರಿಗಳು', sq: 'ನನ್ನ ಹೃದಯದ ಜ್ಞಾನ', core: 'ನನ್ನ ವೃತ್ತಿಯಾಗುವ ಗಾಯ', culture: 'ಸಮುದಾಯದಲ್ಲಿ ನಾನು ಅರಳುವ ರೀತಿ', stability: 'ನನ್ನ ಸಮೃದ್ಧಿಗೆ ಆಧಾರ', creativity: 'ನನ್ನ ಸೃಜನಶೀಲ ಕೊಡುಗೆ', relating: 'ನಾನು ಇತರರೊಂದಿಗೆ ಬೆರೆಯುವ ರೀತಿ', pearl: 'ನನ್ನ ಸಮೃದ್ಧಿಯ ಸಾರ' }, labels: { lifeswork: 'ಜೀವನದ ಕೆಲಸ', evolution: 'ವಿಕಾಸ', radiance: 'ಪ್ರಭೆ', purpose: 'ಉದ್ದೇಶ', attraction: 'ಆಕರ್ಷಣೆ', iq: 'ಬುದ್ಧಿಶಕ್ತಿ', eq: 'ಭಾವನಾತ್ಮಕ ಬುದ್ಧಿಶಕ್ತಿ', sq: 'ಹೃದಯದ ಬುದ್ಧಿಶಕ್ತಿ', core: 'ಮೂಲ / ವೃತ್ತಿ', culture: 'ಸಂಸ್ಕೃತಿ', stability: 'ಸ್ಥಿರತೆ', creativity: 'ಸೃಜನಶೀಲತೆ', relating: 'ಸಂಬಂಧಗಳು', pearl: 'ಮುತ್ತು' } }
};
const SPHERE_EDGES: Array<[string, string]> = [
  ['lifeswork', 'radiance'], ['lifeswork', 'evolution'], ['radiance', 'evolution'], ['radiance', 'purpose'], ['evolution', 'purpose'],
  ['attraction', 'iq'], ['attraction', 'eq'], ['iq', 'eq'], ['iq', 'sq'], ['eq', 'sq'], ['sq', 'core'], ['attraction', 'core'],
  ['lifeswork', 'pearl'], ['pearl', 'culture'], ['culture', 'core'], ['core', 'lifeswork'],
  ['culture', 'relating'], ['relating', 'stability'], ['stability', 'creativity'], ['creativity', 'core']
];

function parseSphere(value: unknown): { gk: string; line: string } | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number' || typeof value === 'string') {
    const [gk, line] = String(value).split('.');
    return { gk, line: line || '—' };
  }
  if (typeof value !== 'object') return null;
  const item = value as Record<string, unknown>;
  const gk = item.gk ?? item.geneKey ?? item.gene_key ?? item.gate ?? item.hexagram ?? item.key;
  const line = item.line;
  return gk === undefined ? null : { gk: String(gk), line: line === undefined ? '—' : String(line) };
}

function sphereValue(source: Record<string, unknown>, key: string): unknown {
  const aliases: Record<string, string[]> = {
    lifeswork: ['lifeswork', 'lifesWork', 'lifework', 'lifeWork', 'lifes_work', 'life_s_work'],
    stability: ['stability', 'coreStability', 'core_stability'],
    core: ['core', 'vocation'],
    pearl: ['pearl'], evolution: ['evolution'], radiance: ['radiance'], purpose: ['purpose'],
    attraction: ['attraction'], iq: ['iq'], eq: ['eq'], sq: ['sq'], culture: ['culture'], creativity: ['creativity'], relating: ['relating']
  };
  for (const alias of aliases[key] || [key]) if (source[alias] !== undefined) return source[alias];
  return undefined;
}

function GeneKeysResults({ data, name, date, time, place }: { data: Record<string, unknown>; name: string; date: string; time: string; place: string }) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [language, setLanguage] = useState<'en' | 'kn'>('en');
  const copy = GENE_KEYS_COPY[language];
  const nestedProfile = data.profile && typeof data.profile === 'object' ? data.profile as Record<string, unknown> : undefined;
  const nestedGeneKeys = data.geneKeys && typeof data.geneKeys === 'object' ? data.geneKeys as Record<string, unknown> : undefined;
  const sphereContainer = (data.spheres || nestedProfile?.spheres || nestedGeneKeys?.spheres) as Record<string, unknown> | undefined;
  const spheresData = sphereContainer || data;
  const spheres = SPHERE_ORDER.flatMap(key => {
    const parsed = parseSphere(sphereValue(spheresData, key));
    if (!parsed) return [];
    return [{ key, ...SPHERE_INFO[key], ...parsed, x: SPHERE_POSITIONS[key][0], y: SPHERE_POSITIONS[key][1] }];
  });
  const [sequence, setSequence] = useState<keyof typeof SEQUENCES>('full');
  const visible = SEQUENCES[sequence].spheres.flatMap(key => spheres.filter(sphere => sphere.key === key));
  const [selectedSphere, setSelectedSphere] = useState('lifeswork');
  const selected = visible.find(sphere => sphere.key === selectedSphere) || visible[0];
  const visibleKeys = new Set(visible.map(sphere => sphere.key));
  const edges = SPHERE_EDGES.filter(([from, to]) => visibleKeys.has(from) && visibleKeys.has(to));
  const sequenceColor: Record<keyof typeof SEQUENCES, string> = { full: '', genius: '#70a56e', love: '#d24d48', prosperity: '#4d8fd7', harmony: '#4d8fd7' };
  const colorFor = (key: string) => sequence === 'full' ? SPHERE_COLORS[SPHERE_INFO[key].group] : sequenceColor[sequence];
  const positionFor = (key: string): [number, number] => VIEW_POSITIONS[sequence][key] || SPHERE_POSITIONS[key];
  const guidanceFor = (sphere: SphereInfo) => (language === 'kn' ? SPHERE_GUIDANCE_KN[`${sphere.key}:${sphere.gk}`] : SPHERE_GUIDANCE[`${sphere.key}:${sphere.gk}`]);
  const titleFor = (key: string) => sequence === 'prosperity' || sequence === 'harmony'
    ? key === 'lifeswork' ? (language === 'kn' ? 'ಗುರುತು' : 'Brand') : key === 'core' ? (language === 'kn' ? 'ವೃತ್ತಿ' : 'Vocation') : copy.labels[key as keyof typeof copy.labels] || SPHERE_INFO[key].title
    : key === 'core' ? (language === 'kn' ? copy.labels.core : 'Core') : copy.labels[key as keyof typeof copy.labels] || SPHERE_INFO[key].title;
  const promptFor = (key: string) => copy.prompts[key as keyof typeof copy.prompts] || SPHERE_INFO[key].prompt;
  const downloadGeneKeysReport = () => downloadDisplayedReport(reportRef.current, `Voxigen_Gene_Keys_${name.trim().replace(/\s+/g, '_') || 'Profile'}_${language.toUpperCase()}.html`, language);

  return <div ref={reportRef} className="space-y-7">
    <section className="overflow-hidden rounded-3xl border border-violet-100 bg-[#faf9fc] shadow-xl"><style>{`@keyframes sphere-in{0%{opacity:0;transform:scale(.55)}100%{opacity:1;transform:scale(1)}}@keyframes sphere-pulse{0%,100%{filter:drop-shadow(0 2px 5px #5265aa33)}50%{filter:drop-shadow(0 0 13px #8b72df99)}}@keyframes link-flow{to{stroke-dashoffset:-28}}.gene-sphere{transform-box:fill-box;transform-origin:center;animation:sphere-in .55s cubic-bezier(.2,.8,.2,1) both,sphere-pulse 3.8s ease-in-out infinite}.gene-link{stroke-dasharray:8 7;animation:link-flow 4s linear infinite}@media(prefers-reduced-motion:reduce){.gene-sphere,.gene-link{animation:none}}`}</style>
      <header className="relative px-5 pb-5 pt-7 text-center sm:px-10"><div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #e8e2f0 1px, transparent 0)', backgroundSize: '18px 18px' }} /><div className="relative"><div className="report-exclude mb-4 flex flex-wrap items-center justify-end gap-2"><div className="inline-flex rounded-full border border-slate-200 bg-white p-1 text-xs" aria-label="Report language"><button type="button" onClick={() => setLanguage('en')} aria-pressed={language === 'en'} className={`rounded-full px-3 py-1.5 ${language === 'en' ? 'bg-violet-700 text-white' : 'text-slate-600'}`}>English</button><button type="button" onClick={() => setLanguage('kn')} aria-pressed={language === 'kn'} className={`rounded-full px-3 py-1.5 ${language === 'kn' ? 'bg-violet-700 text-white' : 'text-slate-600'}`}>ಕನ್ನಡ</button><DownloadReportButton onClick={downloadGeneKeysReport} /></div></div><p className="text-xs uppercase tracking-[.2em] text-violet-500">{copy.profile}</p><h2 className="mt-1 font-display text-2xl font-semibold text-slate-800">{name} · {SEQUENCES[sequence].title}</h2><p className="mt-1 text-sm text-slate-600">{date} · {time} · {place}</p></div></header>
      <div className="relative px-3 sm:px-8"><svg viewBox="0 0 1000 600" role="img" aria-label={`${SEQUENCES[sequence].title} Gene Keys sphere profile`} className="mx-auto h-auto w-full max-w-5xl">
        <ellipse cx="500" cy="315" rx="370" ry="265" fill="none" stroke="#dedbe4" strokeWidth="1.5" />
        <ellipse cx="500" cy="315" rx="355" ry="250" fill="none" stroke="#e9e6ed" strokeWidth="8" strokeDasharray="2 6" />
        {edges.map(([from, to]) => { const a = positionFor(from); const b = positionFor(to); return <line key={`${from}-${to}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={colorFor(from) === colorFor(to) ? colorFor(from) : '#7b88a4'} strokeWidth="3" opacity=".85" className="gene-link" />; })}
        {visible.map((sphere, index) => { const active = selected?.key === sphere.key; const color = colorFor(sphere.key); const [x, y] = positionFor(sphere.key); return <g key={sphere.key} onClick={() => setSelectedSphere(sphere.key)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') setSelectedSphere(sphere.key); }} role="button" tabIndex={0} aria-label={`${titleFor(sphere.key)}, Gene Key ${sphere.gk} line ${sphere.line}`} className="cursor-pointer gene-sphere" style={{ animationDelay: `${index * 70}ms, 0ms` }}><circle cx={x} cy={y} r={active ? 48 : 43} fill={color} stroke={active ? '#fff' : 'rgba(255,255,255,.8)'} strokeWidth={active ? 4 : 2} className="drop-shadow-md" /><text x={x} y={y - 3} textAnchor="middle" fill="white" fontSize="21" fontWeight="600">{sphere.gk}.{sphere.line}</text><text x={x} y={y + 17} textAnchor="middle" fill="white" fontSize="12">{titleFor(sphere.key)}</text></g>; })}
      </svg></div>
      <nav aria-label="Gene Keys profile view" className="grid grid-cols-2 border-t border-violet-100 bg-white/80 sm:grid-cols-5">{Object.entries(SEQUENCES).map(([key, item]) => <button key={key} type="button" onClick={() => { setSequence(key as keyof typeof SEQUENCES); setSelectedSphere(SEQUENCES[key as keyof typeof SEQUENCES].spheres[0]); }} className={`flex flex-col items-center gap-2 px-3 py-4 text-sm font-medium transition-colors ${sequence === key ? 'bg-violet-50 text-violet-800' : 'text-slate-500 hover:bg-slate-50'}`}><span className={`grid h-8 w-8 place-items-center rounded-full border-2 ${sequence === key ? 'border-violet-400 shadow-[0_0_12px_#9071d088]' : 'border-slate-300'}`}><span className="h-2 w-2 rounded-full bg-current" /></span>{language === 'kn' ? ({ full: 'ಪೂರ್ಣ', genius: 'ಪ್ರತಿಭೆ', love: 'ಪ್ರೀತಿ', prosperity: 'ಸಮೃದ್ಧಿ', harmony: 'ಸಾಮರಸ್ಯ' } as Record<string, string>)[key] : item.button}</button>)}</nav>
    </section>

    {selected && <section className="rounded-2xl border border-cosmic-border-subtle bg-cosmic-card p-5 sm:p-7"><p className="text-xs uppercase tracking-[0.18em] text-cosmic-gold">{copy.selected}</p><h3 className="mt-2 font-display text-2xl font-semibold text-cosmic-ivory">{copy.heading} {titleFor(selected.key)} · GK {selected.gk}</h3><p className="mt-3 text-sm text-cosmic-lavender/75">{copy.key} {selected.gk} · {copy.line} {selected.line}</p>{guidanceFor(selected) ? <p className="mt-4 max-w-4xl text-sm leading-7 text-cosmic-lavender/85">{guidanceFor(selected)}</p> : <p className="mt-4 text-xs text-cosmic-lavender/55">{language === 'kn' ? 'ಈ ಜೀನ್ ಕೀಯ ನೆರಳನ್ನು ಗಮನಿಸಿ, ಅದರ ಗುಣವನ್ನು ಬೆಳೆಸಿ, ಅದರ ಸಿದ್ಧಿಗೆ ತೆರೆದುಕೊಳ್ಳಿ.' : 'Contemplate the Shadow, cultivate the Gift, and open to the Siddhi of this Gene Key.'}</p>}</section>}
    {!spheres.length && <div role="status" className="rounded-2xl border border-cosmic-border-subtle bg-cosmic-card p-5 text-sm text-cosmic-lavender">{copy.noSpheres}</div>}

    <section className="space-y-4"><div><h3 className="font-display text-2xl font-semibold">{SEQUENCES[sequence].title}</h3><p className="mt-1 text-sm text-cosmic-lavender/65">{copy.sequence}</p></div><div className="space-y-4">{visible.map(sphere => <article key={sphere.key} onClick={() => setSelectedSphere(sphere.key)} className={`grid cursor-pointer gap-4 rounded-2xl border p-5 transition-colors md:grid-cols-[110px_1fr] ${selected?.key === sphere.key ? 'border-cosmic-gold/50 bg-cosmic-card' : 'border-cosmic-border-subtle bg-cosmic-card/50 hover:border-cosmic-gold/30'}`}><div className="mx-auto grid h-24 w-24 place-items-center rounded-full border-4 text-center" style={{ borderColor: colorFor(sphere.key) }}><span><span className="block text-lg font-bold text-cosmic-ivory">{sphere.gk}.{sphere.line}</span><span className="block text-[9px] uppercase text-cosmic-lavender/60">{copy.key}</span></span></div><div><h4 className="text-lg font-semibold text-cosmic-ivory">{copy.heading} {titleFor(sphere.key)} · {promptFor(sphere.key)} · {copy.key} {sphere.gk}</h4><p className="mt-2 text-sm leading-6 text-cosmic-lavender/75">{copy.line} {sphere.line}{guidanceFor(sphere) ? ` · ${guidanceFor(sphere)}` : ''}</p></div></article>)}</div></section>
  </div>;
}

export const BlueprintPage: React.FC<{ kind: ChartKind }> = ({ kind }) => {
  const isHumanDesign = kind === 'humandesign';
  const pageTitle = isHumanDesign ? 'Human Design' : 'Gene Keys';
  const endpoint = isHumanDesign ? 'humandesign' : 'genekeys';
  const [birth, setBirth] = useState<BirthDetails>({ name: '', date: '', time: '', place: '' });
  const [selectedPlace, setSelectedPlace] = useState<LocationItem | null>(null);
  const [chart, setChart] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (field: keyof BirthDetails, value: string) => setBirth(current => ({ ...current, [field]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedPlace) {
      setError('Please choose your birthplace from the suggestions.');
      return;
    }
    setLoading(true);
    setError('');
    setChart(null);
    try {
      const params = new URLSearchParams({ date: birth.date, time: birth.time, tz: selectedPlace!.timeZoneId });
      params.set('lat', String(selectedPlace!.latitude));
      params.set('lng', String(selectedPlace!.longitude));
      const response = await fetch(`${API_ROOT}/${endpoint}?${params.toString()}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || result?.message || `Chart request failed (${response.status})`);
      setChart(result as Record<string, unknown>);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to calculate this chart. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full rounded-xl bg-cosmic-navy/70 border border-cosmic-border-subtle px-4 py-3 text-sm text-cosmic-ivory placeholder:text-cosmic-lavender/40 focus:outline-none focus:border-cosmic-gold/60';
  const primary = isHumanDesign ? 'humanDesign' : 'geneKeys';
  const chartData = chart && (chart[primary] && typeof chart[primary] === 'object' ? chart[primary] as Record<string, unknown> : chart);

  return <div className={`${isHumanDesign ? 'max-w-[1600px]' : 'max-w-6xl'} mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10`}>
    <header className="max-w-3xl mx-auto text-center space-y-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-cosmic-gold/30 bg-cosmic-purple/30 px-4 py-2 text-xs font-medium text-cosmic-gold"><Sparkles className="w-4 h-4" /> Birth chart calculator</div>
      <h1 className="font-display text-4xl md:text-5xl font-bold">{pageTitle} <span className="text-cosmic-gold">Chart</span></h1>
      <p className="text-sm md:text-base text-cosmic-lavender/75">Enter your birth details to calculate your {isHumanDesign ? 'type, authority, profile, gates and defined centers' : 'Hologenetic Profile and Gene Keys spheres'}.</p>
    </header>

    <form onSubmit={submit} className="max-w-3xl mx-auto rounded-3xl bg-cosmic-card border border-cosmic-border p-5 sm:p-8 shadow-cosmic-card space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="space-y-2 text-xs text-cosmic-lavender sm:col-span-2"><span>Name</span><input required type="text" autoComplete="name" placeholder="Enter your name" className={inputClass} value={birth.name} onChange={e => update('name', e.target.value)} /></label>
        <div className="sm:col-span-2"><CityAutocomplete value={birth.place} onChange={place => { update('place', place); setSelectedPlace(null); }} onSelectLocation={place => { setSelectedPlace(place); setError(''); }} /></div>
        <label className="space-y-2 text-xs text-cosmic-lavender"><span>Date of birth</span><input required type="date" className={inputClass} value={birth.date} onChange={e => update('date', e.target.value)} /></label>
        <label className="space-y-2 text-xs text-cosmic-lavender"><span>Time of birth</span><input required type="time" className={inputClass} value={birth.time} onChange={e => update('time', e.target.value)} /></label>
      </div>
      <button disabled={loading} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-cosmic-gold px-6 py-3 text-sm font-semibold text-cosmic-navy hover:bg-cosmic-gold-light disabled:opacity-60 transition-colors">{loading && <LoaderCircle className="w-4 h-4 animate-spin" />}{loading ? 'Calculating chart…' : `Calculate ${pageTitle} Chart`}</button>
      <p className="text-[11px] text-cosmic-lavender/50">Birth details are sent to the Free Human Design API to calculate this chart. No API key is required by this service.</p>
    </form>

    {error && <div role="alert" className="max-w-3xl mx-auto flex gap-3 rounded-2xl border border-rose-400/30 bg-rose-950/30 p-4 text-sm text-rose-200"><AlertTriangle className="w-5 h-5 shrink-0" /><span>{error}</span></div>}
    {chart && chartData && <section aria-live="polite" className="space-y-5"><div><h2 className="font-display text-2xl md:text-3xl font-bold">{birth.name ? `${birth.name}’s` : 'Your'} {pageTitle} results</h2><p className="mt-1 text-xs text-cosmic-lavender/60">Calculated for {birth.date} at {birth.time} · {birth.place}</p></div>{isHumanDesign ? <HumanDesignChart data={chartData} name={birth.name} date={birth.date} time={birth.time} place={birth.place} utc={String((chart.input as Record<string, unknown> | undefined)?.birth_utc || '')} /> : <GeneKeysResults data={chartData} name={birth.name} date={birth.date} time={birth.time} place={birth.place} />}{chart._meta !== undefined && chart._meta !== null && <details className="rounded-2xl border border-cosmic-border-subtle bg-cosmic-card/60 p-4"><summary className="cursor-pointer text-xs text-cosmic-lavender">Calculation information</summary><pre className="mt-3 overflow-auto text-[11px] text-cosmic-lavender/70">{JSON.stringify(chart._meta, null, 2)}</pre></details>}</section>}
  </div>;
};
