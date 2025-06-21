import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get('user')?.value
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')

  if (isDashboard && !cookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
  ],
}
