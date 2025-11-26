
import { NextResponse } from "next/server";

const apiKey = process.env.MISTRAL_API_KEY;

export async function POST(req) {
    try{

    const { message } = await req.json()
        console.log("message", message)
    if (!message) {
        return NextResponse.json(
            {message:"Bad Request"}, {status:400}
        )
    }

    const body = {
  "model": "mistral-small-latest",
  "messages": [
    {
      "role": "system",
      "content": "Tu es un coach sportif."
    },
    {
      "role": "user",
      "content": message
    }
  ],
  "max_tokens": 100,
  "temperature": 0.3,
  "stream": false
}


    const r = await fetch('https://api.mistral.ai/v1/chat/completions',{
        method:'POST',
        headers: {'Content-Type':'application/json',
                "Authorization": `Bearer ${apiKey}`},
        body: JSON.stringify(body)
    })

    if (!r.ok){
        return NextResponse.json(
        { message: r.message }, 
        { status: r.status })
    }

    const data = await r.json()
    const answer = data.choices?.[0]?.message?.content ?? ""

    return NextResponse.json({answer})


    } catch (err){
        return NextResponse.json(
        { message: r.message }, 
        { status: r.status })
    }
    
}