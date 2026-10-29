import React, { FormEvent, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { AudioLines, Check, Crown, LogOut, Sparkles } from 'lucide-react';

type ProductId = 'basic_horoscope' | 'bronze_horoscope' | 'basic_voice' | 'silver_bundle' | 'gold_voice';
type Product = { id: ProductId; name: string; amountInr: number; durationMonths: number | null; oneTimeViews: number | null; services: string[]; summary: string; features: string[]; support: string; category: string };
type Purchase = { productId: ProductId; name: string; amountInr: number; purchasedAt: string; validUntil: string | null; remainingViews: number | null; supportLifetime: boolean; status: string };
type User = { id: string; name: string; email: string; contact: string; selectedProductId: ProductId; membershipStatus: 'pending' | 'active' | 'expired'; servicesAllowed: string[]; purchases: Purchase[] };
type AuthResult = { user: User; message?: string };
type OrderResult = { keyId: string; orderId: string; amount: number; currency: string; name: string; email: string; contact: string; product: Product };
declare global { interface Window { Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (name: string, cb: (error: any) => void) => void }; } }

const PRODUCTS: Product[] = [
  { id: 'basic_horoscope', name: 'Basic Horoscope', amountInr: 1500, durationMonths: null, oneTimeViews: 1, services: ['horoscope'], category: 'Horoscope', summary: 'A single basic horoscope report purchase.', features: ['One horoscope report view'], support: 'Standard account support' },
  { id: 'bronze_horoscope', name: 'Bronze · Advanced Horoscope', amountInr: 5000, durationMonths: 4, oneTimeViews: null, services: ['horoscope'], category: 'Horoscope', summary: 'Advanced horoscope access for four calendar months.', features: ['Advanced horoscope service', 'Four calendar months of access'], support: 'Standard account support' },
  { id: 'basic_voice', name: 'Basic Voice Report', amountInr: 5000, durationMonths: 4, oneTimeViews: null, services: ['voice'], category: 'Voice', summary: 'Basic voice report with basic voice details for four calendar months.', features: ['Basic voice report and details', 'Four calendar months of access'], support: 'Standard account support' },
  { id: 'silver_bundle', name: 'Silver · Horoscope + Voice Bundle', amountInr: 9000, durationMonths: 4, oneTimeViews: null, services: ['horoscope', 'voice'], category: 'Bundle', summary: 'Advanced horoscope and basic voice report together for four months.', features: ['Advanced horoscope service', 'Basic voice report', 'Save ₹1,000 vs. buying both individually'], support: 'Standard account support' },
  { id: 'gold_voice', name: 'Gold · Advanced Voice Analysis', amountInr: 25000, durationMonths: null, oneTimeViews: null, services: ['voice'], category: 'Voice', summary: 'Advanced voice analysis with astrology and personality insights, with lifetime support for the purchased report.', features: ['Advanced voice analysis', 'Astrology and personality insights', 'Lifetime support for the purchased report'], support: 'Report support is included for its lifetime. No medical diagnosis or treatment advice.' },
];
const initialForm = { name: '', email: '', password: '', birthDate: '', birthTime: '', birthPlace: '', gender: 'prefer_not_to_say', location: '', contact: '', selectedProductId: 'basic_horoscope' as ProductId };
const accessLabel = (value: string | null) => value ? `Valid through ${new Date(value).toLocaleDateString()}` : 'No expiry';

