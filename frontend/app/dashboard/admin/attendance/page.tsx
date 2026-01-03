"use client"

import { Suspense, useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Search, Calendar as CalendarIcon, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { AttendanceRecord } from "@/hooks/use-attendance-status"

interface AdminAttendanceRecord extends AttendanceRecord {
  employee_profile?: {
    first_name: string
    last_name: string
    user_id: number
  }
}

function AttendanceContent() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"day" | "month">("day")
  const [records, setRecords] = useState<AdminAttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true)
      // For Admin, we want to see all employees attendance for the selected date/range.
      // The current backend API has /daily, /weekly, /all.
      // /daily takes a 'day' query param.
      // /all gives everything.

      let endpoint = ""
      if (viewMode === 'day') {
        const formattedDate = selectedDate.toISOString().split('T')[0]
        endpoint = `/attendance/daily?day=${formattedDate}`
      } else {
        // For month view, we might need a range endpoint or just fetch all and filter.
        // Let's use /all for now as a fallback or assume /daily is sufficient for day view which is default.
        // Ideally backend should support range query.
        // Attempting to use /all?limit=1000 for now to support search/month view approx.
        // In a real scenario, we'd add start_date/end_date params to backend.
        endpoint = `/attendance/all?limit=1000`
      }

      const token = localStorage.getItem("token") || undefined
      const data = await api.get(endpoint, token)
      setRecords(data)
    } catch (error) {
      console.error("Failed to fetch admin attendance records", error)
      setRecords([])
    } finally {
      setLoading(false)
    }
  }, [selectedDate, viewMode])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  const filteredData = records.filter((record) => {
    if (!searchQuery) return true
    const fullName = record.employee_profile ? `${record.employee_profile.first_name} ${record.employee_profile.last_name}` : `EMP-${record.employee_profile_id}`
    return fullName.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const previousDay = () => {
    setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000))
  }

  const nextDay = () => {
    setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
  }

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "--:--"
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const calculateHours = (start: string | null, end: string | null) => {
    if (!start || !end) return "--:--"
    const startTime = new Date(start)
    const endTime = new Date(end)
    const diff = endTime.getTime() - startTime.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Attendance Management</h1>
        <p className="text-muted-foreground">
          Monitor and track employee attendance records. Use the date picker and filters to view specific attendance data.
        </p>
      </div>

      {/* Controls Section */}
      <Card className="mb-6">
        <CardContent className="p-4">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                suppressHydrationWarning
                type="text"
                placeholder="Search employee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-center"
              />
            </div>
          </div>

          {/* Date Navigation */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={previousDay}
              className="p-2 hover:bg-muted rounded-lg transition border border-border"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <select
              suppressHydrationWarning
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as "day" | "month")}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="day">Day</option>
              {/* Month view is complex without backend range support, keeping UI but logic defaults to list */}
              <option value="month">Month</option>
            </select>

            <input
              suppressHydrationWarning
              type="date"
              value={selectedDate.toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <button
              onClick={nextDay}
              className="p-2 hover:bg-muted rounded-lg transition border border-border"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
              <CalendarIcon className="w-4 h-4" />
              <strong className="text-foreground">{formatDate(selectedDate)}</strong>
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
                  <th className="px-4 py-4 text-left font-semibold text-foreground">Employee</th>
                  <th className="px-4 py-4 text-left font-semibold text-foreground">Check In</th>
                  <th className="px-4 py-4 text-left font-semibold text-foreground">Check Out</th>
                  <th className="px-4 py-4 text-left font-semibold text-foreground">Work Hours</th>
                  <th className="px-4 py-4 text-left font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading records...
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((record) => (
                    <tr key={record.id} className="border-b border-border hover:bg-muted/30 transition">
                      <td className="px-4 py-4 font-medium text-foreground">
                        {record.employee_profile ?
                          `${record.employee_profile.first_name} ${record.employee_profile.last_name}`
                          : `EMP-${record.employee_profile_id}`
                        }
                      </td>
                      <td className="px-4 py-4">
                        {record.check_in_time ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {formatTime(record.check_in_time)}
                          </Badge>
                        ) : "--:--"}
                      </td>
                      <td className="px-4 py-4">
                        {record.check_out_time ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {formatTime(record.check_out_time)}
                          </Badge>
                        ) : "--:--"}
                      </td>
                      <td className="px-4 py-4 font-medium">
                        {calculateHours(record.check_in_time, record.check_out_time)}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {record.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                      No attendance records found for {formatDate(selectedDate)}
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

export default function AdminAttendance() {
  return (
    <Suspense fallback={null}>
      <AttendanceContent />
    </Suspense>
  )
}
