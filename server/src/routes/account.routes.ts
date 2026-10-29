import { Router, Request, Response, NextFunction } from 'express';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash, createHmac } from 'crypto';
import { promisify } from 'util';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { User } from '../models/User';
import { AuthSession } from '../models/AuthSession';
import { Purchase } from '../models/Purchase';
import { PasswordReset } from '../models/PasswordReset';
import { PRODUCTS, ProductId, ServiceEntitlement, addCalendarMonths, getProduct } from '../config/products';

const router = Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, skipSuccessfulRequests: true, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many sign-in attempts. Try again later.' } });
const registerLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many account creation attempts. Try again later.' } });
const passwordResetLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many password reset requests. Try again later.' } });
router.use((req, res, next) => {
  const origin = req.get('Origin');
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && origin) {
    const allowed = [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:5173', 'http://127.0.0.1:5173'];
    if (!allowed.includes(origin)) { res.status(403).json({ message: 'Request origin is not allowed.' }); return; }
  }
  next();
});
const scrypt = promisify(scryptCallback);
const SESSION_COOKIE = 'voxigen_session';
const SESSION_MS = 1000 * 60 * 60 * 24 * 14;
const safeUser = (user: any, purchases: any[] = []) => {
  const now = new Date();
  const currentPurchases = purchases.filter(purchase => purchase.status === 'paid' && (!purchase.validUntil || purchase.validUntil > now) && (purchase.remainingViews === null || purchase.remainingViews === undefined || purchase.remainingViews > 0));
  const servicesAllowed = [...new Set(currentPurchases.flatMap(purchase => getProduct(purchase.productId)?.services || []))];
  return { id: user._id, name: user.name, email: user.email, birthDate: user.birthDate, birthTime: user.birthTime, birthPlace: user.birthPlace, gender: user.gender, location: user.location, contact: user.contact, selectedProductId: user.selectedProductId, membershipStatus: currentPurchases.length ? 'active' : user.membershipStatus === 'active' ? 'expired' : user.membershipStatus, servicesAllowed, purchases: purchases.map(purchase => ({ productId: purchase.productId, name: getProduct(purchase.productId)?.name || purchase.productId, amountInr: purchase.amountPaise / 100, purchasedAt: purchase.createdAt, validUntil: purchase.validUntil || null, remainingViews: purchase.remainingViews ?? null, supportLifetime: purchase.supportLifetime, status: purchase.status })), };
};
const accountSummary = async (user: any) => safeUser(user, await Purchase.find({ userId: user._id }).sort({ createdAt: -1 }).lean());
const databaseReady = (res: Response) => { if (User.db.readyState === 1) return true; res.status(503).json({ message: 'Account services are unavailable until the database is configured.' }); return false; };
const readCookie = (req: Request, name: string) => (req.headers.cookie || '').split(';').map(v => v.trim()).find(v => v.startsWith(`${name}=`))?.slice(name.length + 1);
const cookieOptions = () => ({ httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' as const, path: '/', maxAge: SESSION_MS });
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
async function passwordHash(password: string) { const salt = randomBytes(16); const key = await scrypt(password, salt, 64) as Buffer; return `${salt.toString('hex')}:${key.toString('hex')}`; }
async function passwordMatches(password: string, encoded: string) { const [saltHex, keyHex] = encoded.split(':'); if (!saltHex || !keyHex) return false; const key = await scrypt(password, Buffer.from(saltHex, 'hex'), 64) as Buffer; const expected = Buffer.from(keyHex, 'hex'); return expected.length === key.length && timingSafeEqual(key, expected); }
async function createSession(userId: any, res: Response) { const token = randomBytes(32).toString('base64url'); await AuthSession.create({ userId, tokenHash: hash(token), expiresAt: new Date(Date.now() + SESSION_MS) }); res.cookie(SESSION_COOKIE, token, cookieOptions()); }

export async function requireAccount(req: Request, res: Response, next: NextFunction) {
  try {
    if (!databaseReady(res)) return;
    const token = readCookie(req, SESSION_COOKIE); if (!token) { res.status(401).json({ message: 'Sign in to continue.' }); return; }
    const session = await AuthSession.findOne({ tokenHash: hash(token), expiresAt: { $gt: new Date() } });
    if (!session) { res.clearCookie(SESSION_COOKIE, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/' }); res.status(401).json({ message: 'Your session has expired. Sign in again.' }); return; }
    (req as any).accountId = session.userId.toString(); next();
  } catch (error) { next(error); }
}
export function requireServiceEntitlement(service: ServiceEntitlement) {
  const matchingProducts = PRODUCTS.filter(product => product.services.includes(service)).map(product => product.id);
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).accountId;
      const validity = { $or: [{ validUntil: null }, { validUntil: { $gt: new Date() } }] };
      const fullAccess = await Purchase.exists({ userId, status: 'paid', productId: { $in: matchingProducts }, remainingViews: null, ...validity });
      if (fullAccess) { next(); return; }
      if (service === 'horoscope') {
        const singleView = await Purchase.findOneAndUpdate({ userId, status: 'paid', productId: 'basic_horoscope', remainingViews: { $gt: 0 }, $or: [{ validUntil: null }, { validUntil: { $gt: new Date() } }] }, { $inc: { remainingViews: -1 } }, { new: true });
        if (singleView) { next(); return; }
      }
      res.status(403).json({ message: `A current paid ${service} purchase is required.` });
    } catch (error) { next(error); }
  };
}
const requiredProduct = z.enum(['basic_horoscope', 'bronze_horoscope', 'basic_voice', 'silver_bundle', 'gold_voice']);
const registrationSchema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(254), password: z.string().min(12).max(128).regex(/[a-z]/).regex(/[A-Z]/).regex(/[0-9]/), birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), birthTime: z.string().regex(/^\d{2}:\d{2}$/), birthPlace: z.string().trim().min(2).max(160), gender: z.enum(['female', 'male', 'other', 'prefer_not_to_say']), location: z.string().trim().min(2).max(160), contact: z.string().trim().min(7).max(30), selectedProductId: requiredProduct, privacyConsent: z.literal(true) });

