
import { NextResponse } from "next/server";

const apiKey = process.env.MISTRAL_API_KEY;

async function callMistral(body, { retries = 2, timeoutMs = 8000 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      })

      clearTimeout(timeout)

      if ([429, 500, 502, 503].includes(res.status) && attempt < retries) {
        const delay = 500 * (attempt + 1)
        await new Promise((r) => setTimeout(r, delay))
        continue
      }
      return res

          } catch (err) {
      clearTimeout(timeout)

      const isLastAttempt = attempt === retries
      if (isLastAttempt) {
        throw err
      }
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)))
    }
  }
}

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

    const r = await callMistral(body)

    if (!r.ok){

      const errorText = await r.text()
      console.error("Erreur Mistral :", r.status, errorText)

      if (r.status === 429) {
        return NextResponse.json(
          { message: "L'API Mistral est temporairement saturée. Merci de réessayer dans quelques secondes." },
          { status: 429 }
          )
      }

  
    return NextResponse.json(
      { message: "Erreur lors de l'appel à Mistral.", detail: errorText },
      { status: r.status }
    )
    }



    const data = await r.json()
    const answer = {
      role : data.choices?.[0]?.messages?.role ?? "assistant",
      content : data.choices?.[0]?.message?.content ?? ""
    }

    return NextResponse.json(answer)


    } catch (err){
      console.error("Erreur serveur ou réseau :", err)
      return NextResponse.json(
        { message: "Erreur réseau ou serveur lors de l'appel à Mistral." },
        { status: 500 }
        )
    }
    
}