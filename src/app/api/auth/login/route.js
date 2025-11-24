import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Champs invalides'},
        { status: 400}
      )
    }


    const r = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({username, password}),
      cache: 'no-store',
    });

    const text = await r.text()
    const ct = r.headers.get('content-type') || ''
    const data = ct.includes('application/json') ? JSON.parse(text || '{}') : {}

    if (!r.ok) {
      return NextResponse.json(
        { message: "Identifiants incorrect" }, 
        { status: r.status });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set('token', data.token, {
      httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production',
      path: '/', maxAge: 60 * 60 * 24 * 7,
    });
    return res;

  } catch (e){
    return NextResponse.json(
      { message: 'Service indisponible' },
      { status: 500 }
    )
  }
}
