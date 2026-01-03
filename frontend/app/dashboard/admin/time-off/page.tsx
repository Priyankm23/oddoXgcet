"use client"

import { Suspense, useState } from "react"
import { Search, Plus, Check, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function TimeOffContent() {
  const [activeTab, setActiveTab] = useState<"time-off" | "allocation">("time-off")
  const [searchQuery, setSearchQuery] = useState("")
  const [timeOffRequests] = useState([
    {
      id: 1,
      name: "Employee 1",
      startDate: "28/10/2025",
      endDate: "28/10/2025",
      type: "Paid time Off",
      status: "pending",
    },
    {
      id: 2,
      name: "Employee 2",
      startDate: "29/10/2025",
      endDate: "30/10/2025",
      type: "Sick Leave",
      status: "approved",
    },
    {
      id: 3,
      name: "Employee 3",
      startDate: "01/11/2025",
      endDate: "05/11/2025",
      type: "Unpaid Leaves",
      status: "rejected",
    },
  ])

  const filteredRequests = timeOffRequests.filter((req) => req.name.toLowerCase().includes(searchQuery.toLowerCase()))

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
          className={`px-6 py-3 font-medium text-sm transition-all relative ${
            activeTab === "time-off"
              ? "text-foreground border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Time Off
        </button>
        <button
          onClick={() => setActiveTab("allocation")}
          className={`px-6 py-3 font-medium text-sm transition-all relative ${
            activeTab === "allocation"
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
                placeholder="Search employee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-center"
              />
            </CardContent>
          </Card>

          {/* Leave Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold text-primary mb-2">Paid Time Off</h3>
                <p className="text-3xl font-bold text-foreground">24</p>
                <p className="text-sm text-muted-foreground">Days Available</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold text-primary mb-2">Sick Time Off</h3>
                <p className="text-3xl font-bold text-foreground">07</p>
                <p className="text-sm text-muted-foreground">Days Available</p>
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
                      <th className="px-4 py-4 text-left font-semibold text-foreground">Name</th>
                      <th className="px-4 py-4 text-left font-semibold text-foreground">Start Date</th>
                      <th className="px-4 py-4 text-left font-semibold text-foreground">End Date</th>
                      <th className="px-4 py-4 text-left font-semibold text-foreground">Time off Type</th>
                      <th className="px-4 py-4 text-left font-semibold text-foreground">Status</th>
                      <th className="px-4 py-4 text-left font-semibold text-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.length > 0 ? (
                      filteredRequests.map((req) => (
                        <tr key={req.id} className="border-b border-border hover:bg-muted/30 transition">
                          <td className="px-4 py-4 font-medium text-foreground">{req.name}</td>
                          <td className="px-4 py-4 text-foreground">{req.startDate}</td>
                          <td className="px-4 py-4 text-foreground">{req.endDate}</td>
                          <td className="px-4 py-4">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {req.type}
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            {req.status !== "pending" && (
                              <Badge
                                className={`${
                                  req.status === "approved"
                                    ? "bg-green-500/10 text-green-700 border-green-200"
                                    : "bg-red-500/10 text-red-700 border-red-200"
                                }`}
                              >
                                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            {req.status === "pending" && (
                              <div className="flex gap-2">
                                <button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition" title="Reject">
                                  <X className="w-4 h-4" />
                                </button>
                                <button className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition" title="Approve">
                                  <Check className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
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
