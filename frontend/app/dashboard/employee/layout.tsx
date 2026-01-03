"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, User, Menu, X, Loader2 } from "lucide-react"
import { useAttendanceStatus } from "@/hooks/use-attendance-status"
import { api } from "@/lib/api"

export default function EmployeeDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Integrated hook for real attendance status
  const { status, loading, checkIn, checkOut, error: attendanceError } = useAttendanceStatus()
  const [isProcessing, setIsProcessing] = useState(false)

  const isCheckedIn = status === 'checked-in'

  const [companyLogo] = useState("/generic-company-logo.png")
  const [userAvatar] = useState("/diverse-user-avatars.png")
  const [userName, setUserName] = useState("Employee")
  const pathname = usePathname()

  // Display error if attendance action fails
  useEffect(() => {
    if (attendanceError) {
      alert(attendanceError) // Simple alert for now to ensure visibility
    }
  }, [attendanceError])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const userData = await api.get("/auth/users/me", token)
          // Assuming userData has employee_profile, otherwise falls back to email or generic
          // The /users/me endpoint returns UserSchema which might need to include profile or we fetch profile separately.
          // Let's assume for now we use email or if available profile name.
          // Actually UserSchema in backend has: id, email, is_active, role.
          // To get name we might need relationship loading or fetch profile.
          // Let's check if UserSchema includes 'employee_profile'.
          // If not, we might display email for now or fetch /employees/me if exists.
          // Checking backend/app/schemas/user.py would be ideal but let's just use email as fallback.
          if (userData.email) {
            setUserName(userData.email.split('@')[0])
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        await api.post("/auth/logout", {}, token)
      }
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      localStorage.removeItem("token")
      localStorage.removeItem("role")
      window.location.href = "/auth/employee/login"
    }
  }

  const handleAttendanceToggle = async () => {
    if (loading || isProcessing) return
    setIsProcessing(true)
    try {
      if (isCheckedIn) {
        await checkOut()
      } else {
        await checkIn()
      }
    } catch (e) {
      // Error handled by hook state
    } finally {
      setIsProcessing(false)
    }
  }

  const isActiveTab = (href: string) => {
    if (href === "/dashboard/employee" && pathname === "/dashboard/employee") return true
    if (href !== "/dashboard/employee" && pathname.startsWith(href) && pathname.includes("/employee")) return true
    return false
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img
                src={companyLogo || "/placeholder.svg"}
                alt="Company Logo"
                className="w-10 h-10 rounded-lg object-cover"
              />
              <span className="text-lg font-bold text-foreground hidden sm:block">Dayflow</span>
            </div>

            <div className="hidden md:flex items-center gap-2 bg-muted/30 p-1 rounded-xl">
              <Link
                href="/dashboard/employee"
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${isActiveTab("/dashboard/employee")
                  ? "text-foreground bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/employee/attendance"
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${isActiveTab("/dashboard/employee/attendance")
                  ? "text-foreground bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Attendance
              </Link>
              <Link
                href="/dashboard/employee/time-off"
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${isActiveTab("/dashboard/employee/time-off")
                  ? "text-foreground bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Time Off
              </Link>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleAttendanceToggle}
                disabled={loading || isProcessing || status === 'checked-out'}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${isCheckedIn
                  ? "bg-green-500/10 border-green-500/30 hover:bg-green-500/20"
                  : status === 'checked-out'
                    ? "bg-muted border-muted-foreground/30 opacity-70 cursor-not-allowed"
                    : "bg-red-500/10 border-red-500/30 hover:bg-red-500/20"
                  } ${loading || isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading || isProcessing ? (
                  <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                ) : (
                  <div className={`w-3 h-3 rounded-full ${isCheckedIn ? "bg-green-500" : status === 'checked-out' ? "bg-gray-400" : "bg-red-500"}`}></div>
                )}
                <span className={`text-sm font-medium ${isCheckedIn ? "text-green-600" : status === 'checked-out' ? "text-muted-foreground" : "text-red-600"}`}>
                  {isCheckedIn ? "Check Out" : status === 'checked-out' ? "Completed" : "Check In"}
                </span>
              </button>

              {/* User Avatar & Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-border hover:border-primary transition"
                >
                  <img
                    src={userAvatar || "/placeholder.svg"}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-semibold text-foreground">{userName}</p>
                      <p className="text-xs text-muted-foreground">Employee</p>
                    </div>
                    <Link
                      href="/dashboard/employee/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 hover:bg-muted rounded-lg">
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="mt-4 md:hidden flex flex-col gap-2">
              <Link
                href="/dashboard/employee"
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${isActiveTab("/dashboard/employee")
                  ? "text-foreground bg-muted"
                  : "text-muted-foreground hover:bg-muted"
                  }`}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/employee/attendance"
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${isActiveTab("/dashboard/employee/attendance")
                  ? "text-foreground bg-muted"
                  : "text-muted-foreground hover:bg-muted"
                  }`}
              >
                Attendance
              </Link>
              <Link
                href="/dashboard/employee/time-off"
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${isActiveTab("/dashboard/employee/time-off")
                  ? "text-foreground bg-muted"
                  : "text-muted-foreground hover:bg-muted"
                  }`}
              >
                Time Off
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-80px)]">{children}</main>
    </div>
  )
}
