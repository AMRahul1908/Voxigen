import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

export const kundaliGenerateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit generation to 30 per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Kundali calculation rate limit reached. Please wait a moment before calculating another chart.'
  }
});
