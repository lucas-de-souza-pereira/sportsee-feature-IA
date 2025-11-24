import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function GET(req) {
    try { 

        const cookiesStore = await cookies()
        const token = cookiesStore.get('token')?.value

        const { searchParams } = new URL(req.url)

        const search = new URLSearchParams({
            startWeek: searchParams.get("startWeek"),
            endWeek: searchParams.get('endWeek')
        })

        if (!token) {return NextResponse.json(
            {message: 'Authentication required'}
        )}

        const r = await fetch(`http://localhost:8000/api/user-activity?${search}`,{
            method: 'GET',
            headers: {Authorization : `Bearer ${token}`}
        }
    )

    if (!r.ok)  {return NextResponse.json(
            {message: r.message}
        )}

    const data = await r.json()
    return NextResponse.json(data)
    
    }

    catch (e){
        return NextResponse.json(
        { message: 'Service indisponible' },
        { status: 500 }
    )
    }
}