"use client"

import type React from "react"

import { useState } from "react"
import { Plus, X, Calendar, Upload } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function EmployeeTimeOff() {
  const [showNewRequest, setShowNewRequest] = useState(false)
  const [timeOffRequests] = useState([
    {
      id: 1,
      startDate: "28/10/2025",
      endDate: "28/10/2025",
      type: "Paid time Off",
      status: "approved",
    },
    {
      id: 2,
      startDate: "15/11/2025",
      endDate: "20/11/2025",
      type: "Sick Leave",
      status: "pending",
    },
  ])

  const [formData, setFormData] = useState({
    timeOffType: "Paid time off",
    validityPeriod: "",
    allocation: "",
    attachment: null as File | null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setFormData((prev) => ({ ...prev, attachment: files[0] }))
    }
  }

  const handleSubmit = () => {
    console.log("[v0] Form submitted:", formData)
    setShowNewRequest(false)
    setFormData({
      timeOffType: "Paid time off",
      validityPeriod: "",
      allocation: "",
      attachment: null,
    })
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Time Off Requests</h1>
        <p className="text-muted-foreground">Submit new leave requests, track your time off history, and view available leave balances. Note: Employees can only view their own time off records.</p>
      </div>

      {/* NEW Button */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <button
            onClick={() => setShowNewRequest(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            NEW
          </button>
        </CardContent>
      </Card>

      {/* Leave Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground">Paid time OFF</h3>
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">24</p>
            <Badge className="bg-green-500/10 text-green-700 border-green-200">
              Days Available
            </Badge>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground">Sick time off</h3>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">07</p>
            <Badge className="bg-blue-500/10 text-blue-700 border-blue-200">
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
                  <th className="px-6 py-4 text-left font-semibold text-foreground">Time off Type</th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {timeOffRequests.length > 0 ? (
                  timeOffRequests.map((req) => (
                    <tr key={req.id} className="border-b border-border hover:bg-muted/50 transition">
                      <td className="px-6 py-4 font-medium text-foreground">{req.startDate}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{req.endDate}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {req.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={`${
                            req.status === "approved"
                              ? "bg-green-500/10 text-green-700 border-green-200"
                              : req.status === "pending"
                                ? "bg-yellow-500/10 text-yellow-700 border-yellow-200"
                                : "bg-red-500/10 text-red-700 border-red-200"
                          }`}
                        >
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
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
            <DialogTitle className="text-xl">Time off Type Request</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Employee Field */}
            <div className="space-y-2">
              <Label>Employee</Label>
              <Input value="[Current User]" disabled className="bg-muted" />
            </div>

            {/* Time off Type */}
            <div className="space-y-2">
              <Label>Time off Type *</Label>
              <select
                name="timeOffType"
                value={formData.timeOffType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>Paid time off</option>
                <option>Sick Leave</option>
                <option>Unpaid Leaves</option>
              </select>
            </div>

            {/* Validity Period */}
            <div className="space-y-2">
              <Label>Validity Period *</Label>
              <Input
                type="date"
                name="validityPeriod"
                value={formData.validityPeriod}
                onChange={handleInputChange}
              />
            </div>

            {/* Allocation */}
            <div className="space-y-2">
              <Label>Allocation (Days) *</Label>
              <Input
                type="number"
                name="allocation"
                value={formData.allocation}
                onChange={handleInputChange}
                placeholder="01.00"
              />
            </div>

            {/* Attachment - Only for Sick Leave */}
            {formData.timeOffType === "Sick Leave" && (
              <div className="space-y-2">
                <Label>Attachment (For sick leave certificate)</Label>
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
                Discard
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
              >
                Submit
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
