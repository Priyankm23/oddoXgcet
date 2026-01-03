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
      // Fetching enough records to cover the month view. 
      // In a real app we might want to filter by date range on the backend.
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
  const totalDaysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-50 text-green-700 border-green-200'
      case 'absent': return 'bg-red-50 text-red-700 border-red-200'
      case 'leave': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'half_day': return 'bg-orange-50 text-orange-700 border-orange-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Attendance</h1>
        <p className="text-muted-foreground">
          View your attendance history, check-in times, and work hours.
        </p>
      </div>

      {/* Controls & Stats Section */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">

            {/* Month Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-muted rounded-lg transition border border-border"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-background text-foreground min-w-[140px] justify-center font-medium">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </div>

              <button
                onClick={nextMonth}
                className="p-2 hover:bg-muted rounded-lg transition border border-border"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 w-full md:w-auto justify-center md:justify-end">
              <div className="flex flex-col items-center px-4">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Present</span>
                <span className="text-xl font-bold text-green-600">{daysPresent}</span>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="flex flex-col items-center px-4">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Leaves</span>
                <span className="text-xl font-bold text-yellow-600">{leavesCount}</span>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="flex flex-col items-center px-4">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Total Days</span>
                <span className="text-xl font-bold">{totalDaysInMonth}</span>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left font-semibold text-foreground">Date</th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">Check In</th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">Check Out</th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">Work Hours</th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">Extra Hours</th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
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
                      <tr key={idx} className="border-b border-border hover:bg-muted/30 transition">
                        <td className="px-6 py-4 font-medium text-foreground">{formatDateDDMMYYYY(record.date)}</td>
                        <td className="px-6 py-4">
                          {record.check_in_time ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {formatTime24(record.check_in_time)}
                            </Badge>
                          ) : <span className="text-muted-foreground">--:--</span>}
                        </td>
                        <td className="px-6 py-4">
                          {record.check_out_time ? (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {formatTime24(record.check_out_time)}
                            </Badge>
                          ) : <span className="text-muted-foreground">--:--</span>}
                        </td>
                        <td className="px-6 py-4 font-medium text-foreground">
                          {work}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {extra}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No attendance records found for this month
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
