import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Exclude requests for static files, API routes, and favicon
  if (
    pathname.startsWith('/_next') || // Next.js static files
    pathname.startsWith('/api') || // API routes
    pathname === '/favicon.ico' // Favicon
  ) {
    return NextResponse.next()
  }

  if (pathname !== '/') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}
