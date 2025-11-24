
'use client'

import { useUserProfil, useUserInfo, useRunningStats,useWeeklyStats ,useWeeklyDistances, useWeeklyBpm, useBackendStatus } from "@/hooks/useUser"

import CtaConversation from "./components/CtaConversation"
import ProfileCard from "../components/ProfilCard"
import Acheivement from "./components/Acheivement"
import WeeklyActivity from "./components/WeeklyActivity"
import Loader from "@/components/ui/Loader"

import WeeklyDistanceChart from "./components/WeeklyDistanceChart"
import Piechart from "./components/Piechart"
import WeeklyBpmChart from "./components/WeeklyBpmChart"

import { formatShortDate } from "../../../../utils/formatters"

export default function DashboardPage() {
  const { profilePicture, createdAt } = useUserProfil()
  const { firstName, lastName } = useUserInfo()
  const { totalDistance } = useRunningStats()
  const { start, end, weeklyGoal, weeklyRun, weeklyDuration, weeklyDistance} = useWeeklyStats()
  const { weeklyDistanceToCharts } = useWeeklyDistances()
  const { daysBpmToCharts } = useWeeklyBpm()
  const { loading, error } = useBackendStatus()

  if (loading) {return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader/>
    </div>
  )}
  if (error) {return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="error">{error}</p>
        </div>
    )}

  return (
    
    <div className="px-10">
      <CtaConversation/>

      <section className="bg-linear-180 from-foreground to-background rounded-md mt-10 px-13 py-8 flex flex-row justify-between items-center ">
        <h1 className="sr-only">Tableau de bord</h1>
        <ProfileCard 
        firstName={firstName}
        lastName={lastName}
        createdAt={createdAt}
        profilePicture={profilePicture}
        />
        <Acheivement acheivement={totalDistance}/>
      </section>

      <section className="mt-26">
        <h2 className="typo-lg">Vos dernières performances</h2>

        <div className="mt-8 flex flex-col min-[1160px]:flex-row gap-6 ">
          <div className="max-[1160px]:w-4/6 max-[1160px]:m-auto">
            <WeeklyDistanceChart weeks={weeklyDistanceToCharts}/>
          </div>
          <div className="flex-1 max-[1160px]:w-4/6 max-[1160px]:m-auto">
           <WeeklyBpmChart days={daysBpmToCharts}/>
          </div>

        </div>


      </section>
      

      <section className="mt-19">
        <h2 className="typo-lg">Cette semaine</h2>
        <p className="mt-2 typo-base text-tertiary">Du {formatShortDate(start)} au {formatShortDate(end)}</p>
        
        <div className="mt-8 mb-22.5 flex flex-row flex-wrap gap-7.5 ">
          <div className="2xl:w-5/12">
                      <Piechart done={weeklyRun} goal={weeklyGoal}/>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <WeeklyActivity 
            label={"Durée d’activité"}
            value={weeklyDuration}
            suffix={"minutes"}
            color={"blue"}
            />
            <WeeklyActivity 
            label={"Distance"}
            value={weeklyDistance}
            suffix={"kilomètres"}
            color={"orange"}
            />
          </div>
        </div>
        
        


      </section>

    </div>
  )
}