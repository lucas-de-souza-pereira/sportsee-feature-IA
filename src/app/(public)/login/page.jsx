'use client'

import Image from "next/image"
import Link from "next/link"

import Brand from "@/components/ui/Brand"
import Logo from "@/components/ui/Logo"

import { useRouter } from 'next/navigation'
import { useState } from "react"

export default function LoginPage() {

  const router = useRouter()
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')

    // const username = "emmaleroy"
    // const password = "password789"
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body : JSON.stringify({username,password})
      })

      if (response.ok){
        router.push('/dashboard')
        return
      } 

      const { message } = await response.json().catch(() => {})
      if (response.status === 400) setError(message || 'Champs invalides')
      else if (response.status === 401) setError(message || "Identifiants incorrect")
      else if (response.status === 500) setError(message || 'Service indisponible')

    } catch {
      setError('Réseau indisponible')
    }
  }
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[.40fr_.60fr]">
      <section className="relative flex flex-col items-center justify-center" 
      aria-labelledby="login-title">

        <div className="absolute left-6 top-6 flex items-center gap-1.25">
          <Logo/>
          <Brand/>
        </div>

        <div className="bg-foreground p-10 rounded-md flex flex-col gap-10">
          <h1 className="typo-xl text-primary">Transformez<br/>vos stats en résultats</h1>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <fieldset className="typo-lg">Se connecter</fieldset>

            <div className="flex flex-col">
            <label className="typo-sm text-tertiary" htmlFor="email">Identifiant</label>
            <input id="username" name="username" type="text" 
            className="border-[0.5px] border-tertiary rounded-sm h-14 mt-2 cursor-pointer hover:border-primary focus:border-none"/>
            </div>

            <div className="flex flex-col">
            <label className="typo-sm text-tertiary" htmlFor="password">Mot de passe</label>
            <input id="password" name="password" type="password" 
            className="border-[0.5px] border-tertiary rounded-sm h-14 mt-2 cursor-pointer hover:border-primary focus:border-none"/>

            {error && <p className="text-red-600 p-1.5 text-center">{error}</p>}
            </div>

            <button className="btn btn-primary">Se connecter</button>
          </form>

          <Link href={"/"}><p className="typo-sm">Mot de passe oublié ?</p></Link>

        </div>
      </section>

      <section className="relative hidden lg:block">

        <Image
          src="/login-picture.jpg"
          alt="image course à pied"
          fill
          style={{ objectFit: "cover" }}
          sizes="(min-width:1024px) 50vw, 100vw"
          priority
          />

        <span className="absolute right-6 bottom-7.5 bg-foreground rounded-[50px] text-primary typo-xs p-4">Analysez vos performances en un clin d’œil, <br/> suivez vos progrès et atteignez vos objectifs.</span>

      </section >


    </div>
  )
}