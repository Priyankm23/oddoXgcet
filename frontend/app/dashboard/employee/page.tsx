"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, User, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function EmployeeDashboard() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome, Jane</h1>
        <p className="text-muted-foreground">Your personal dashboard for managing attendance, time off requests, and viewing your profile information. Check your attendance status and available leave days below.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Today Status</p>
                <Badge className="bg-green-500/10 text-green-700 border-green-200 hover:bg-green-500/20 mt-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Present
                </Badge>
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
                <p className="text-2xl font-bold text-foreground">8 days</p>
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
                <p className="text-lg font-bold text-foreground">EMP2024001</p>
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
