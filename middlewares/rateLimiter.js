import rateLimit from 'express-rate-limit';

//  max 5 requests per minute
export const borrowerLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // only 5 requests allowed per minute
  message: "Too many borrow requests, please try again later.",
});

export const bookLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 2, // only 2 requests allowed in 10 seconds
  message: "⏳ Too many requests, try again later.",
});
