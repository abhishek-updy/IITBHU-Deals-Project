// Simple, dependency-free in-memory rate limiter for sensitive endpoints (OTP, Forgot Password)
// Protects Brevo free quota from being exhausted by malicious scripts.
const requestLog = new Map();

/**
 * @param {number} maxRequests - Max requests allowed in the time window (default: 4)
 * @param {number} windowMinutes - Time window in minutes (default: 10 minutes)
 */
export const otpRateLimiter = (maxRequests = 4, windowMinutes = 10) => {
  const windowMs = windowMinutes * 60 * 1000;

  return (req, res, next) => {
    // Rate limit by email if provided in body, otherwise fallback to IP address
    const key = (req.body?.email ? req.body.email.toLowerCase().trim() : null) || req.ip;
    const now = Date.now();

    const record = requestLog.get(key) || [];
    // Keep only timestamps within the current window
    const recentRequests = record.filter((timestamp) => now - timestamp < windowMs);

    if (recentRequests.length >= maxRequests) {
      const waitMinutes = Math.ceil((recentRequests[0] + windowMs - now) / 60000);
      return res.status(429).json({
        success: false,
        message: `Too many attempts. Please wait ${waitMinutes} minute(s) before requesting another email.`,
      });
    }

    recentRequests.push(now);
    requestLog.set(key, recentRequests);

    // Prevent memory leaks by clearing old entries if map gets too large
    if (requestLog.size > 5000) {
      for (const [k, timestamps] of requestLog.entries()) {
        const valid = timestamps.filter((t) => now - t < windowMs);
        if (valid.length === 0) {
          requestLog.delete(k);
        } else {
          requestLog.set(k, valid);
        }
      }
    }

    next();
  };
};
