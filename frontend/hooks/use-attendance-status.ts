"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"

export type AttendanceStatus = "checked-in" | "checked-out" | "none"

export interface AttendanceRecord {
    id: number
    date: string
    check_in_time: string | null
    check_out_time: string | null
    status: string
    employee_profile_id: number
}

export function useAttendanceStatus() {
    const [status, setStatus] = useState<AttendanceStatus>("none")
    const [loading, setLoading] = useState(true)
    const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null)
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

    const fetchStatus = useCallback(async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem("token") || undefined
            // Fetch latest attendance record
            const records = await api.get("/attendance/me?limit=1", token)

            if (records && records.length > 0) {
                const latestRecord = records[0]
                const today = new Date().toISOString().split("T")[0]

                // Debug log
                console.log("Latest Record:", latestRecord)
                console.log("Today:", today)
                console.log("Match:", latestRecord.date === today)

                if (latestRecord.date === today) {
                    setTodayRecord(latestRecord)
                    if (latestRecord.check_out_time) {
                        setStatus("checked-out")
                    } else if (latestRecord.check_in_time) {
                        setStatus("checked-in")
                    } else {
                        setStatus("none")
                    }
                } else {
                    setTodayRecord(null)
                    setStatus("none")
                }
            } else {
                setTodayRecord(null)
                setStatus("none")
            }
        } catch (error) {
            console.error("Failed to fetch attendance status", error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchStatus()
    }, [fetchStatus])

    const checkIn = async () => {
        try {
            setLoading(true)
            setError(null)
            const token = localStorage.getItem("token") || undefined
            await api.post("/attendance/check-in", {}, token)
            console.log("Check-in successful")
            await fetchStatus()
            router.refresh()
        } catch (error: any) {
            // console.error("Check-in failed", error) // Suppressed as per user request to reduce noise
            setError(error.message || "Check-in failed")
            // throw error // Suppressed to rely on error state
        } finally {
            setLoading(false)
        }
    }

    const checkOut = async () => {
        try {
            setLoading(true)
            setError(null)
            const token = localStorage.getItem("token") || undefined
            await api.post("/attendance/check-out", {}, token)
            console.log("Check-out successful")
            await fetchStatus()
            router.refresh()
        } catch (error: any) {
            // console.error("Check-out failed", error) // Suppressed as per user request to reduce noise
            setError(error.message || "Check-out failed")
            // throw error // Suppressed to rely on error state
        } finally {
            setLoading(false)
        }
    }

    return {
        status,
        loading,
        todayRecord,
        error,
        checkIn,
        checkOut,
        refreshStatus: fetchStatus
    }
}
