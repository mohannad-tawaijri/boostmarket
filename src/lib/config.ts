// Use the proxy in production to avoid CORS issues with privacy browsers like Brave
const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';

export const API_URL = isProduction 
  ? '/api'  // Use Next.js API proxy in production
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
