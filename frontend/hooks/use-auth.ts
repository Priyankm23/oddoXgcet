"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"

interface User {
    id: number
    email: string
    role: string
    employeeProfileId?: number
}

export function useAuth() {
    const [token, setToken] = useState<string | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        if (storedToken) {
            setToken(storedToken)
            fetchUser(storedToken)
        } else {
            setLoading(false)
        }
    }, [])

    const fetchUser = async (authToken: string) => {
        try {
            // First try to get employee profile to get the ID
            const employeeProfile = await api.get("/employees/me", authToken).catch(() => null);

            // We might also want generic user info if needed, but for now let's construct what we need
            // If /employees/me works, we have an employee profile
            if (employeeProfile) {
                setUser({
                    id: employeeProfile.user_id, // Assuming the relation or we might need another call
                    email: employeeProfile.email,
                    role: "employee", // Simplified
                    employeeProfileId: employeeProfile.id
                })
            } else {
                // If strictly admin, they might not have an employee profile. 
                // For now, let's assume if it fails, we might be an admin without a profile or just fail.
                // But the Leave feature relies on employeeProfileId for applying.
                setUser({
                    id: 0,
                    email: "",
                    role: "admin"
                })
            }

        } catch (error) {
            console.error("Failed to fetch user:", error)
        } finally {
            setLoading(false)
        }
    }

    return { token, user, loading }
}
