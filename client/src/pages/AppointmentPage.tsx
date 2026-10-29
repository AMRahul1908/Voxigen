import React, { useMemo, useState } from 'react';

const ASTROLOGER_WHATSAPP = '919449607538';
const COMPANY_PHONE = '+918970171999';

export const AppointmentPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [minutes, setMinutes] = useState(10);
  const total = useMemo(() => minutes * 50, [minutes]);
  const minDate = new Date().toISOString().slice(0, 10);

  const requestAppointment = (event: React.FormEvent) => {
    event.preventDefault();
    const message = [
      'Hello, I would like to request an astrologer appointment.',
      `Name: ${name.trim()}`,
      `My phone: ${phone.trim()}`,
      `Preferred date: ${date}`,
      `Preferred time: ${time}`,
      `Requested duration: ${minutes} minutes`,
      `Estimated consultation charge: ₹${total} (₹50 per minute)`,
      'Please confirm availability and payment details.',
    ].join('\n');
    window.open(`https://wa.me/${ASTROLOGER_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return <main className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
    <section className="space-y-5">
      <p className="text-xs uppercase tracking-[.2em] text-cosmic-gold">Personal consultation</p>
      <h1 className="text-4xl font-bold">Book an astrologer</h1>
      <p className="max-w-xl leading-7 text-cosmic-lavender/80">Request a one-to-one consultation with our astrologer. The consultation rate is <strong className="text-cosmic-gold">₹50 per minute</strong>; choose an estimated duration to see the charge before sending your request.</p>
      <div className="rounded-2xl border border-cosmic-border-subtle bg-cosmic-card p-5">
        <p className="text-sm text-cosmic-lavender/70">Astrologer appointment requests</p>
        <a className="mt-1 inline-block text-lg font-semibold text-cosmic-gold" href={`https://wa.me/${ASTROLOGER_WHATSAPP}`} target="_blank" rel="noreferrer">+91 94496 07538 · WhatsApp</a>
      </div>
      <div className="rounded-2xl border border-cosmic-border-subtle bg-cosmic-card p-5">
        <p className="text-sm text-cosmic-lavender/70">Contact Us</p>
        <a className="mt-1 inline-block text-lg font-semibold text-cosmic-gold" href={`tel:${COMPANY_PHONE}`}>+91 89701 71999</a>
      </div>
    </section>

    <form onSubmit={requestAppointment} className="space-y-4 rounded-3xl border border-cosmic-border-subtle bg-cosmic-card p-6 sm:p-8">
      <h2 className="text-2xl font-semibold">Appointment request</h2>
      <label className="block text-sm">Your name<input required value={name} onChange={e => setName(e.target.value)} autoComplete="name" className="mt-2 w-full rounded-xl border border-cosmic-border bg-cosmic-navy px-4 py-3" /></label>
      <label className="block text-sm">Your phone number<input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} autoComplete="tel" className="mt-2 w-full rounded-xl border border-cosmic-border bg-cosmic-navy px-4 py-3" /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">Preferred date<input required type="date" min={minDate} value={date} onChange={e => setDate(e.target.value)} className="mt-2 w-full rounded-xl border border-cosmic-border bg-cosmic-navy px-4 py-3 text-cosmic-ivory" /></label>
        <label className="block text-sm">Preferred time<input required type="time" value={time} onChange={e => setTime(e.target.value)} className="mt-2 w-full rounded-xl border border-cosmic-border bg-cosmic-navy px-4 py-3 text-cosmic-ivory" /></label>
      </div>
      <label className="block text-sm">Estimated consultation duration
        <select value={minutes} onChange={e => setMinutes(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-cosmic-border bg-cosmic-navy px-4 py-3 text-cosmic-ivory">
          {[10, 15, 20, 30, 45, 60].map(value => <option key={value} value={value}>{value} minutes</option>)}
        </select>
      </label>
      <div className="flex items-center justify-between rounded-xl border border-cosmic-gold/30 bg-cosmic-gold/10 p-4"><span className="text-sm text-cosmic-lavender">Estimated charge · ₹50/min</span><strong className="text-xl text-cosmic-gold">₹{total}</strong></div>
      <button className="w-full rounded-xl bg-cosmic-gold px-4 py-3 font-semibold text-cosmic-navy">Request appointment on WhatsApp</button>
      <p className="text-xs leading-5 text-cosmic-lavender/60">This sends an appointment request, not a confirmed booking or payment. The astrologer will confirm availability and payment details on WhatsApp. The final amount is based on the actual consultation duration.</p>
    </form>
  </main>;
};
