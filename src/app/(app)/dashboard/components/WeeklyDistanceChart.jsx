"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useState } from "react"
import { formatDayMonthDate } from "../../../../../utils/formatters"

const BAR_COLOR = "#B6BDFC"
const PAGE_SIZE = 4

function getAverageKm(data) {
  if (!data.length) return 0
  const total = data.reduce((sum, d) => sum + d.km, 0)
  return Math.round((total / data.length) * 10) / 10
}

const CustomTooltip = ({active, payload}) => {
  if (!active || !payload?.length) return null

  const data = payload[0].payload
  const km = Math.round(data.km * 10) / 10
  const start = data.start ?? null
  const end = data.end ?? null

  const format = (d) => d.toLocaleString("fr-FR", { day: "2-digit", month: "2-digit" })

  return(
    <div className="py-5.5 px-3 bg-[#000000] opacity-94  text-[#E7E7E7] rounded-sm">
      {start && end && (
        <p className="typo-xs">{format(start)} au {format(end)}</p>
      )}
      <p className="typo-base mt-0.5">{km} km</p>
    </div>
  )

}

export default function WeeklyDistanceChart({weeks}) {
  const [page, setPage] = useState(0)    

  if (!weeks.length) {
    return (
      <article className="card px-8 py-6">
        <p className="typo-sm text-[#B6BDFC]">
          Pas encore de kilomètres enregistrés 
        </p>
      </article>
    )
  }

  const totalWeeks = weeks.length
  const maxPage = Math.floor((totalWeeks - 1) / PAGE_SIZE)

  const safePage = Math.min(Math.max(page, 0), maxPage)

  const lastIndex = totalWeeks - 1 - safePage * PAGE_SIZE

  const chartData = []
  const usedWeeks = [] 

  for (let slot = 3; slot >= 0; slot--) { // 3→S4, 2→S3, 1→S2, 0→S1
    const weekIndex = lastIndex - (3 - slot) // S4: -0, S3:-1, S2:-2, S1:-3

    const label = `S${slot + 1}`

    if (weekIndex >= 0) {
      const w = weeks[weekIndex]
      chartData[slot] = { start: w.start, end: w.end, week: label, km: w.km }
      usedWeeks.push(w)
    } else {
      chartData[slot] = { week: label, km: 0 }
    }
  }

  const nonEmptyWeeks = usedWeeks.length ? usedWeeks : [weeks[0]]
  const firstWeek = nonEmptyWeeks[nonEmptyWeeks.length - 1]
  const lastWeek = nonEmptyWeeks[0]

  const labelRange = `${formatDayMonthDate(firstWeek.start)} - ${formatDayMonthDate(
    lastWeek.end
  )}`

  const avg = getAverageKm(chartData)

  const canGoPrev = safePage < maxPage 
  const canGoNext = safePage > 0       

  return (
    <article className="card px-10 py-4 min-w-[445px]">
      {/* Titre + range */}
      <div className="relative flex items-center justify-between">
        <div>
          <p className="typo-lg text-primary mb-2.75">
            {avg}km en moyenne
          </p>
        <p className="typo-xs text-tertiary ">
            Total des kilomètres 4 dernières semaines
        </p>
        </div>

        <div className="absolute right-0 top-0 flex items-center gap-1.5 typo-xs text-secondary">
          <button
            onClick={() => canGoPrev && setPage((p) => p + 1)}
            disabled={!canGoPrev}
            className="border border-tertiary rounded-sm w-6 h-6 cursor-pointer disabled:opacity-30 hover:bg-primary hover:opacity-60 text-secondary hover:text-foreground hover:border-primary">
              <svg width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg" className="m-auto">
                <path d="M4.70709 0.5L0.707092 4.5L4.70709 8.5" stroke="currentColor" strokeLinecap="round"/>
              </svg>
          </button>

          <span>{labelRange}</span>

          <button
            onClick={() => canGoNext && setPage((p) => p - 1)}
            disabled={!canGoNext}
            className="border border-tertiary rounded-sm w-6 h-6 cursor-pointer disabled:opacity-30 hover:bg-primary hover:opacity-60 text-secondary hover:text-foreground hover:border-primary"
          >
            <svg width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg" className="m-auto">
              <path d="M0.5 8.5L4.5 4.5L0.5 0.5" stroke="currentColor" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Graph */}
      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 35, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#F1F1F1" />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 12, fill: "#707070" }}
              tickLine={false}
              axisLine={{ stroke: "#717171" }}
              tickMargin={24} 
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#707070" }}
              tickLine={false}
              axisLine={{ stroke: "#717171" }}
              width={30}
              
            />
            <Tooltip content={CustomTooltip}
            cursor={false}/>
            <Bar
              dataKey="km"
              fill={BAR_COLOR}
              barSize={14}
              radius={30}
              activeBar= {{fill:"#0B23F4"}}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-[1.5px] flex items-center gap-0.75 p-px">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full text-[#7987FF] m-1"
          style={{ backgroundColor: BAR_COLOR }}
        />
        <span className="typo-xs text-tertiary">Km</span>
      </div>
    </article>
  )
}
