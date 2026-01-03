"use client"

import { Suspense, useState, useEffect } from "react"
import { Search, Plus, Check, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { leaveService, LeaveRequest } from "@/services/leave-service"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

function TimeOffContent() {
  const { token } = useAuth()
  const [activeTab, setActiveTab] = useState<"time-off" | "allocation">("time-off")
  const [searchQuery, setSearchQuery] = useState("")
  const [timeOffRequests, setTimeOffRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)

  // Rejection Dialog State
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [selectedLeaveId, setSelectedLeaveId] = useState<number | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  useEffect(() => {
    if (token && activeTab === "time-off") {
      fetchRequests()
    }
  }, [token, activeTab])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const data = await leaveService.getAllLeaves(token!)
      setTimeOffRequests(data)
    } catch (error: any) {
      console.error("Failed to fetch leave requests:", error)
      toast.error("Failed to load leave requests")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: number) => {
    try {
      await leaveService.approveLeave(id, token!)
      toast.success("Leave request approved")
      fetchRequests()
    } catch (error: any) {
      console.error("Failed to approve leave:", error)
      toast.error(error.message || "Failed to approve leave request")
    }
  }

  const openRejectDialog = (id: number) => {
    setSelectedLeaveId(id)
    setRejectionReason("")
    setShowRejectDialog(true)
  }

  const handleReject = async () => {
    if (!selectedLeaveId) return

    try {
      await leaveService.rejectLeave(selectedLeaveId, rejectionReason, token!)
      toast.success("Leave request rejected")
      setShowRejectDialog(false)
      fetchRequests()
    } catch (error: any) {
      console.error("Failed to reject leave:", error)
      toast.error(error.message || "Failed to reject leave request")
    }
  }

  const filteredRequests = timeOffRequests.filter((req) =>
    // Simplify search to just check if the ID exists for now as we don't have employee name populated in the simple schema
    // In a real app, we would join with employee profile to get name
    req.id.toString().includes(searchQuery) ||
    req.leave_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (req.status && req.status.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Calculate stats
  const pendingCount = timeOffRequests.filter(req => req.status === 'pending').length
  const approvedCount = timeOffRequests.filter(req => req.status === 'approved').length

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Time Off Management</h1>
        <p className="text-muted-foreground">
          Manage employee leave requests and allocations. Approve or reject time off requests for all employees.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab("time-off")}
          className={`px-6 py-3 font-medium text-sm transition-all relative ${activeTab === "time-off"
              ? "text-foreground border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
            }`}
        >
          Time Off
        </button>
        <button
          onClick={() => setActiveTab("allocation")}
          className={`px-6 py-3 font-medium text-sm transition-all relative ${activeTab === "allocation"
              ? "text-foreground border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
            }`}
        >
          Allocation
        </button>
      </div>

      {activeTab === "time-off" && (
        <div className="space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <input
                suppressHydrationWarning
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-center"
              />
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold text-primary mb-2">Pending Requests</h3>
                <p className="text-3xl font-bold text-foreground">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Awaiting Action</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold text-green-600 mb-2">Approved Requests</h3>
                <p className="text-3xl font-bold text-foreground">{approvedCount}</p>
                <p className="text-sm text-muted-foreground">Total Approved</p>
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
                      <th className="px-4 py-4 text-left font-semibold text-foreground">Employee ID</th>
                      <th className="px-4 py-4 text-left font-semibold text-foreground">Start Date</th>
                      <th className="px-4 py-4 text-left font-semibold text-foreground">End Date</th>
                      <th className="px-4 py-4 text-left font-semibold text-foreground">Type</th>
                      <th className="px-4 py-4 text-left font-semibold text-foreground">Total Days</th>
                      <th className="px-4 py-4 text-left font-semibold text-foreground">Status</th>
                      <th className="px-4 py-4 text-left font-semibold text-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">Loading...</td>
                      </tr>
                    ) : filteredRequests.length > 0 ? (
                      filteredRequests.map((req) => (
                        <tr key={req.id} className="border-b border-border hover:bg-muted/30 transition">
                          <td className="px-4 py-4 font-medium text-foreground">#{req.employee_profile_id}</td>
                          <td className="px-4 py-4 text-foreground">{req.start_date}</td>
                          <td className="px-4 py-4 text-foreground">{req.end_date}</td>
                          <td className="px-4 py-4">
                            <Badge variant="outline" className="capitalize bg-blue-50 text-blue-700 border-blue-200">
                              {req.leave_type}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 text-foreground">{req.total_days}</td>
                          <td className="px-4 py-4">
                            {req.status && (
                              <Badge
                                className={`capitalize ${req.status === "approved"
                                    ? "bg-green-500/10 text-green-700 border-green-200"
                                    : req.status === "rejected"
                                      ? "bg-red-500/10 text-red-700 border-red-200"
                                      : "bg-yellow-500/10 text-yellow-700 border-yellow-200"
                                  }`}
                              >
                                {req.status}
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            {req.status === "pending" && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openRejectDialog(req.id)}
                                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                  title="Reject"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleApprove(req.id)}
                                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                  title="Approve"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                          No time off requests found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Note Section */}
          <Card className="bg-yellow-50/50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                <div>
                  <p className="font-semibold text-foreground mb-2">Important Note</p>
                  <p className="text-sm text-muted-foreground">
                    Employees can view only their own time off records, while Admins and HR Officers can view time off records & approve/reject them for all employees.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "allocation" && (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Leave allocation management will be displayed here.</p>
          </CardContent>
        </Card>
      )}

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for rejection</Label>
              <Textarea
                id="reason"
                placeholder="Please provide a reason for rejecting this request..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject}>Reject Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function AdminTimeOff() {
  return (
    <Suspense fallback={null}>
      <TimeOffContent />
    </Suspense>
  )
}
