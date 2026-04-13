// In production (Vercel), use the API proxy to avoid CORS issues with Brave/privacy browsers
// The proxy routes requests through the same domain
export const API_URL = process.env.NODE_ENV === 'production'
  ? '/api'  // Use Next.js API proxy in production
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');

// Direct backend URL — used for full-page redirects (e.g. Google OAuth flow)
// where a proxy won't work because the browser must hit the backend directly
// and the backend must redirect the user back to the frontend.
export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  || (process.env.NODE_ENV === 'production'
    ? 'https://boost-api-16ta.onrender.com'
    : 'http://localhost:3001');
