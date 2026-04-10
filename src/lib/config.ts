// In production (Vercel), use the API proxy to avoid CORS issues with Brave/privacy browsers
// The proxy routes requests through the same domain
export const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Use Next.js API proxy in production
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
