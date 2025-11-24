import { NextResponse } from 'next/server'
const PUBLIC = ['/', '/login']
const PROTECTED = ['/dashboard', '/profile']

export default function proxy(req) {
  const { pathname } = req.nextUrl
  const isPublic = PUBLIC.some(p => pathname === p || pathname.startsWith(p + '/'))
  const isProtected = PROTECTED.some(p => pathname === p || pathname.startsWith(p + '/'))

  const isAuth = Boolean(req.cookies.get('token')?.value || req.cookies.get('session')?.value)

  if (isProtected && !isAuth) {
    const url = req.nextUrl.clone(); url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  if (isPublic && isAuth && !pathname.startsWith('/dashboard')) {
    const url = req.nextUrl.clone(); url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = { matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'] }
