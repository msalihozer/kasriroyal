import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // In a real app, verify JWT token here
    // For now, we assume client-side protection or this middleware can check for cookie existence

    // const token = request.cookies.get('token')
    // if (!token && !request.nextUrl.pathname.startsWith('/login')) {
    //   return NextResponse.redirect(new URL('/login', request.url))
    // }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
