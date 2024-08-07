// middleware.tsx
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the request is for the sign-in page
  if (pathname === '/sign-in') {
    try {
      const response = await fetch(`${process.env.ORIGIN_URL}/returnUsername`, {
        method: 'GET',
        credentials: 'include', // Include credentials if needed
      });

      if (response.ok) {
        const data = await response.json();

        // If there's a username in the response, the user is signed in
        if (data.username) {
          // Redirect to /workspace if the user is signed in
          return NextResponse.redirect(new URL('/workspace', request.url));
        }
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  }
  
  // Allow the request to proceed if not redirected
  return NextResponse.next();
}

export const config = {
  matcher: ['/sign-in'], // Apply middleware to the sign-in page
};