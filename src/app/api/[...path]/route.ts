import { NextRequest, NextResponse } from 'next/server';

// Allow up to 60s so Render's free-tier cold start (often 30-50s) can complete
// before the serverless function times out.
export const maxDuration = 60;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://boost-api-16ta.onrender.com';

function proxyError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error('Proxy error:', message);
  return NextResponse.json(
    { error: 'Upstream API unreachable', detail: message },
    { status: 502 },
  );
}

// Whitelist of allowed API path prefixes
const ALLOWED_PATHS = [
  'auth',
  'users',
  'services',
  'orders',
  'payment',
  'reviews',
  'upload',
  'chat',
  'favorites',
  'custom-offers',
];

function isAllowedPath(pathSegments: string[]): boolean {
  if (pathSegments.length === 0) return false;
  return ALLOWED_PATHS.includes(pathSegments[0]);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  if (!isAllowedPath(path)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const url = `${API_URL}/${path.join('/')}${request.nextUrl.search}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const authHeader = request.headers.get('Authorization');
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  try {
    const response = await fetch(url, { headers });
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return proxyError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  if (!isAllowedPath(path)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const url = `${API_URL}/${path.join('/')}`;
  
  const authHeader = request.headers.get('Authorization');
  const contentType = request.headers.get('Content-Type') || '';

  try {
    let response: Response;

    // Check if it's a file upload (multipart/form-data)
    if (contentType.includes('multipart/form-data')) {
      // For file uploads, pass the request body directly
      const formData = await request.formData();
      
      const headers: HeadersInit = {};
      if (authHeader) {
        headers['Authorization'] = authHeader;
      }
      // Don't set Content-Type - let fetch set it with boundary
      
      response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });
    } else {
      // Regular JSON request
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (authHeader) {
        headers['Authorization'] = authHeader;
      }

      // Some POST endpoints (like favorites) don't send a body
      let body: string | undefined;
      try {
        const json = await request.json();
        body = JSON.stringify(json);
      } catch {
        // No body — that's fine
      }

      response = await fetch(url, {
        method: 'POST',
        headers,
        body,
      });
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return proxyError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  if (!isAllowedPath(path)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const url = `${API_URL}/${path.join('/')}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const authHeader = request.headers.get('Authorization');
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  try {
    const body = await request.json();
    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return proxyError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  if (!isAllowedPath(path)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const url = `${API_URL}/${path.join('/')}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const authHeader = request.headers.get('Authorization');
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return proxyError(error);
  }
}
