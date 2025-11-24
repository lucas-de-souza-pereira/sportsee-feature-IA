'use client'

import { useRouter } from "next/navigation"

export default function LogoutButton() {
    const router = useRouter()

    async function onLogout() {
        await fetch('api/auth/logout', {method:'POST'})
        router.replace('/login')
    }

  return (
    <button className="text-primary cursor-pointer" onClick={onLogout}>
      Se déconnecter
    </button>
  )
}