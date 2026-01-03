"use client"

import Link from "next/link"
import { ArrowRight, Shield, Users, Clock } from "lucide-react"

export default function RoutesIndex() {
  const routes = {
    authentication: [
      { name: "Home / Login Selection", path: "/", description: "Landing page with role selector" },
      { name: "Admin Login", path: "/auth/admin/login", description: "Admin/HR authentication" },
      { name: "Admin Sign Up", path: "/auth/admin/signup", description: "Register new HR administrator" },
      { name: "Employee Login", path: "/auth/employee/login", description: "Employee authentication" },
      { name: "Employee Sign Up", path: "/auth/employee/signup", description: "Employee registration (disabled)" },
    ],
    adminDashboard: [
      {
        name: "Dashboard / Employees",
        path: "/dashboard",
        description: "Main dashboard with employee directory (Admin only)",
        icon: "👥",
      },
      { name: "Attendance", path: "/dashboard/attendance", description: "Attendance tracking and reports" },
      { name: "Time Off", path: "/dashboard/time-off", description: "Leave and time off management" },
      { name: "My Profile", path: "/dashboard/profile", description: "User profile and settings" },
    ],
    employeeDashboard: [
      { name: "Employee Dashboard", path: "/dashboard/employee", description: "Employee-specific dashboard view" },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">Dayflow Routes</h1>
          <p className="text-lg text-muted-foreground">Complete navigation guide for all system pages</p>
          <p className="text-sm text-muted-foreground mt-2">
            Click any link to navigate to that page for testing and verification
          </p>
        </div>

        {/* Authentication Routes */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Authentication Routes</h2>
          </div>
          <div className="grid gap-4">
            {routes.authentication.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className="group bg-card border border-border rounded-lg p-4 hover:border-primary hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition">{route.name}</h3>
                    <p className="text-sm text-muted-foreground">{route.description}</p>
                    <code className="inline-block mt-2 px-2 py-1 bg-muted rounded text-xs text-muted-foreground font-mono">
                      {route.path}
                    </code>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition ml-4 flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Admin Dashboard Routes */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Admin Dashboard Routes</h2>
          </div>
          <div className="grid gap-4">
            {routes.adminDashboard.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className="group bg-card border border-primary/20 rounded-lg p-4 hover:border-primary hover:shadow-lg hover:bg-primary/5 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition">
                      {route.icon && <span className="mr-2">{route.icon}</span>}
                      {route.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{route.description}</p>
                    <code className="inline-block mt-2 px-2 py-1 bg-muted rounded text-xs text-muted-foreground font-mono">
                      {route.path}
                    </code>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition ml-4 flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Employee Dashboard Routes */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-secondary" />
            <h2 className="text-2xl font-bold text-foreground">Employee Dashboard Routes</h2>
          </div>
          <div className="grid gap-4">
            {routes.employeeDashboard.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className="group bg-card border border-secondary/20 rounded-lg p-4 hover:border-secondary hover:shadow-lg hover:bg-secondary/5 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-secondary transition">
                      {route.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{route.description}</p>
                    <code className="inline-block mt-2 px-2 py-1 bg-muted rounded text-xs text-muted-foreground font-mono">
                      {route.path}
                    </code>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition ml-4 flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12 pt-12 border-t border-border">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-primary">5</div>
            <p className="text-sm text-muted-foreground">Auth Pages</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-primary">4</div>
            <p className="text-sm text-muted-foreground">Admin Pages</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-secondary">1</div>
            <p className="text-sm text-muted-foreground">Employee Pages</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-accent">10</div>
            <p className="text-sm text-muted-foreground">Total Pages</p>
          </div>
        </section>
      </div>
    </div>
  )
}
