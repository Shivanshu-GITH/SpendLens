// Simple IP-based rate limiter for MVP
// In a real production app, use Redis or a similar store
const rateLimitMap = new Map<string, number[]>();

const LIMIT = 3; // 3 requests
const WINDOW = 60 * 60 * 1000; // 1 hour

export function rateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  
  // Remove timestamps outside the window
  const recentTimestamps = timestamps.filter(t => now - t < WINDOW);
  
  if (recentTimestamps.length >= LIMIT) {
    return false;
  }
  
  recentTimestamps.push(now);
  rateLimitMap.set(ip, recentTimestamps);
  return true;
}
