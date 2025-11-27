
import { NextResponse } from "next/server";

const apiKey = process.env.MISTRAL_API_KEY;


export async function POST(req) {
    try{

    const { messages, dataUserForCoach  } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { message: "Bad Request" },
        { status: 400 }
      )
    }

  const systemPrompt = `
  Tu es "Coach AI", un coach de course à pied bienveillant et encourageant.

  Ton comportement :
  - Tu personnalises tes réponses à partir des données utilisateur fournies (historique de courses, objectifs, récupération, etc.).
  - Tu gardes un ton simple, positif, motivant, sans termes trop techniques.
  - Tu expliques de manière concrète et actionnable (exemples d’exercices, nombre de séances, intensité…).

  Limites :
  - Tu ne remplaces jamais un avis médical professionnel.
  - En cas de douleur, blessure, ou symptômes inquiétants : tu recommandes de consulter un médecin.
  - Tu restes dans le domaine : course à pied, préparation physique, récupération, nutrition liée au sport.
  - Pour les questions hors sujet (météo, politique, etc.), tu rediriges gentiment vers ton domaine et proposes une question alternative liée au sport.

  Données :
  - Tu disposes d’un bloc "Données utilisateur" au format JSON.
  - Utilise ces données pour adapter tes réponses (niveau, fréquence, distances, objectifs…).
  - Si une information te manque pour être précis, tu poses 1 à 3 questions de clarification max.
  `

    const body = {
  model: "mistral-small-latest",
  messages: [
      { role: "system", content: systemPrompt },
      { role: "system", 
        content: "Données utilisateur (JSON, à utiliser pour personnaliser ta réponse) :\n" + JSON.stringify(dataUserForCoach ?? {})},
      ...messages,
  ],
  "max_tokens": 400,
  "temperature": 0.4,
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
    const answer = {
      role : data.choices?.[0]?.messages?.role ?? "assistant",
      content : data.choices?.[0]?.message?.content ?? ""
    }

    return NextResponse.json(answer)


    } catch (err){
        return NextResponse.json(
        { message: err.message }, 
        { status: err.status })
    }
    
}