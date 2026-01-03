"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, X, Calendar, Upload } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { leaveService, LeaveRequest, LeaveBalance } from "@/services/leave-service"
import { toast } from "sonner"

export default function EmployeeTimeOff() {
  const { token, user } = useAuth()
  const [showNewRequest, setShowNewRequest] = useState(false)
  const [timeOffRequests, setTimeOffRequests] = useState<LeaveRequest[]>([])
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([])
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    timeOffType: "paid", // default to match backend enum
    startDate: "",
    endDate: "",
    totalDays: "",
    reason: "",
    attachment: null as File | null,
  })

  // Fetch data on mount
  useEffect(() => {
    if (token) {
      fetchData()
    }
  }, [token])

  // Auto-calculate total days
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)

      if (start <= end) {
        const diffTime = Math.abs(end.getTime() - start.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
        setFormData(prev => ({ ...prev, totalDays: diffDays.toString() }))
      } else {
        setFormData(prev => ({ ...prev, totalDays: "" }))
      }
    }
  }, [formData.startDate, formData.endDate])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [requests, balances] = await Promise.all([
        leaveService.getMyLeaves(token!),
        leaveService.getMyBalance(token!)
      ])
      setTimeOffRequests(requests.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()))
      setLeaveBalances(balances)
    } catch (error: any) {
      console.error("Failed to fetch leave data:", error)
      toast.error("Failed to load leave data")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setFormData((prev) => ({ ...prev, attachment: files[0] }))
    }
  }

  const handleSubmit = async () => {
    if (!formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      if (!user?.employeeProfileId) {
        toast.error("Employee profile not found. Please contact HR.")
        return;
      }

      await leaveService.applyForLeave({
        employee_profile_id: user.employeeProfileId,
        leave_type: formData.timeOffType,
        start_date: formData.startDate,
        end_date: formData.endDate,
        reason: formData.reason
      }, token!)

      toast.success("Leave request submitted successfully")
      setShowNewRequest(false)
      setFormData({
        timeOffType: "paid",
        startDate: "",
        endDate: "",
        totalDays: "",
        reason: "",
        attachment: null,
      })
      fetchData() // Refresh list
    } catch (error: any) {
      console.error("Failed to apply for leave:", error)
      toast.error(error.message || "Failed to submit leave request")
    }
  }

  const getBalanceForType = (type: string) => {
    const balance = leaveBalances.find(b => b.leave_type === type)
    return balance ? balance.remaining_days : 0
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Time Off</h1>
        <p className="text-muted-foreground">Submit new leave requests, track your time off history, and view available leave balances.</p>
      </div>

      {/* NEW Button */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <button
            onClick={() => setShowNewRequest(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            NEW REQUEST
          </button>
        </CardContent>
      </Card>

      {/* Leave Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground">Paid Leave</h3>
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">{getBalanceForType('paid')}</p>
            <Badge className="bg-green-500/10 text-green-700 border-green-200">
              Days Available
            </Badge>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground">Sick Leave</h3>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">{getBalanceForType('sick')}</p>
            <Badge className="bg-blue-500/10 text-blue-700 border-blue-200">
              Days Available
            </Badge>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground">Unpaid Leave</h3>
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">{getBalanceForType('unpaid')}</p>
            <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-200">
              Days Available
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Time Off Requests Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left font-semibold text-foreground">Start Date</th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">End Date</th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">Type</th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">Days</th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">Reason</th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">Loading...</td>
                  </tr>
                ) : timeOffRequests.length > 0 ? (
                  timeOffRequests.map((req) => (
                    <tr key={req.id} className="border-b border-border hover:bg-muted/50 transition">
                      <td className="px-6 py-4 font-medium text-foreground">{req.start_date}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{req.end_date}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="capitalize bg-primary/10 text-primary border-primary/20">
                          {req.leave_type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-foreground">{req.total_days}</td>
                      <td className="px-6 py-4">
                        <Badge
                          className={`capitalize ${req.status === "approved"
                            ? "bg-green-500/10 text-green-700 border-green-200"
                            : req.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-700 border-yellow-200"
                              : req.status === "cancelled"
                                ? "bg-gray-500/10 text-gray-700 border-gray-200"
                                : "bg-red-500/10 text-red-700 border-red-200"
                            }`}
                        >
                          {req.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground truncate max-w-[200px]" title={req.reason}>
                        {req.reason || "-"}
                      </td>
                      <td className="px-6 py-4">
                        {req.status === "pending" && (
                          <button
                            onClick={async () => {
                              if (confirm("Are you sure you want to cancel this request?")) {
                                try {
                                  await leaveService.cancelLeave(req.id, token!)
                                  toast.success("Leave request cancelled")
                                  fetchData()
                                } catch (error: any) {
                                  toast.error(error.message || "Failed to cancel request")
                                }
                              }
                            }}
                            className="text-sm text-red-600 hover:text-red-700 hover:underline font-medium"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                      No time off requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* New Request Modal */}
      <Dialog open={showNewRequest} onOpenChange={setShowNewRequest}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">New Time Off Request</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Time off Type */}
            <div className="space-y-2">
              <Label>Leave Type *</Label>
              <select
                name="timeOffType"
                value={formData.timeOffType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="paid">Paid Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="unpaid">Unpaid Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label>End Date *</Label>
                <Input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Total Days (Calculated manually for now, could be auto in future) */}
            <div className="space-y-2">
              <Label>Total Days *</Label>
              <Input
                type="number"
                name="totalDays"
                value={formData.totalDays}
                onChange={handleInputChange}
                placeholder="e.g. 1.0"
                step="0.5"
              />
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Brief reason for leave..."
              />
            </div>

            {/* Attachment - Only for Sick Leave (Placeholder for now) */}
            {formData.timeOffType === "sick" && (
              <div className="space-y-2">
                <Label>Attachment (Medical Certificate)</Label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
                {formData.attachment && (
                  <p className="text-xs text-muted-foreground mt-1">{formData.attachment.name}</p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-6 border-t">
              <button
                onClick={() => setShowNewRequest(false)}
                className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
              >
                Submit Request
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
