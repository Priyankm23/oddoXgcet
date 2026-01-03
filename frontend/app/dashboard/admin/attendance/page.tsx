"use client"

import { Suspense, useState } from "react"
import { ChevronLeft, ChevronRight, Search, Calendar as CalendarIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function AttendanceContent() {
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 9, 22)) // Oct 22, 2025
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"day" | "month">("day")

  // Mock employee attendance data
  const attendanceData = [
    {
      id: 1,
      name: "Employee 1",
      checkIn: "10:00",
      checkOut: "19:00",
      workHours: "09:00",
      extraHours: "01:00",
    },
    {
      id: 2,
      name: "Employee 2",
      checkIn: "10:00",
      checkOut: "19:00",
      workHours: "09:00",
      extraHours: "01:00",
    },
    {
      id: 3,
      name: "Employee 3",
      checkIn: "10:30",
      checkOut: "18:30",
      workHours: "08:00",
      extraHours: "00:00",
    },
  ]

  const filteredData = attendanceData.filter((emp) => emp.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const previousDay = () => {
    setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000))
  }

  const nextDay = () => {
    setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
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
                  <th className="px-4 py-4 text-left font-semibold text-foreground">Extra Hours</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((emp) => (
                    <tr key={emp.id} className="border-b border-border hover:bg-muted/30 transition">
                      <td className="px-4 py-4 font-medium text-foreground">{emp.name}</td>
                      <td className="px-4 py-4">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {emp.checkIn}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {emp.checkOut}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 font-medium">{emp.workHours}</td>
                      <td className="px-4 py-4">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {emp.extraHours}
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
