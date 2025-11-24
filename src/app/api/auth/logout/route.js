import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  // efface le cookie utilisé (token OU session)
  res.cookies.set('token', '', { path: '/', maxAge: 0 })
  res.cookies.set('session', '', { path: '/', maxAge: 0 })
  return res
}
