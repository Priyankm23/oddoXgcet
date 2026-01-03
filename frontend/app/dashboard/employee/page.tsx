"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, User, CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"
import { leaveService, LeaveBalance } from "@/services/leave-service"

export default function EmployeeDashboard() {
  const [loading, setLoading] = useState(true)
  const [employeeName, setEmployeeName] = useState("Employee")
  const [employeeId, setEmployeeId] = useState("")
  const [attendanceStatus, setAttendanceStatus] = useState<"present" | "absent" | "not-checked-in">("not-checked-in")
  const [totalLeaveBalance, setTotalLeaveBalance] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        // Fetch employee profile
        const profile = await api.get("/employees/me", token)
        if (profile) {
          setEmployeeName(profile.first_name || "Employee")
          setEmployeeId(profile.employee_id || "N/A")
        }

        // Fetch attendance status
        const attendanceRecords = await api.get("/attendance/me?limit=1", token)
        if (attendanceRecords && attendanceRecords.length > 0) {
          const today = new Date().toISOString().split("T")[0]
          const latestRecord = attendanceRecords[0]
          if (latestRecord.date === today) {
            if (latestRecord.check_out_time) {
              setAttendanceStatus("present") // Completed for today
            } else if (latestRecord.check_in_time) {
              setAttendanceStatus("present") // Checked in
            }
          } else {
            setAttendanceStatus("not-checked-in")
          }
        }

        // Fetch leave balances
        const balances: LeaveBalance[] = await leaveService.getMyBalance(token)
        if (balances && balances.length > 0) {
          // Sum up all remaining days (paid + sick)
          const totalRemaining = balances
            .filter(b => b.leave_type !== "unpaid")
            .reduce((sum, b) => sum + Number(b.remaining_days), 0)
          setTotalLeaveBalance(totalRemaining)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getStatusBadge = () => {
    if (loading) {
      return (
        <Badge className="bg-gray-500/10 text-gray-700 border-gray-200">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Loading...
        </Badge>
      )
    }

    switch (attendanceStatus) {
      case "present":
        return (
          <Badge className="bg-green-500/10 text-green-700 border-green-200 hover:bg-green-500/20 mt-1">
            <CheckCircle className="w-3 h-3 mr-1" />
            Present
          </Badge>
        )
      case "absent":
        return (
          <Badge className="bg-red-500/10 text-red-700 border-red-200 hover:bg-red-500/20 mt-1">
            <XCircle className="w-3 h-3 mr-1" />
            Absent
          </Badge>
        )
      default:
        return (
          <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-200 hover:bg-yellow-500/20 mt-1">
            <Clock className="w-3 h-3 mr-1" />
            Not Checked In
          </Badge>
        )
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome, {loading ? "..." : employeeName}
        </h1>
        <p className="text-muted-foreground">Your personal dashboard for managing attendance, time off requests, and viewing your profile information. Check your attendance status and available leave days below.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Today Status</p>
                {getStatusBadge()}
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Clock className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Leaves Remaining</p>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? "..." : `${totalLeaveBalance} days`}
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Employee ID</p>
                <p className="text-lg font-bold text-foreground">
                  {loading ? "..." : employeeId}
                </p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <User className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold text-foreground mb-2">Quick Actions</h2>
          <p className="text-sm text-muted-foreground mb-6">Access commonly used features quickly from here</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/employee/attendance"
              className="p-4 bg-muted/50 rounded-lg hover:bg-primary/10 hover:border-primary/50 transition text-foreground font-medium border border-border group"
            >
              <Clock className="w-5 h-5 mb-2 text-primary group-hover:scale-110 transition" />
              <p className="font-semibold">View Attendance</p>
              <p className="text-xs text-muted-foreground mt-1">Check your attendance records</p>
            </Link>
            <Link
              href="/dashboard/employee/time-off"
              className="p-4 bg-muted/50 rounded-lg hover:bg-primary/10 hover:border-primary/50 transition text-foreground font-medium border border-border group"
            >
              <Calendar className="w-5 h-5 mb-2 text-primary group-hover:scale-110 transition" />
              <p className="font-semibold">Request Time Off</p>
              <p className="text-xs text-muted-foreground mt-1">Submit leave requests</p>
            </Link>
            <Link
              href="/dashboard/employee/profile"
              className="p-4 bg-muted/50 rounded-lg hover:bg-primary/10 hover:border-primary/50 transition text-foreground font-medium border border-border group"
            >
              <User className="w-5 h-5 mb-2 text-primary group-hover:scale-110 transition" />
              <p className="font-semibold">View My Profile</p>
              <p className="text-xs text-muted-foreground mt-1">Manage profile information</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
