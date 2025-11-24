'use client'

import { useContext } from 'react'
import { UserContext } from '@/context/UserContext'

export function useUser() {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error(
      'useUser doit être utilisé à l\'intérieur d\'un UserProvider. ' +
      'Assurez-vous que votre composant est enveloppé par <UserProvider>.'
    )
  }

  return context
}

export function useUserInfo() {
  const { userInfo } = useUser()
  return {
    firstName: userInfo?.profile?.firstName,
    lastName: userInfo?.profile?.lastName,
    age: userInfo?.profile?.age,
    gender: userInfo?.profile?.gender,
    height: userInfo?.profile?.height,
    weight: userInfo?.profile?.weight,
  }
}

export function useBackendStatus(){
  const { loading, error } = useUser()
  return {
    loading,
    error
  }
}

export function useUserProfil(){
    const { userInfo } = useUser()
    return {
        profilePicture: userInfo?.profile?.profilePicture,
        createdAt: userInfo?.profile?.createdAt,
    }
}


export function useRunningStats(){
  const { userInfo, userActivity } = useUser()

  const totalDuration = userInfo?.statistics?.totalDuration
  
  const totalCalorie = calculateTotalRunningData(userActivity, "caloriesBurned") 
  const totalDistanceRaw = userInfo?.statistics?.totalDistance
  const totalDistance = parseFloat(totalDistanceRaw)
  const totalDaysoff = calculateDaysOff(userActivity)
  const totalSession =  userInfo?.statistics?.totalSessions
  return {
    totalDuration,
    totalCalorie,
    totalDistance,
    totalDaysoff,
    totalSession,
  }
}



export function useWeeklyStats(){
  const { userActivity } = useUser()

  const today = new Date()
  const day = today.getDay()
  
  // Début de semaine
  const diffToMonday = (day + 6) % 7
  const start = new Date(today)
  start.setDate(today.getDate() - diffToMonday)

  // Fin de semaine 
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  
  // const weeklyGoal = userData?.weeklyGoal ?? 0
  const weeklyGoal = 2

  // filtres le nombre de courses par semaines
  const runningData = userActivity ?? []
  const weeklyRuns = runningData.filter((run) => {
    const date = new Date(run.date)
    return date >= start && date <= end
  })

  const weeklyRun = weeklyRuns.length
  const weeklyDuration = weeklyRuns.reduce((sum, run)=> sum + (run.duration ?? 0),0)
  const weeklyDistance = weeklyRuns.reduce((sum, dis)=> sum + (dis.distance ?? 0),0)
  return{
    start,
    end,
    weeklyGoal,
    weeklyRun,
    weeklyDuration,
    weeklyDistance
  }
}

/**
 * Calcul le total de la valeur recherchée 
 * @param {object} runningData 
 * @param {string} data // mot clé exemple caloriesBurned
 * @returns {int} // somme de la valeur recherchée
 */
function calculateTotalRunningData(runningData, data){
    if (!runningData || runningData.length === 0) return 0
    return Math.round(runningData.map(d => d?.[data]).reduce((a, c) => a + c))
}


/**
 * extrait les dates sous format YYYY-MM-DD pour calculer les jours de repos
 * @param {object} runningData 
 * @returns {int} // sommes des jours de repos
 */
function calculateDaysOff(runningData){

  if (!runningData || runningData.length === 0) return 0

  const dates = runningData.map(d => new Date(d.date)).sort((a,b) => a-b)

  if (dates.length < 2) return 0

  let daysOff = 0

  for (let i = 1; i < dates.length; i++){
    const dateStart = dates[i-1]
    const dateEnd = dates[i]

    const diff = Math.round(
      (dateEnd - dateStart) / (1000*60*60*24))

    if (diff > 1) { daysOff += diff -1}
  }

  return daysOff
}

/**
 * 
 * @returns {Array[{start:Date, end:Date, km:int}]}
 */
export function useWeeklyDistances() {
  const { userActivity } = useUser()
  const runningData = userActivity ?? []
  const weeklyDistanceToCharts = []

  if (!runningData.length) return { weeklyDistanceToCharts }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // runs passés
  const pastRuns = runningData.filter((run) => {
    const d = new Date(run.date)
    d.setHours(0, 0, 0, 0)
    return d <= today
  })

  if (!pastRuns.length) return { weeklyDistanceToCharts }

  // première date de run
  const firstRunDate = pastRuns.reduce((min, run) => {
    const d = new Date(run.date)
    d.setHours(0, 0, 0, 0)
    return d < min ? d : min
  }, new Date(pastRuns[0].date))

  // lundi de la première semaine
  const firstDay = firstRunDate.getDay() 
  const diffToMondayFirst = (firstDay + 6) % 7
  const firstWeekStart = new Date(firstRunDate)
  firstWeekStart.setDate(firstRunDate.getDate() - diffToMondayFirst)
  firstWeekStart.setHours(0, 0, 0, 0)

  // lundi de la semaine actuelle
  const todayDay = today.getDay()
  const diffToMondayCurrent = (todayDay + 6) % 7
  const thisWeekMonday = new Date(today)
  thisWeekMonday.setDate(today.getDate() - diffToMondayCurrent)
  thisWeekMonday.setHours(0, 0, 0, 0)

  // lundi de la semaine denière
  const currentWeekStart = new Date(thisWeekMonday)
  currentWeekStart.setDate(thisWeekMonday.getDate() - 7)

  // ajoute toutes les semaines de firstWeekStart → currentWeekStart dans week
  for (
    let cursor = new Date(firstWeekStart);
    cursor <= currentWeekStart;
    cursor.setDate(cursor.getDate() + 7)
  ) {
    const start = new Date(cursor)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    end.setHours(23, 59, 59, 999)

    const weeklyRuns = pastRuns.filter((run) => {
      const d = new Date(run.date)
      d.setHours(0, 0, 0, 0)
      return d >= start && d <= end
    })

    const km = weeklyRuns.reduce(
      (sum, run) => sum + (run.distance ?? 0),
      0
    )

    weeklyDistanceToCharts.push({ start, end, km })
  }

  return { weeklyDistanceToCharts }
}


/**
 * 
 * @returns {Array[{day:Date, minBpm:int, maxBpm:int, averageBpm}]}
 */
export function useWeeklyBpm() {
  const { userActivity } = useUser()
  const runningData = userActivity ?? []
  const daysBpmToCharts = []

  if (!runningData.length) return { daysBpmToCharts }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // runs passés
  const pastRuns = runningData.filter((run) => {
    const d = new Date(run.date)
    d.setHours(0, 0, 0, 0)
    return d <= today
  })
  if (!pastRuns.length) return { daysBpmToCharts }

  for (let p of pastRuns){
    const day = new Date(p.date)
    day.setHours(0,0,0,0)
    const min = p.heartRate?.min ?? 0
    const max = p.heartRate?.max ?? 0
    const avg = p.heartRate?.average ?? 0

    daysBpmToCharts.push({day,min,max,avg})
  }

  return { daysBpmToCharts }
}