router.get('/plans', (_req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID || '';
  const secret = process.env.RAZORPAY_KEY_SECRET || '';
  const paymentReady = Boolean(keyId && secret && !keyId.includes('your_key') && !secret.includes('your_razorpay'));
  res.json({ products: PRODUCTS, paymentReady });
});

router.post('/register', registerLimiter, async (req, res, next) => {
  try {
    if (!databaseReady(res)) return;
    const data = registrationSchema.parse(req.body); const email = data.email.toLowerCase();
    if (await User.exists({ email })) { res.status(409).json({ message: 'An account with this email already exists. Sign in instead.' }); return; }
    const { privacyConsent: _consent, ...profile } = data;
    const user = await User.create({ ...profile, email, passwordHash: await passwordHash(data.password), membershipStatus: 'pending', privacyConsentAt: new Date() });
    await createSession(user._id, res); res.status(201).json({ user: await accountSummary(user), message: 'Account created. Complete checkout to activate your purchase.' });
  } catch (error: any) { if (error?.code === 11000) { res.status(409).json({ message: 'An account with this email already exists.' }); return; } next(error); }
});

router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    if (!databaseReady(res)) return;
    const data = z.object({ email: z.string().email(), password: z.string().min(1).max(128) }).parse(req.body);
    const user = await User.findOne({ email: data.email.toLowerCase() }).select('+passwordHash');
    const matches = user ? await passwordMatches(data.password, user.passwordHash) : (await scrypt(data.password, Buffer.alloc(16), 64), false);
    if (!matches || !user) { res.status(401).json({ message: 'Email or password is incorrect.' }); return; }
    await createSession(user._id, res); res.json({ user: await accountSummary(user) });
  } catch (error) { next(error); }
});

router.post('/password/forgot', passwordResetLimiter, async (req, res, next) => {
  try {
    if (!databaseReady(res)) return;
    const { email } = z.object({ email: z.string().trim().email().max(254) }).parse(req.body);
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    if (!apiKey || !from) { res.status(503).json({ message: 'Password reset email is not configured on this server yet.' }); return; }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      const token = randomBytes(32).toString('hex');
      const tokenHash = hash(token);
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
      await PasswordReset.deleteMany({ userId: user._id });
      await PasswordReset.create({ userId: user._id, tokenHash, expiresAt });

      const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
      const resetUrl = `${clientUrl}/account?reset=${encodeURIComponent(token)}`;
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from,
            to: [user.email],
            subject: 'Reset your Voxigen password',
            html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#211b45"><h2>Reset your Voxigen password</h2><p>Use the button below to choose a new password. This link expires in 30 minutes and can only be used once.</p><p><a href="${resetUrl}" style="display:inline-block;padding:12px 20px;border-radius:8px;background:#d6b46a;color:#101329;text-decoration:none;font-weight:bold">Reset password</a></p><p>If you did not request this, you can ignore this email.</p></div>`,
          }),
          signal: AbortSignal.timeout(10000),
        });
        if (!emailResponse.ok) {
          await PasswordReset.deleteOne({ tokenHash });
          console.error(`[PasswordReset] Email provider returned status ${emailResponse.status}.`);
        }
      } catch (emailError) {
        await PasswordReset.deleteOne({ tokenHash });
        console.error('[PasswordReset] Email delivery failed.');
      }
    }

    res.json({ message: 'If an account exists for that email, a password reset link will arrive shortly.' });
  } catch (error) { next(error); }
});

