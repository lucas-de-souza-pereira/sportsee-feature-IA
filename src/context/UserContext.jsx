'use client'

import { createContext, useEffect, useState } from 'react'

export const UserContext = createContext(null)


export default function UserProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null)
  const [userActivity, setUserActivity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/user/user-info', {
          method: 'GET',
        })
        if (!response.ok) {
          throw new Error(`Erreur lors du chargement des données : ${response.status}`)
        }

        const userDataProfile = await response.json()
        setUserInfo(userDataProfile)

        const createdAtRaw =userDataProfile?.profile?.createdAt
        const createdAt = createdAtRaw ? new Date(createdAtRaw).toISOString() : null

        if (!createdAt) {setUserActivity(null)}

        const today = new Date().toISOString()

        const params = new URLSearchParams({
          startWeek: createdAt,
          endWeek: today
        })
        const res = await fetch(`/api/user/user-activity?${params.toString()}`, {
          method: 'GET',
        })
        if (!res.ok) {
          throw new Error(`Erreur lors du chargement des données : ${res.status}`)
        }

        const userDataRunning = await res.json()
        setUserActivity(userDataRunning)

      } catch (err) {
        console.error('Erreur UserContext :', err.message)
        setError(err.message)
        setUserInfo(null)
        setUserActivity(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const value = {
    userInfo,
    userActivity,
    loading,
    error,
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}