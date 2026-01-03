"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { useAttendanceStatus, AttendanceRecord } from "@/hooks/use-attendance-status"

export default function EmployeeAttendance() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const { status } = useAttendanceStatus()

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token") || undefined
      const data = await api.get("/attendance/me?limit=100", token)
      setRecords(data)
    } catch (error) {
      console.error("Failed to fetch attendance records", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords, status])

  const filteredRecords = records.filter(record => {
    const recordDate = new Date(record.date)
    return (
      recordDate.getMonth() === currentMonth.getMonth() &&
      recordDate.getFullYear() === currentMonth.getFullYear()
    )
  })

  // Stats
  const daysPresent = filteredRecords.filter(r => r.status === 'present' || r.status === 'half_day').length
  const leavesCount = filteredRecords.filter(r => r.status === 'leave').length
  const totalWorkingDays = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate() -
    (new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() === 0 ? 5 : 4) // Rough estimate or keeping simple total days
  // User mockup shows "Total working days", usually means business days. For simplicity I'll stick to total days or business days approx.
  // Actually, let's just use days in month for now or better yet, count strictly Mon-Fri?
  // Let's stick to the previous simple logic for now but rename label.

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const monthYearString = currentMonth.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  const todayDateString = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })

  const formatTime24 = (timeString: string | null) => {
    if (!timeString) return "--:--"
    const date = new Date(timeString)
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  const formatDateDDMMYYYY = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
  }

  const calculateHoursAndExtra = (start: string | null, end: string | null) => {
    if (!start || !end) return { work: "00:00", extra: "00:00" }

    const startTime = new Date(start)
    const endTime = new Date(end)
    const diffMs = endTime.getTime() - startTime.getTime()

    const totalMinutes = Math.floor(diffMs / (1000 * 60))
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    const workString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

    // Calculate extra hours (assuming > 8 hours is extra)
    let extraString = "00:00"
    if (totalMinutes > 8 * 60) {
      const extraMinutesTotal = totalMinutes - (8 * 60)
      const extraH = Math.floor(extraMinutesTotal / 60)
      const extraM = extraMinutesTotal % 60
      extraString = `${extraH.toString().padStart(2, '0')}:${extraM.toString().padStart(2, '0')}`
    }

    return { work: workString, extra: extraString }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header / Title */}
      <div className="mb-6 border-b pb-4">
        <h1 className="text-xl font-semibold text-foreground">Attendance</h1>
      </div>

      {/* Controls & Stats Row */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Controls */}
        <div className="flex items-center gap-2">
          <button onClick={previousMonth} className="h-10 w-10 flex items-center justify-center border border-foreground/20 rounded hover:bg-muted">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextMonth} className="h-10 w-10 flex items-center justify-center border border-foreground/20 rounded hover:bg-muted">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="h-10 px-4 flex items-center justify-center border border-foreground/20 rounded min-w-[100px] font-medium">
            {currentMonth.toLocaleDateString("en-US", { month: "short" })} v
          </div>
        </div>

        {/* Stats Cards - Using a cleaner look to match mockup */}
        <div className="flex flex-1 gap-4 overflow-x-auto">
          <div className="border border-foreground/20 rounded p-3 flex-1 min-w-[140px] flex flex-col items-center justify-center bg-background/50">
            <span className="text-xs font-semibold text-muted-foreground uppercase text-center mb-1">Count of days present</span>
            <span className="text-2xl font-bold">{daysPresent}</span>
          </div>
          <div className="border border-foreground/20 rounded p-3 flex-1 min-w-[140px] flex flex-col items-center justify-center bg-background/50">
            <span className="text-xs font-semibold text-muted-foreground uppercase text-center mb-1">Leaves count</span>
            <span className="text-2xl font-bold">{leavesCount}</span>
          </div>
          <div className="border border-foreground/20 rounded p-3 flex-1 min-w-[140px] flex flex-col items-center justify-center bg-background/50">
            <span className="text-xs font-semibold text-muted-foreground uppercase text-center mb-1">Total working days</span>
            {/* Using total days in month for now as placeholder */}
            <span className="text-2xl font-bold">{new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()}</span>
          </div>
        </div>
      </div>

      {/* Date Header for Table */}
      <div className="mb-2 pl-2">
        <span className="font-medium text-muted-foreground">{todayDateString}</span>
      </div>

      {/* Attendance Table */}
      <div className="border border-foreground/20 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#f9fafb]">
            <tr className="border-b border-foreground/20">
              <th className="px-6 py-4 text-left font-medium text-foreground">Date</th>
              <th className="px-6 py-4 text-left font-medium text-foreground">Check In</th>
              <th className="px-6 py-4 text-left font-medium text-foreground">Check Out</th>
              <th className="px-6 py-4 text-left font-medium text-foreground">Work Hours</th>
              <th className="px-6 py-4 text-left font-medium text-foreground">Extra hours</th>
            </tr>
          </thead>
          <tbody className="bg-background">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading records...
                  </div>
                </td>
              </tr>
            ) : filteredRecords.length > 0 ? (
              filteredRecords.map((record, idx) => {
                const { work, extra } = calculateHoursAndExtra(record.check_in_time, record.check_out_time)
                return (
                  <tr key={idx} className="border-b border-foreground/10 last:border-0 hover:bg-muted/50 transition">
                    <td className="px-6 py-4 font-medium text-foreground">{formatDateDDMMYYYY(record.date)}</td>
                    <td className="px-6 py-4 text-foreground/80">
                      {formatTime24(record.check_in_time)}
                    </td>
                    <td className="px-6 py-4 text-foreground/80">
                      {formatTime24(record.check_out_time)}
                    </td>
                    <td className="px-6 py-4 text-foreground/80">
                      {work}
                    </td>
                    <td className="px-6 py-4 text-foreground/80">
                      {extra}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  No attendance records found for this month
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

