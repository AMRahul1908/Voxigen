import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { AudioLines, CheckCircle2, Mic, MicOff, ShieldCheck, Upload } from 'lucide-react';
import { usePreferences } from '../preferences/PreferencesContext';

type PitchCell = { start: number; end: number; note: string; frequency: number | null; confidence: number };

const COPY = {
  en: { title: 'Voice Input', intro: 'Record your voice or upload an audio sample. You can listen to it before continuing.', record: 'Start recording', stop: 'Stop recording', upload: 'Upload audio', sample: 'Your voice sample', privacy: 'Your sample stays in this browser and is not uploaded. Musical-grid processing runs locally when you choose it.', ready: 'Voice sample ready', later: 'Model-based voice interpretation and the detailed report can be connected when your model is added.', analyze: 'Create musical grid', analyzing: 'Reading pitch…', gridTitle: 'Musical Grid', gridHelp: 'Each cell shows the nearest musical pitch for a short voice segment. Speech pitch is continuous; note names are estimates, not a melody transcription.', time: 'Time', note: 'Nearest note', frequency: 'Frequency', confidence: 'Pitch confidence', sequence: 'Note sequence', emptyGrid: 'No stable pitched segments were detected. Try a clearer recording with less background noise.', download: 'Download CSV', micError: 'Microphone access was unavailable. Allow microphone access or upload an audio file.', fileError: 'Choose an audio file smaller than 25 MB.', audioError: 'This audio could not be decoded. Try a WAV, MP3, M4A, or WebM file.', tipsTitle: 'Recording tips', tips: ['Speak naturally for 1 minute.', 'Use a quiet room and keep the phone about 15–20 cm away.', 'Avoid music and strong background noise.'] },
  kn: { title: 'ಧ್ವನಿ ಇನ್‌ಪುಟ್', intro: 'ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ರೆಕಾರ್ಡ್ ಮಾಡಿ ಅಥವಾ ಆಡಿಯೊ ಮಾದರಿಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. ಮುಂದುವರಿಯುವ ಮೊದಲು ಕೇಳಬಹುದು.', record: 'ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ', stop: 'ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಿ', upload: 'ಆಡಿಯೊ ಅಪ್‌ಲೋಡ್', sample: 'ನಿಮ್ಮ ಧ್ವನಿ ಮಾದರಿ', privacy: 'ನಿಮ್ಮ ಮಾದರಿ ಈ ಬ್ರೌಸರ್‌ನಲ್ಲೇ ಇರುತ್ತದೆ; ಅಪ್‌ಲೋಡ್ ಆಗುವುದಿಲ್ಲ. ನೀವು ಆಯ್ಕೆ ಮಾಡಿದಾಗ ಸಂಗೀತ ಗ್ರಿಡ್ ಅನ್ನು ಇಲ್ಲಿಯೇ ರಚಿಸಲಾಗುತ್ತದೆ.', ready: 'ಧ್ವನಿ ಮಾದರಿ ಸಿದ್ಧವಾಗಿದೆ', later: 'ನಿಮ್ಮ ಮಾಡೆಲ್ ಸೇರಿಸಿದಾಗ ಮಾಡೆಲ್ ಆಧಾರಿತ ಧ್ವನಿ ವಿವರಣೆ ಮತ್ತು ವಿವರವಾದ ವರದಿಯನ್ನು ಜೋಡಿಸಬಹುದು.', analyze: 'ಸಂಗೀತ ಗ್ರಿಡ್ ರಚಿಸಿ', analyzing: 'ಪಿಚ್ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ…', gridTitle: 'ಸಂಗೀತ ಗ್ರಿಡ್', gridHelp: 'ಪ್ರತಿ ಕೋಶವು ಧ್ವನಿಯ ಚಿಕ್ಕ ಭಾಗಕ್ಕೆ ಹತ್ತಿರದ ಸಂಗೀತ ಸ್ವರವನ್ನು ತೋರಿಸುತ್ತದೆ. ಮಾತಿನ ಪಿಚ್ ನಿರಂತರವಾಗಿರುತ್ತದೆ; ಸ್ವರದ ಹೆಸರುಗಳು ಅಂದಾಜು ಮಾತ್ರ, ಹಾಡಿನ ಸ್ವರಲಿಪಿಯಲ್ಲ.', time: 'ಸಮಯ', note: 'ಹತ್ತಿರದ ಸ್ವರ', frequency: 'ಆವರ್ತನ', confidence: 'ಪಿಚ್ ವಿಶ್ವಾಸ', sequence: 'ಸ್ವರಗಳ ಕ್ರಮ', emptyGrid: 'ಸ್ಥಿರ ಸ್ವರದ ಭಾಗಗಳು ಪತ್ತೆಯಾಗಿಲ್ಲ. ಕಡಿಮೆ ಹಿನ್ನೆಲೆ ಶಬ್ದವಿರುವ ಸ್ಪಷ್ಟ ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಯತ್ನಿಸಿ.', download: 'CSV ಡೌನ್‌ಲೋಡ್', micError: 'ಮೈಕ್ರೊಫೋನ್ ಲಭ್ಯವಿಲ್ಲ. ಅನುಮತಿ ನೀಡಿ ಅಥವಾ ಆಡಿಯೊ ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.', fileError: '25 MB ಗಿಂತ ಚಿಕ್ಕ ಆಡಿಯೊ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ.', audioError: 'ಈ ಆಡಿಯೊ ಓದಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. WAV, MP3, M4A ಅಥವಾ WebM ಫೈಲ್ ಪ್ರಯತ್ನಿಸಿ.', tipsTitle: 'ರೆಕಾರ್ಡಿಂಗ್ ಸಲಹೆಗಳು', tips: ['1 ನಿಮಿಷ ಸಹಜವಾಗಿ ಮಾತನಾಡಿ.', 'ಶಾಂತ ಸ್ಥಳದಲ್ಲಿ ಫೋನ್ ಅನ್ನು 15–20 ಸೆಂ.ಮೀ ದೂರದಲ್ಲಿ ಇಡಿ.', 'ಸಂಗೀತ ಮತ್ತು ಹಿನ್ನೆಲೆ ಶಬ್ದವನ್ನು ತಪ್ಪಿಸಿ.'] },
  hi: { title: 'आवाज़ इनपुट', intro: 'अपनी आवाज़ रिकॉर्ड करें या ऑडियो नमूना अपलोड करें। आगे बढ़ने से पहले उसे सुन सकते हैं।', record: 'रिकॉर्डिंग शुरू करें', stop: 'रिकॉर्डिंग रोकें', upload: 'ऑडियो अपलोड करें', sample: 'आपका आवाज़ नमूना', privacy: 'आपका नमूना इसी ब्राउज़र में रहता है और अपलोड नहीं होता। चुने जाने पर म्यूज़िकल ग्रिड यहीं बनाया जाता है।', ready: 'आवाज़ का नमूना तैयार है', later: 'आपका मॉडल जुड़ने पर मॉडल आधारित आवाज़ की व्याख्या और विस्तृत रिपोर्ट जोड़ी जा सकती है।', analyze: 'म्यूज़िकल ग्रिड बनाएँ', analyzing: 'पिच पढ़ी जा रही है…', gridTitle: 'म्यूज़िकल ग्रिड', gridHelp: 'हर सेल आवाज़ के छोटे हिस्से के सबसे निकट के संगीत स्वर को दिखाता है। बोलने की पिच लगातार बदलती है; स्वर के नाम अनुमान हैं, धुन का लिप्यंतरण नहीं।', time: 'समय', note: 'निकटतम स्वर', frequency: 'फ़्रीक्वेंसी', confidence: 'पिच विश्वास', sequence: 'स्वरों का क्रम', emptyGrid: 'स्थिर पिच वाले हिस्से नहीं मिले। कम पृष्ठभूमि शोर के साथ साफ़ रिकॉर्डिंग आज़माएँ।', download: 'CSV डाउनलोड करें', micError: 'माइक्रोफ़ोन उपलब्ध नहीं है। अनुमति दें या ऑडियो फ़ाइल अपलोड करें।', fileError: '25 MB से छोटी ऑडियो फ़ाइल चुनें।', audioError: 'यह ऑडियो पढ़ा नहीं जा सका। WAV, MP3, M4A या WebM फ़ाइल आज़माएँ।', tipsTitle: 'रिकॉर्डिंग के सुझाव', tips: ['1 मिनट सामान्य रूप से बोलें।', 'शांत कमरे में फ़ोन को लगभग 15–20 सेमी दूर रखें।', 'संगीत और तेज़ पृष्ठभूमि शोर से बचें।'] },
} as const;

