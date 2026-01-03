"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function EmployeeAttendance() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 9)) // October 2025
  const [selectedDate, setSelectedDate] = useState("22,October 2025")

  // Mock attendance data for the employee
  const attendanceRecords = [
    {
      date: "29/10/2025",
      checkIn: "10:00",
      checkOut: "19:00",
      workHours: "09:00",
      extraHours: "01:00",
    },
    {
      date: "24/10/2025",
      checkIn: "10:00",
      checkOut: "19:00",
      workHours: "09:00",
      extraHours: "01:00",
    },
  ]

  const summaryStats = {
    daysPresent: "22",
    leavesCount: "5",
    totalWorkingDays: "27",
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const monthYearString = currentMonth.toLocaleDateString("en-US", { month: "short", year: "numeric" })

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Attendance</h1>
        <p className="text-muted-foreground">Track your daily attendance records, check-in and check-out times, work hours, and overtime. Use the month navigator to view historical attendance data.</p>
      </div>

      {/* Employee Name and Date Display */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Employee Name</p>
              <p className="text-xl font-semibold text-foreground">Harshal Patel</p>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center gap-3">
              <button onClick={previousMonth} className="p-2 hover:bg-muted rounded-lg transition border border-border">
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-background">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                <select
                  value={monthYearString}
                  onChange={(e) => {
                    // Handle month change if needed
                  }}
                  className="bg-transparent text-foreground focus:outline-none font-medium"
                >
                  <option>{monthYearString}</option>
                </select>
              </div>

              <button onClick={nextMonth} className="p-2 hover:bg-muted rounded-lg transition border border-border">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Count of days present</p>
            <p className="text-3xl font-bold text-foreground">{summaryStats.daysPresent}</p>
            <Badge className="bg-green-500/10 text-green-700 border-green-200 mt-2">
              This Month
            </Badge>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Leaves count</p>
            <p className="text-3xl font-bold text-foreground">{summaryStats.leavesCount}</p>
            <Badge className="bg-blue-500/10 text-blue-700 border-blue-200 mt-2">
              This Month
            </Badge>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Total working days</p>
            <p className="text-3xl font-bold text-foreground">{summaryStats.totalWorkingDays}</p>
            <Badge className="bg-purple-500/10 text-purple-700 border-purple-200 mt-2">
              This Month
            </Badge>
          </CardContent>
        </Card>
      </div>

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
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.length > 0 ? (
                  attendanceRecords.map((record, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-muted/50 transition">
                      <td className="px-6 py-4 font-medium text-foreground">{record.date}</td>
                      <td className="px-6 py-4">
                        <Badge className="bg-green-500/10 text-green-700 border-green-200">
                          {record.checkIn}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-blue-500/10 text-blue-700 border-blue-200">
                          {record.checkOut}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">{record.workHours}</td>
                      <td className="px-6 py-4">
                        <Badge className="bg-purple-500/10 text-purple-700 border-purple-200">
                          {record.extraHours}
                        </Badge>
                      </td>
                    </tr>
                  ))
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
        </CardContent>
      </Card>
    </div>
  )
}
