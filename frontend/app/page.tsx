"use client"

import { useState } from "react"
import Link from "next/link"

export default function Home() {
  const [userType, setUserType] = useState<"admin" | "employee" | null>(null)

  if (!userType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dayflow</h1>
          <p className="text-muted-foreground mb-12 text-lg">Human Resource Management System</p>

          <div className="flex gap-6 justify-center">
            <Link
              href="/auth/admin/login"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
            >
              Admin/HR Login
            </Link>
            <Link
              href="/auth/employee/login"
              className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:opacity-90 transition"
            >
              Employee Login
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