export const AccountPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const resetToken = searchParams.get('reset') || '';
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [paymentReady, setPaymentReady] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>(() => resetToken ? 'reset' : 'login');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const set = (key: keyof typeof initialForm, value: string) => setForm(current => ({ ...current, [key]: value }));

  useEffect(() => {
    Promise.all([
      apiFetch<AuthResult>('/account/me').then(result => setUser(result.user)).catch(() => setUser(null)),
      apiFetch<{ products: Product[]; paymentReady: boolean }>('/account/plans').then(result => { setProducts(result.products); setPaymentReady(result.paymentReady); }).catch(() => setPaymentReady(false)),
    ]).finally(() => setLoading(false));
  }, []);

  const startCheckout = async (selectedUser: User, productId: ProductId) => {
    setBusy(true); setNotice('');
    try {
      const order = await apiFetch<OrderResult>('/account/payments/order', { method: 'POST', body: JSON.stringify({ productId }) });
      if (!window.Razorpay) await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script'); script.src = 'https://checkout.razorpay.com/v1/checkout.js'; script.onload = () => resolve(); script.onerror = () => reject(new Error('Could not load secure checkout.')); document.body.appendChild(script);
      });
      if (!window.Razorpay) throw new Error('Secure checkout is unavailable.');
      const checkout = new window.Razorpay({ key: order.keyId, order_id: order.orderId, amount: order.amount, currency: order.currency, name: 'Voxigen', description: order.product.name, prefill: { name: selectedUser.name, email: selectedUser.email, contact: selectedUser.contact }, theme: { color: '#d6b46a' }, handler: async (response: any) => {
        try { const verified = await apiFetch<AuthResult>('/account/payments/verify', { method: 'POST', body: JSON.stringify(response) }); setUser(verified.user); setNotice(`${order.product.name} purchase verified. Your access is ready.`); }
        catch (error) { setNotice(error instanceof Error ? error.message : 'Payment verification failed. Please contact support.'); }
      } });
      checkout.on('payment.failed', (error: any) => setNotice(error?.error?.description || 'Payment failed. You can retry from your account.'));
      checkout.open();
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Unable to start checkout.'); }
    finally { setBusy(false); }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setNotice('');
    try {
      if (mode === 'forgot') {
        const result = await apiFetch<{ message: string }>('/account/password/forgot', { method: 'POST', body: JSON.stringify({ email: form.email }) });
        setNotice(result.message);
        return;
      }
      if (mode === 'reset') {
        const result = await apiFetch<{ message: string }>('/account/password/reset', { method: 'POST', body: JSON.stringify({ token: resetToken, password: form.password }) });
        setSearchParams({}, { replace: true });
        setMode('login'); set('password', ''); setNotice(result.message);
        return;
      }
      if (mode === 'login') {
        const result = await apiFetch<AuthResult>('/account/login', { method: 'POST', body: JSON.stringify({ email: form.email, password: form.password }) }); setUser(result.user);
      } else {
        const result = await apiFetch<AuthResult>('/account/register', { method: 'POST', body: JSON.stringify({ ...form, privacyConsent }) }); setUser(result.user);
        if (paymentReady) await startCheckout(result.user, form.selectedProductId);
      }
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Could not continue. Please try again.'); }
    finally { setBusy(false); }
  };

  const logout = async () => { try { await apiFetch('/account/logout', { method: 'POST' }); } finally { setUser(null); setForm(initialForm); setNotice(''); } };
  const selectProduct = (id: ProductId) => { set('selectedProductId', id); setMode('register'); setNotice(''); document.getElementById('account-form')?.scrollIntoView({ behavior: 'smooth' }); };
  const purchaseProduct = (product: Product) => { set('selectedProductId', product.id); if (!user) { selectProduct(product.id); return; } void startCheckout(user, product.id); };
  const selectedProduct = products.find(product => product.id === form.selectedProductId) || PRODUCTS[0];
  const allowed = (service: string) => user?.servicesAllowed.includes(service) ?? false;
  const heading = mode === 'login' ? 'Sign in to Voxigen' : mode === 'register' ? 'Create your account' : mode === 'forgot' ? 'Reset your password' : 'Choose a new password';

  if (loading) return <main className="mx-auto max-w-4xl px-4 py-20 text-center text-cosmic-lavender">Loading account…</main>;

  const productCards = <section id="offerings"><h2 className="mb-5 text-center text-2xl font-semibold">Choose the service that fits you</h2><p className="mx-auto mb-6 max-w-2xl text-center text-sm text-cosmic-lavender/70">One-time purchases with clearly stated access periods. Four-month access starts when payment is confirmed; it does not renew automatically.</p><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{products.map(product => <article key={product.id} className={`rounded-2xl border p-5 ${product.id === 'silver_bundle' ? 'border-cosmic-gold/70 bg-cosmic-purple/30' : 'border-cosmic-border-subtle bg-cosmic-card'}`}><div className="flex items-start justify-between gap-3"><span className="rounded-full border border-cosmic-gold/30 px-2.5 py-1 text-[10px] uppercase tracking-wider text-cosmic-gold">{product.category}</span>{product.id === 'silver_bundle' && <span className="text-[10px] font-bold text-emerald-300">BUNDLE · SAVE ₹1,000</span>}</div><h3 className="mt-4 text-lg font-bold">{product.name}</h3><p className="mt-2 min-h-10 text-sm leading-5 text-cosmic-lavender/75">{product.summary}</p><p className="mt-4 text-2xl font-bold text-cosmic-gold">₹{product.amountInr.toLocaleString('en-IN')}</p><p className="mt-1 text-xs text-cosmic-lavender/60">{product.durationMonths ? `${product.durationMonths} calendar months` : product.oneTimeViews ? 'One report view' : 'One-time purchase · no expiry'}</p><ul className="my-4 space-y-2 text-xs leading-5 text-cosmic-lavender/80">{product.features.map(feature => <li key={feature} className="flex gap-2"><Check size={14} className="mt-0.5 shrink-0 text-cosmic-gold"/>{feature}</li>)}</ul><p className="mb-4 text-[11px] leading-4 text-cosmic-lavender/60">{product.support}</p><button type="button" disabled={!paymentReady && Boolean(user)} onClick={() => purchaseProduct(product)} className="w-full rounded-xl bg-cosmic-gold px-4 py-2.5 text-sm font-semibold text-cosmic-navy disabled:cursor-not-allowed disabled:opacity-50">{user ? `Buy ${product.name}` : `Select ${product.name}`}</button></article>)}</div>{!paymentReady && <p className="mt-4 text-center text-xs text-amber-200/75">Payment is unavailable until Razorpay keys are configured on the server. You can still create an account.</p>}</section>;

  if (user) return <main className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
    <section className="rounded-3xl border border-cosmic-gold/30 bg-gradient-to-br from-cosmic-purple/50 to-cosmic-card p-7 sm:p-10"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[.2em] text-cosmic-gold">Your Voxigen account</p><h1 className="mt-3 text-3xl font-bold">Welcome, {user.name}</h1><p className="mt-2 text-cosmic-lavender/75">{user.email} · {user.contact}</p></div><button onClick={logout} className="inline-flex items-center gap-2 rounded-xl border border-cosmic-border px-4 py-2 text-sm text-cosmic-lavender"><LogOut size={16}/> Sign out</button></div><div className="mt-7 inline-flex items-center gap-2 rounded-full bg-cosmic-gold/15 px-4 py-2 text-sm font-semibold text-cosmic-gold"><Crown size={16}/>{user.purchases.some(purchase => purchase.status === 'paid') ? 'Purchased services' : 'No paid service yet'}</div>{notice && <p role="status" className="mt-4 text-sm text-emerald-300">{notice}</p>}</section>
    <section><h2 className="mb-4 text-2xl font-semibold">Your purchases</h2>{user.purchases.filter(purchase => purchase.status === 'paid').length ? <div className="grid gap-3 sm:grid-cols-2">{user.purchases.filter(purchase => purchase.status === 'paid').map((purchase, index) => <article key={`${purchase.productId}-${index}`} className="rounded-2xl border border-cosmic-border-subtle bg-cosmic-card p-5"><h3 className="font-semibold">{purchase.name}</h3><p className="mt-1 text-sm text-cosmic-gold">₹{purchase.amountInr.toLocaleString('en-IN')} · {purchase.validUntil ? accessLabel(purchase.validUntil) : 'No expiry'}</p>{purchase.remainingViews !== null && <p className="mt-1 text-xs text-cosmic-lavender/65">Report views remaining: {purchase.remainingViews}</p>}{purchase.supportLifetime && <p className="mt-1 text-xs text-cosmic-lavender/65">Lifetime support for this purchased report</p>}</article>)}</div> : <p className="rounded-xl border border-cosmic-border-subtle bg-cosmic-card p-5 text-sm text-cosmic-lavender/70">No purchases yet. Choose a service below to continue.</p>}</section>
    <section><h2 className="mb-4 text-2xl font-semibold">Your service access</h2><div className="grid gap-4 sm:grid-cols-2">{[{ service: 'voice', title: 'Voice reports', desc: 'Basic voice report or advanced voice analysis.', to: '/voice-analysis', icon: AudioLines }, { service: 'horoscope', title: 'Horoscope', desc: 'Basic report view or advanced horoscope access.', to: '/horoscope', icon: Sparkles }].map(item => <div key={item.service} className="rounded-2xl border border-cosmic-border-subtle bg-cosmic-card p-6"><item.icon className="mb-4 text-cosmic-gold"/><h3 className="text-xl font-semibold">{item.title}</h3><p className="mt-2 text-sm text-cosmic-lavender/75">{item.desc}</p>{allowed(item.service) ? <Link className="mt-5 inline-block rounded-xl bg-cosmic-gold px-4 py-2.5 text-sm font-semibold text-cosmic-navy" to={item.to}>Open service</Link> : <p className="mt-5 text-sm text-cosmic-lavender/55">No current access. Choose a matching service below.</p>}</div>)}</div></section>
    {productCards}
  </main>;

  return <main className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
    <header className="mx-auto max-w-2xl text-center"><p className="text-xs uppercase tracking-[.2em] text-cosmic-gold">Secure member access</p><h1 className="mt-3 text-4xl font-bold">{heading}</h1><p className="mt-3 text-sm text-cosmic-lavender/75">{mode === 'forgot' ? 'Enter your account email and we’ll send a secure reset link if an account matches.' : mode === 'reset' ? 'Choose a new password with at least 12 characters, including uppercase, lowercase, and a number.' : 'Purchase a one-time service or bundle. Four-month access starts after payment confirmation and does not auto-renew.'}</p></header>
    <form id="account-form" onSubmit={submit} className="mx-auto max-w-2xl space-y-4 rounded-3xl border border-cosmic-border-subtle bg-cosmic-card p-6 sm:p-8">
      <h2 className="text-2xl font-semibold">{mode === 'login' ? 'Sign in' : mode === 'register' ? 'Account and purchase details' : heading}</h2>
      {mode === 'register' && <>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">Full name<input required maxLength={100} autoComplete="name" value={form.name} onChange={e => set('name', e.target.value)} className="mt-2 w-full rounded-xl border border-cosmic-border bg-cosmic-navy px-4 py-3"/></label>
          <label className="text-sm">Email<input required type="email" autoComplete="email" value={form.email} onChange={e => set('email', e.target.value)} className="mt-2 w-full rounded-xl border border-cosmic-border bg-cosmic-navy px-4 py-3"/></label>
          <label className="text-sm">Password<input required type="password" minLength={12} autoComplete="new-password" value={form.password} onChange={e => set('password', e.target.value)} className="mt-2 w-full rounded-xl border border-cosmic-border bg-cosmic-navy px-4 py-3"/><span className="mt-1 block text-xs text-cosmic-lavender/60">12+ characters with uppercase, lowercase, and a number.</span></label>
          <label className="text-sm">Contact number<input required type="tel" autoComplete="tel" value={form.contact} onChange={e => set('contact', e.target.value)} className="mt-2 w-full rounded-xl border border-cosmic-border bg-cosmic-navy px-4 py-3"/></label>
          <label className="text-sm">Date of birth<input required type="date" value={form.birthDate} onChange={e => set('birthDate', e.target.value)} className="mt-2 w-full rounded-xl border border-cosmic-border bg-cosmic-navy px-4 py-3 text-cosmic-ivory"/></label>
          <label className="text-sm">Time of birth<input required type="time" value={form.birthTime} onChange={e => set('birthTime', e.target.value)} className="mt-2 w-full rounded-xl border border-cosmic-border bg-cosmic-navy px-4 py-3 text-cosmic-ivory"/></label>
          <label className="text-sm">Place of birth<input required maxLength={160} value={form.birthPlace} onChange={e => set('birthPlace', e.target.value)} className="mt-2 w-full rounded-xl border border-cosmic-border bg-cosmic-navy px-4 py-3"/></label>
          <label className="text-sm">Current location<input required maxLength={160} autoComplete="address-level2" value={form.location} onChange={e => set('location', e.target.value)} className="mt-2 w-full rounded-xl border border-cosmic-border bg-cosmic-navy px-4 py-3"/></label>
          <label className="text-sm">Gender<select value={form.gender} onChange={e => set('gender', e.target.value)} className="mt-2 w-full rounded-xl border border-cosmic-border bg-cosmic-navy px-4 py-3 text-cosmic-ivory"><option value="prefer_not_to_say">Prefer not to say</option><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option></select></label>
          <label className="text-sm">Selected service<select value={form.selectedProductId} onChange={e => set('selectedProductId', e.target.value)} className="mt-2 w-full rounded-xl border border-cosmic-border bg-cosmic-navy px-4 py-3 text-cosmic-ivory">{products.map(product => <option key={product.id} value={product.id}>{product.name} · ₹{product.amountInr.toLocaleString('en-IN')}</option>)}</select></label>
        </div>
        <p className="rounded-xl border border-cosmic-gold/20 bg-cosmic-navy/40 p-3 text-sm text-cosmic-lavender/80">Selected: <strong className="text-cosmic-gold">{selectedProduct.name} · ₹{selectedProduct.amountInr.toLocaleString('en-IN')}</strong></p>
        <label className="flex items-start gap-3 rounded-xl border border-cosmic-border-subtle bg-cosmic-navy/50 p-3 text-xs leading-5 text-cosmic-lavender/70"><input type="checkbox" required checked={privacyConsent} onChange={e => setPrivacyConsent(e.target.checked)} className="mt-1 accent-amber-400"/><span>I agree that Voxigen may store these account, birth, and contact details to provide the requested services. Read the <Link to="/privacy" target="_blank" className="text-cosmic-gold underline">Privacy Policy</Link>.</span></label>
      </>}
      {(mode === 'login' || mode === 'forgot') && <label className="block text-sm">Email<input required type="email" autoComplete="email" value={form.email} onChange={e => set('email', e.target.value)} className="mt-2 w-full rounded-xl border border-cosmic-border bg-cosmic-navy px-4 py-3"/></label>}
      {(mode === 'login' || mode === 'reset') && <label className="block text-sm">{mode === 'login' ? 'Password' : 'New password'}<input required type="password" minLength={12} maxLength={128} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={form.password} onChange={e => set('password', e.target.value)} className="mt-2 w-full rounded-xl border border-cosmic-border bg-cosmic-navy px-4 py-3"/>{mode === 'reset' && <span className="mt-1 block text-xs text-cosmic-lavender/60">12+ characters with uppercase, lowercase, and a number.</span>}</label>}
      {mode === 'login' && <button type="button" onClick={() => { setMode('forgot'); setNotice(''); }} className="text-sm text-cosmic-gold underline underline-offset-4">Forgot password?</button>}
      {notice && <p role="alert" className={`rounded-xl border p-3 text-sm ${notice.startsWith('If an account exists') || notice.startsWith('Your password has been reset') ? 'border-emerald-400/30 bg-emerald-950/30 text-emerald-200' : 'border-rose-400/30 bg-rose-950/30 text-rose-200'}`}>{notice}</p>}
      <button disabled={busy || (mode === 'register' && !privacyConsent)} className="w-full rounded-xl bg-cosmic-gold px-4 py-3 font-semibold text-cosmic-navy disabled:opacity-50">{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : mode === 'forgot' ? 'Send reset link' : mode === 'reset' ? 'Reset password' : paymentReady ? `Create account and pay ₹${selectedProduct.amountInr.toLocaleString('en-IN')}` : 'Create account'}</button>
      {mode === 'register' && !paymentReady && <p className="text-xs leading-5 text-amber-200/80">You can create your account now. Checkout will be available after Razorpay is configured on the server.</p>}
      {(mode === 'login' || mode === 'register') ? <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setNotice(''); }} className="w-full text-sm text-cosmic-gold">{mode === 'login' ? 'New member? Choose a service' : 'Already registered? Sign in'}</button> : <button type="button" onClick={() => { setMode('login'); setNotice(''); setSearchParams({}, { replace: true }); }} className="w-full text-sm text-cosmic-gold">Back to sign in</button>}
    </form>
    {(mode === 'login' || mode === 'register') && productCards}
  </main>;
};