router.post('/password/reset', passwordResetLimiter, async (req, res, next) => {
  try {
    if (!databaseReady(res)) return;
    const { token, password } = z.object({
      token: z.string().regex(/^[a-f0-9]{64}$/i),
      password: z.string().min(12).max(128).regex(/[a-z]/).regex(/[A-Z]/).regex(/[0-9]/),
    }).parse(req.body);
    const reset = await PasswordReset.findOneAndDelete({ tokenHash: hash(token), expiresAt: { $gt: new Date() } });
    if (!reset) { res.status(400).json({ message: 'This password reset link is invalid or has expired. Request a new one.' }); return; }

    const user = await User.findByIdAndUpdate(reset.userId, { $set: { passwordHash: await passwordHash(password) } });
    if (!user) { res.status(400).json({ message: 'This password reset link is invalid or has expired. Request a new one.' }); return; }
    await Promise.all([
      PasswordReset.deleteMany({ userId: reset.userId }),
      AuthSession.deleteMany({ userId: reset.userId }),
    ]);
    res.json({ message: 'Your password has been reset. Sign in with your new password.' });
  } catch (error) { next(error); }
});

router.get('/me', requireAccount, async (req, res, next) => { try { const user = await User.findById((req as any).accountId); if (!user) { res.status(401).json({ message: 'Account not found.' }); return; } res.json({ user: await accountSummary(user) }); } catch (error) { next(error); } });
router.post('/logout', requireAccount, async (req, res, next) => { try { const token = readCookie(req, SESSION_COOKIE); if (token) await AuthSession.deleteOne({ tokenHash: hash(token) }); res.clearCookie(SESSION_COOKIE, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/' }); res.json({ success: true }); } catch (error) { next(error); } });

router.post('/payments/order', requireAccount, async (req, res, next) => {
  try {
    if (!databaseReady(res)) return;
    const { productId } = z.object({ productId: requiredProduct }).parse(req.body);
    const keyId = process.env.RAZORPAY_KEY_ID, secret = process.env.RAZORPAY_KEY_SECRET;
    const product = getProduct(productId);
    if (!keyId || !secret || !product) { res.status(503).json({ message: 'Checkout is not configured yet. Please contact Voxigen.' }); return; }
    const userId = (req as any).accountId; const user = await User.findById(userId); if (!user) { res.status(401).json({ message: 'Sign in again to continue.' }); return; }
    const receipt = `vox_${randomBytes(12).toString('hex')}`;
    const gatewayResponse = await fetch('https://api.razorpay.com/v1/orders', { method: 'POST', headers: { 'Authorization': `Basic ${Buffer.from(`${keyId}:${secret}`).toString('base64')}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: product.amountInr * 100, currency: 'INR', receipt, notes: { userId: userId.toString(), productId } }) });
    const order = await gatewayResponse.json() as any;
    if (!gatewayResponse.ok || !order.id) { res.status(502).json({ message: 'Payment provider could not create an order. Please try again.' }); return; }
    await Purchase.create({ userId, productId, amountPaise: product.amountInr * 100, orderId: order.id, status: 'created' });
    res.json({ keyId, orderId: order.id, amount: order.amount, currency: order.currency, name: user.name, email: user.email, contact: user.contact, product });
  } catch (error) { next(error); }
});

router.post('/payments/verify', requireAccount, async (req, res, next) => {
  try {
    if (!databaseReady(res)) return;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = z.object({ razorpay_order_id: z.string().min(5), razorpay_payment_id: z.string().min(5), razorpay_signature: z.string().length(64) }).parse(req.body);
    const secret = process.env.RAZORPAY_KEY_SECRET; if (!secret) { res.status(503).json({ message: 'Payment verification is not configured.' }); return; }
    const purchase = await Purchase.findOne({ userId: (req as any).accountId, orderId: razorpay_order_id });
    if (!purchase) { res.status(400).json({ message: 'Payment order not found.' }); return; }
    const expected = createHmac('sha256', secret).update(`${purchase.orderId}|${razorpay_payment_id}`).digest();
    const supplied = Buffer.from(razorpay_signature, 'hex');
    if (supplied.length !== expected.length || !timingSafeEqual(expected, supplied)) { res.status(400).json({ message: 'Payment signature validation failed.' }); return; }
    const paymentResponse = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(razorpay_payment_id)}`, { headers: { 'Authorization': `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${secret}`).toString('base64')}` } });
    const payment = await paymentResponse.json() as any;
    if (!paymentResponse.ok || payment.order_id !== purchase.orderId || payment.amount !== purchase.amountPaise || payment.currency !== 'INR' || payment.status !== 'captured') { res.status(402).json({ message: 'Payment is not captured yet. Your plan has not been activated.' }); return; }
    if (purchase.status !== 'paid') {
      const product = getProduct(purchase.productId as ProductId);
      if (!product) { res.status(400).json({ message: 'This purchased product is no longer available.' }); return; }
      purchase.status = 'paid'; purchase.paymentId = razorpay_payment_id;
      purchase.validUntil = product.durationMonths ? addCalendarMonths(new Date(), product.durationMonths) : undefined;
      purchase.remainingViews = product.oneTimeViews;
      purchase.supportLifetime = purchase.productId === 'gold_voice';
      await purchase.save();
    }
    await User.updateOne({ _id: purchase.userId }, { $set: { selectedProductId: purchase.productId, membershipStatus: 'active' } });
    const user = await User.findById(purchase.userId); res.json({ success: true, user: await accountSummary(user) });
  } catch (error) { next(error); }
});

export default router;