const PITCH_CLASSES: Array<[string, string?]> = [['C', 'B♯'], ['C♯', 'D♭'], ['D'], ['D♯', 'E♭'], ['E'], ['F', 'E♯'], ['F♯', 'G♭'], ['G'], ['G♯', 'A♭'], ['A'], ['A♯', 'B♭'], ['B']];

function timeLabel(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds - minutes * 60;
  return `${String(minutes).padStart(2, '0')}:${remainder.toFixed(2).padStart(5, '0')}`;
}

async function createMusicalGrid(file: File): Promise<PitchCell[]> {
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) throw new Error('decode');
  const context = new AudioContextClass();
  try {
    const audio = await context.decodeAudioData(await file.arrayBuffer());
    const factor = Math.max(1, Math.floor(audio.sampleRate / 11025));
    const sampleRate = audio.sampleRate / factor;
    const length = Math.floor(audio.length / factor);
    const mono = new Float32Array(length);
    for (let channel = 0; channel < audio.numberOfChannels; channel++) {
      const source = audio.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        let sum = 0;
        for (let j = 0; j < factor; j++) sum += source[i * factor + j] || 0;
        mono[i] += sum / factor / audio.numberOfChannels;
      }
    }
    const frameSize = Math.floor(sampleRate * 0.05);
    const minLag = Math.max(2, Math.floor(sampleRate / 600));
    const maxLag = Math.min(Math.floor(sampleRate / 65), frameSize - 2);
    const cells: PitchCell[] = [];
    const frameDuration = frameSize / sampleRate;
    for (let start = 0, frame = 0; start + frameSize <= mono.length; start += frameSize, frame++) {
      let mean = 0, energy = 0;
      for (let i = 0; i < frameSize; i++) { const value = mono[start + i]; mean += value; energy += value * value; }
      const rms = Math.sqrt(energy / frameSize);
      let note = '—', frequency: number | null = null, confidence = 0;
        if (rms >= 0.0035 && maxLag > minLag) {
        mean /= frameSize;
        let bestLag = 0, bestCorrelation = 0;
        for (let lag = minLag; lag <= maxLag; lag++) {
          let correlation = 0, leftEnergy = 0, rightEnergy = 0;
          for (let i = 0; i < frameSize - lag; i += 3) {
            const left = mono[start + i] - mean;
            const right = mono[start + i + lag] - mean;
            correlation += left * right; leftEnergy += left * left; rightEnergy += right * right;
          }
          const normalized = correlation / Math.sqrt((leftEnergy * rightEnergy) || 1);
          if (normalized > bestCorrelation) { bestCorrelation = normalized; bestLag = lag; }
        }
        if (bestLag && bestCorrelation >= 0.3) {
          frequency = sampleRate / bestLag;
          const midi = Math.round(69 + 12 * Math.log2(frequency / 440));
          const pitchClass = ((midi % 12) + 12) % 12;
          const octave = Math.floor(midi / 12) - 1;
          const [primary, alternate] = PITCH_CLASSES[pitchClass];
          note = `${primary}${octave}${alternate ? ` / ${alternate}${pitchClass === 0 ? octave - 1 : octave}` : ''}`;
          confidence = bestCorrelation;
        }
      }
      const time = frame * frameDuration;
      const previous = cells[cells.length - 1];
      if (previous && previous.note === note) {
        previous.end = time + frameDuration;
        if (frequency !== null) previous.frequency = previous.frequency === null ? frequency : (previous.frequency + frequency) / 2;
        previous.confidence = (previous.confidence + confidence) / 2;
      } else {
        cells.push({ start: time, end: time + frameDuration, note, frequency, confidence });
      }
    }
    return cells;
  } finally { await context.close(); }
}

