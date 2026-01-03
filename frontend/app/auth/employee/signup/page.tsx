"use client"

import Link from "next/link"

export default function EmployeeSignup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
          <div className="text-center mb-8">
            <div className="bg-secondary/10 rounded-lg p-4 mb-4 inline-block">
              <h1 className="text-2xl font-bold text-secondary">Dayflow</h1>
            </div>
            <h2 className="text-2xl font-bold text-foreground">Employee Registration</h2>
          </div>

          <div className="bg-accent/10 border border-accent/30 rounded-lg p-6 text-center">
            <p className="text-foreground font-semibold mb-2">Self-registration is disabled</p>
            <p className="text-sm text-muted-foreground mb-4">
              Only HR administrators and managers can create employee accounts. Your admin will provide you with login
              credentials when your account is ready.
            </p>
            <p className="text-xs text-muted-foreground">
              If you believe you should have access, please contact your HR department.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              Already have credentials?{" "}
              <Link href="/auth/employee/login" className="text-secondary font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
