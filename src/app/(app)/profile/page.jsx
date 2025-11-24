'use client'
import { useUserProfil, useUserInfo, useRunningStats, useBackendStatus } from "@/hooks/useUser"
import { formatLongDate, formatDuration } from "../../../../utils/formatters"

import ProfileCard from "../components/ProfilCard"
import ProfilDetail from "./components/ProfilDetail"
import DataProfil from "./components/DataProfil"
import Loader from "@/components/ui/Loader"

export default function ProfilePage() {    
    const { profilePicture, createdAt } = useUserProfil()
    const { firstName, lastName, age, gender, height, weight } = useUserInfo()
    const { totalDuration, totalCalorie, totalDistance, totalDaysoff, totalSession  } = useRunningStats()
    const { loading, error} = useBackendStatus()

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
    <div className="mt-26 flex flex-row gap-14">
        <section className="">
            <h1 className="sr-only">Profil</h1>
            <div className="card px-13 py-6 w-[508px]">
                <ProfileCard 
                firstName={firstName}
                lastName={lastName}
                createdAt={createdAt}
                profilePicture={profilePicture}            
                />
            </div>

            <div className="mt-4">
            <ProfilDetail
            age = {age}
            gender = {gender}
            height = {height}
            weight = {weight} 
            /> 
            </div>
        </section>

        <section className="flex-1 w-full">
            <h2 className="typo-lg">Vos statistiques</h2>
            <p className="typo-sm text-tertiary mt-1">depuis le {formatLongDate(createdAt)}</p>

            <div className="flex flex-row flex-wrap gap-4.75 mt-8">
                <DataProfil
                label={"Temps total couru"}
                value={formatDuration(totalDuration,"h") + "h"}
                suffix={formatDuration(totalDuration,"m")+"min"}
                />
                <DataProfil
                label={"Calories brûlées"}
                value={totalCalorie? totalCalorie : 0}
                suffix={"cal"}
                />
                <DataProfil
                label={"Distance totale parcourue"}
                value={totalDistance? totalDistance : 0}
                suffix={"km"}
                />
                <DataProfil
                label={"Nombre de jours de repos"}
                value={totalDaysoff? totalDaysoff : 0}
                suffix={"jours"}
                />
                <DataProfil
                label={"Nombre de sessions"}
                value={totalSession? totalSession : 0}
                suffix={"sessions"}
                />
            </div>
        </section>
    </div>
  )
}