export const VoiceAnalysisPage: React.FC = () => {
  const { language } = usePreferences();
  const copy = COPY[language];
  const [recording, setRecording] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [error, setError] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [grid, setGrid] = useState<PitchCell[] | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!recording) return;
    const timer = window.setInterval(() => setElapsed(value => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [recording]);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  const setAudioFile = (nextFile: File) => {
    if (!nextFile.type.startsWith('audio/') || nextFile.size > 25 * 1024 * 1024) { setError(copy.fileError); return; }
    setError(''); setFile(nextFile); setGrid(null);
    setAudioUrl(current => { if (current) URL.revokeObjectURL(current); return URL.createObjectURL(nextFile); });
  };

  const startRecording = async () => {
    setError(''); setElapsed(0); setGrid(null);
    let activeStream: MediaStream | null = null;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      activeStream = stream;
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = event => { if (event.data.size) chunksRef.current.push(event.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        stream.getTracks().forEach(track => track.stop()); streamRef.current = null; setRecording(false);
        if (blob.size > 25 * 1024 * 1024) { setError(copy.fileError); return; }
        setAudioFile(new File([blob], `voxigen-voice-${Date.now()}.webm`, { type: blob.type }));
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      activeStream?.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setRecording(false);
      setError(copy.micError);
    }
  };

  const stopRecording = () => { if (recorderRef.current?.state === 'recording') recorderRef.current.stop(); };
  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => { const picked = event.target.files?.[0]; if (picked) setAudioFile(picked); event.target.value = ''; };
  const analyzeGrid = async () => {
    if (!file) return;
    setAnalyzing(true); setError('');
    try { setGrid(await createMusicalGrid(file)); }
    catch { setGrid(null); setError(copy.audioError); }
    finally { setAnalyzing(false); }
  };
  const downloadGrid = () => {
    if (!grid) return;
    const csvCell = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const rows = [[copy.time, copy.note, copy.frequency, copy.confidence], ...grid.map(cell => [`${timeLabel(cell.start)}–${timeLabel(cell.end)}`, cell.note, cell.frequency === null ? '' : `${cell.frequency.toFixed(1)} Hz`, cell.confidence ? `${(cell.confidence * 100).toFixed(0)}%` : ''])];
    const csv = `\uFEFF${rows.map(row => row.map(value => csvCell(String(value))).join(',')).join('\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'Voxigen_Musical_Grid.csv'; document.body.appendChild(anchor); anchor.click(); anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const pitchCells = grid?.filter(cell => cell.note !== '—') || [];

  return <main className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
    <header className="mx-auto max-w-3xl space-y-4 text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-cosmic-gold/40 bg-cosmic-purple/30 px-4 py-2 text-xs font-semibold text-cosmic-gold"><AudioLines className="h-4 w-4" /> Voxigen Voice Lab</div>
      <h1 className="font-display text-4xl font-bold text-cosmic-ivory sm:text-5xl">{copy.title}</h1>
      <p className="text-sm leading-6 text-cosmic-lavender/75">{copy.intro}</p>
    </header>

    <section className="grid gap-6 lg:grid-cols-[1fr_.8fr]">
      <div className="space-y-6 rounded-3xl border border-cosmic-border bg-cosmic-card p-6 shadow-cosmic-card sm:p-8">
        <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-full bg-cosmic-purple/40 text-cosmic-gold"><Mic className="h-5 w-5" /></div><div><h2 className="font-display text-xl font-semibold text-cosmic-ivory">{copy.sample}</h2><p className="text-xs text-cosmic-lavender/65">{copy.privacy}</p></div></div>
        <div className="flex flex-wrap gap-3">
          {!recording ? <button type="button" onClick={startRecording} className="inline-flex items-center gap-2 rounded-xl bg-cosmic-gold px-5 py-3 text-sm font-semibold text-cosmic-navy hover:bg-cosmic-gold-light"><Mic className="h-4 w-4" />{copy.record}</button> : <button type="button" onClick={stopRecording} className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white"><MicOff className="h-4 w-4" />{copy.stop} · {elapsed}s</button>}
          <button type="button" disabled={recording} onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl border border-cosmic-gold/40 px-5 py-3 text-sm font-semibold text-cosmic-gold hover:bg-cosmic-purple/30 disabled:opacity-50"><Upload className="h-4 w-4" />{copy.upload}</button>
          <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={onFileChange} />
        </div>
        {file && <div className="space-y-3 rounded-2xl border border-cosmic-border-subtle bg-cosmic-navy/50 p-4"><p className="break-all text-xs text-cosmic-lavender">{file.name} · {(file.size / (1024 * 1024)).toFixed(2)} MB</p>{audioUrl && <audio controls src={audioUrl} className="w-full" />}<p role="status" className="flex items-center gap-2 text-sm font-medium text-emerald-400"><CheckCircle2 className="h-4 w-4" />{copy.ready}</p><button type="button" disabled={analyzing || recording} onClick={analyzeGrid} className="inline-flex items-center gap-2 rounded-xl bg-cosmic-purple px-5 py-3 text-sm font-semibold text-white hover:bg-cosmic-purple/80 disabled:opacity-50"><AudioLines className="h-4 w-4" />{analyzing ? copy.analyzing : copy.analyze}</button></div>}
        {error && <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-950/30 p-3 text-sm text-rose-200">{error}</p>}
        <p className="rounded-xl bg-cosmic-purple/20 p-4 text-xs leading-5 text-cosmic-lavender/75">{copy.later}</p>
      </div>

      <aside className="rounded-3xl border border-cosmic-border-subtle bg-cosmic-card/60 p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-2 text-cosmic-gold"><ShieldCheck className="h-5 w-5" /><h2 className="font-display text-xl font-semibold text-cosmic-ivory">{copy.tipsTitle}</h2></div>
        <ul className="space-y-3 text-sm leading-6 text-cosmic-lavender/80">{copy.tips.map(tip => <li key={tip} className="flex gap-2"><span className="text-cosmic-gold">•</span>{tip}</li>)}</ul>
      </aside>
    </section>
    {grid && <section aria-live="polite" className="space-y-5 rounded-3xl border border-cosmic-border-subtle bg-cosmic-card p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs uppercase tracking-[.18em] text-cosmic-gold">Voxigen</p><h2 className="mt-1 font-display text-2xl font-bold text-cosmic-ivory">{copy.gridTitle}</h2><p className="mt-2 max-w-3xl text-xs leading-5 text-cosmic-lavender/65">{copy.gridHelp}</p></div><button type="button" onClick={downloadGrid} className="rounded-xl border border-cosmic-gold/40 px-4 py-2.5 text-sm font-semibold text-cosmic-gold">{copy.download}</button></div>
      {pitchCells.length ? <>
        <div><h3 className="mb-3 text-sm font-semibold text-cosmic-lavender">{copy.sequence}</h3><div className="flex flex-wrap gap-2">{pitchCells.map((cell, index) => <span key={`${cell.start}-${index}`} title={`${timeLabel(cell.start)}–${timeLabel(cell.end)} · ${cell.frequency?.toFixed(1)} Hz`} className="rounded-lg border border-cosmic-gold/30 bg-cosmic-navy/60 px-3 py-2 text-sm font-semibold text-cosmic-gold">{cell.note}</span>)}</div></div>
        <div className="overflow-x-auto rounded-2xl border border-cosmic-border-subtle"><table className="w-full min-w-[620px] border-collapse text-left text-sm"><thead className="bg-cosmic-navy/70 text-xs uppercase tracking-wide text-cosmic-lavender/70"><tr><th className="px-4 py-3">{copy.time}</th><th className="px-4 py-3">{copy.note}</th><th className="px-4 py-3">{copy.frequency}</th><th className="px-4 py-3">{copy.confidence}</th></tr></thead><tbody>{grid.map((cell, index) => <tr key={`${cell.start}-${index}`} className="border-t border-cosmic-border-subtle"><td className="px-4 py-2.5 font-mono text-xs text-cosmic-lavender">{timeLabel(cell.start)}–{timeLabel(cell.end)}</td><td className={`px-4 py-2.5 font-semibold ${cell.frequency === null ? 'text-cosmic-lavender/40' : 'text-cosmic-ivory'}`}>{cell.note}</td><td className="px-4 py-2.5 text-cosmic-lavender">{cell.frequency === null ? '—' : `${cell.frequency.toFixed(1)} Hz`}</td><td className="px-4 py-2.5 text-cosmic-lavender">{cell.confidence ? `${(cell.confidence * 100).toFixed(0)}%` : '—'}</td></tr>)}</tbody></table></div>
      </> : <p className="rounded-xl border border-cosmic-border-subtle bg-cosmic-navy/40 p-4 text-sm text-cosmic-lavender/75">{copy.emptyGrid}</p>}
    </section>}
  </main>;
};
