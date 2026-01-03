"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, User, Menu, X } from "lucide-react"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [companyLogo] = useState("/generic-company-logo.png")
  const [userAvatar] = useState("/diverse-user-avatars.png")
  const [userName] = useState("John Doe")
  const pathname = usePathname()

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    console.log("Logging out...")
  }

  const isActiveTab = (href: string) => {
    if (href === "/dashboard/admin" && pathname === "/dashboard/admin") return true
    if (href !== "/dashboard/admin" && pathname.startsWith(href)) return true
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

            {/* Center Navigation Tabs */}
            <div className="hidden md:flex items-center gap-2 bg-muted/50 p-1.5 rounded-xl">
              <Link
                href="/dashboard/admin"
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActiveTab("/dashboard/admin") 
                    ? "text-foreground bg-background shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Employees
              </Link>
              <Link
                href="/dashboard/admin/attendance"
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActiveTab("/dashboard/admin/attendance")
                    ? "text-foreground bg-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Attendance
              </Link>
              <Link
                href="/dashboard/admin/time-off"
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActiveTab("/dashboard/admin/time-off")
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
                suppressHydrationWarning
                onClick={() => setIsCheckedIn(!isCheckedIn)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                  isCheckedIn
                    ? "bg-green-500/10 border-green-500/30 hover:bg-green-500/20"
                    : "bg-red-500/10 border-red-500/30 hover:bg-red-500/20"
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${isCheckedIn ? "bg-green-500" : "bg-red-500"}`}></div>
                <span className={`text-sm font-medium ${isCheckedIn ? "text-green-600" : "text-red-600"}`}>
                  {isCheckedIn ? "Check Out" : "Check In"}
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
                      <p className="text-xs text-muted-foreground capitalize">Admin</p>
                    </div>
                    <Link
                      href="/dashboard/admin/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition"
                      onClick={() => setIsProfileOpen(false)}
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
                href="/dashboard/admin"
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  isActiveTab("/dashboard/admin") ? "text-foreground bg-muted" : "text-muted-foreground"
                }`}
              >
                Employees
              </Link>
              <Link
                href="/dashboard/admin/attendance"
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  isActiveTab("/dashboard/admin/attendance")
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground"
                }`}
              >
                Attendance
              </Link>
              <Link
                href="/dashboard/admin/time-off"
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  isActiveTab("/dashboard/admin/time-off")
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground"
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
