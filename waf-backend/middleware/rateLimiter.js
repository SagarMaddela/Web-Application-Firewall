import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

// Rate Limiting: Limit requests per IP
export const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 10, 
  message: { message: "⏳ Too many requests, please try again later." },
  headers: true,
});


export const speedLimiter = slowDown({
    windowMs: 1 * 60 * 1000, 
    delayAfter: 5, 
    delayMs: () => 1000, 
  });
