import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  // efface les cookies utilisé
  res.cookies.set('token', '', { path: '/', maxAge: 0 })
  return res
}
