"use client"

import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  ComposedChart
} from "recharts"
import { useMemo, useState } from "react"
import { formatDayMonthDate } from "../../../../../utils/formatters"


const BAR_COLOR = {
    lightOrange: "#FCC1B6",
    orange : "#F4320B",
    blue : "#0B23F4",
    grey: "#F2F3FF"
}
const PAGE_SIZE = 7

function getAverageBpm(data) {
  if (!data.length) return 0
  const runDay = data.filter((r) => {return r.avg > 0})
  const total = runDay.reduce((sum, d) => sum + d?.avg, 0)
  return Math.round((total / runDay.length) * 10) / 10
}


export default function WeeklyBpmChart({days}) {
  const [page, setPage] = useState(0)    
  const [isHovered, setIsHovered] = useState(false)

  const {
    chartData,
    labelRange,
    avg,
    canGoPrev,
    canGoNext,
    maxPage,
  } = useMemo(() => {

  if (!days || days.length === 0) {
      return {
        chartData: [],
        labelRange: "",
        avg: 0,
        canGoPrev: false,
        canGoNext: false,
        maxPage: 0,
      }
    }

  const format = (d) => d.toLocaleDateString("fr-FR", { weekday: "long" })

  const totalDays = days.length
  const lastDay = days[totalDays - 1].day

  const lastDayWeekday = lastDay.getDay()
  const diffToMonday = (lastDayWeekday + 6) % 7
  const lastWeekMonday = new Date(lastDay)
  lastWeekMonday.setDate(lastDay.getDate() - diffToMonday)

  const maxPage = Math.floor(totalDays / PAGE_SIZE)
  const safePage = Math.min(Math.max(page, 0), maxPage)

  const startWeek = new Date(lastWeekMonday)
  startWeek.setDate(startWeek.getDate() - page * 7)

  const endWeek = new Date(startWeek)
  endWeek.setDate(startWeek.getDate() + 6)

  const runWeek = days.filter((run) => run.day >= startWeek && run.day <= endWeek)

  const chartData = []
  const usedDays = [] 

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(startWeek)
    dayDate.setDate(startWeek.getDate() + i)

    const run = runWeek.find((r) => r.day.getDate() === dayDate.getDate())

      chartData.push({ 
      day: format(dayDate), 
      min: run?.min ?? 0, 
      max: run?.max ?? 0, 
      avg: run?.avg ?? 0 
    })
    usedDays.push({ day: formatDayMonthDate(dayDate)})
  }
  
  const labelRange = `${usedDays[0].day} - ${usedDays[6].day}`

  const avg = getAverageBpm(chartData)

  const canGoPrev = safePage < maxPage 
  const canGoNext = safePage > 0     

    
    return { chartData, labelRange, avg, canGoPrev, canGoNext, maxPage }
  }, [days, page])

  if (!chartData.length) {
    return (
      <article className="card px-8 py-6">
        <p className="typo-sm text-[#B6BDFC]">
          Pas encore de BPM enregistrés 
        </p>
      </article>
    )
  }

  const handlePrev = () => { setPage((p) => Math.min(p+1, maxPage))}
  const handleNext = () => { setPage ((p) => Math.max(p - 1, 0))}

  return (
    <article className="card px-10 py-4 ">
      {/* Titre + range */}
      <div className="relative flex items-center justify-between">
        <div>
          <p className="typo-lg text-[#F4320B] mb-2.75">
            {avg} BPM
          </p>
        <p className="typo-xs text-tertiary ">
            Fréquence cardiaque moyenne
        </p>
        </div>

        <div className="absolute right-0 top-0 flex items-center gap-1.5 typo-xs text-secondary">
          <button
            onClick={handlePrev}
            disabled={!canGoPrev}
            className="border border-tertiary rounded-sm w-6 h-6 cursor-pointer disabled:opacity-30 hover:bg-[#F4320B] hover:opacity-60 text-secondary hover:text-foreground hover:border-[#F4320B] ">
              <svg width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg" className="m-auto">
                <path d="M4.70709 0.5L0.707092 4.5L4.70709 8.5" stroke="currentColor" strokeLinecap="round"/>
              </svg>
          </button>

          <span>{labelRange}</span>

          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className="border border-tertiary rounded-sm w-6 h-6 cursor-pointer disabled:opacity-30 hover:bg-[#F4320B]  hover:opacity-60 text-secondary hover:text-foreground hover:border-[#F4320B] "
          >
            <svg width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg" className="m-auto">
              <path d="M0.5 8.5L4.5 4.5L0.5 0.5" stroke="currentColor" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Graph */}
      <div className="mt-6 h-64">
        <ComposedChart width="100%" height="100%"
            data={chartData}
            margin={{ top: 10, right: 35, left: 0, bottom: 20 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            >

            <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#F1F1F1" />
            <XAxis
              dataKey="day"
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
            <Bar
              dataKey="min"
              fill={BAR_COLOR.lightOrange}
              barSize={14}
              radius={30}
            />
          <Bar
              dataKey="max"
              fill={BAR_COLOR.orange}
              barSize={14}
              radius={30}
            />

          <Line type="monotone" dataKey="avg" 
          stroke={isHovered ? BAR_COLOR.blue : BAR_COLOR.grey} 
          strokeWidth={3}
          dot= {{
          r: 4,
            stroke: BAR_COLOR.grey,
            strokeWidth: 1,
            fill: BAR_COLOR.blue,
          }}
          activeDot={false}
          />

        </ComposedChart>
      </div>

      <div className="flex gap-4">
        <div className="mt-[1.5px] flex items-center gap-0.75 p-px">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full m-1"
            style={{ backgroundColor: BAR_COLOR.lightOrange }}
          />
          <span className="typo-xs text-tertiary">Min</span>
        </div>
        <div className="mt-[1.5px] flex items-center gap-0.75 p-px">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full m-1"
            style={{ backgroundColor: BAR_COLOR.orange }}
          />
          <span className="typo-xs text-tertiary">Max BPM</span>
        </div>
        <div className="mt-[1.5px] flex items-center gap-0.75 p-px">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full m-1"
            style={{ backgroundColor: BAR_COLOR.blue }}
          />
          <span className="typo-xs text-tertiary">Moyenne BPM</span>
        </div>
      </div>
    </article>
  )
}
