"use client"

import { useState } from "react"
import { Edit, User, Mail, Phone, Building2, MapPin, Briefcase, Calendar as CalendarIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"

export default function EmployeeProfile() {
  // Mock employee data (would come from authentication context in real app)
  const [profileData] = useState({
    name: "Jane Doe",
    jobPosition: "Software Engineer",
    email: "jane.doe@company.com",
    mobile: "+1 (555) 987-6543",
    company: "TechCorp Inc.",
    department: "Engineering",
    manager: "Sarah Johnson",
    location: "San Francisco",
    image: "/employee-avatar.png",
    // Private Info
    dateOfBirth: "April 22, 1995",
    residingAddress: "456 Market Street, San Francisco, CA 94102",
    nationality: "American",
    personalEmail: "jane.personal@email.com",
    gender: "Female",
    maritalStatus: "Single",
    dateOfJoining: "Jan 10, 2024",
    // Bank Details (Salary Info)
    accountNumber: "9876543210",
    bankName: "Bank of America",
    ifscCode: "BOFA0001234",
    panNo: "ABCDE9876F",
    uanNo: "987654321098",
    empCode: "EMP002",
  })

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
        <p className="text-muted-foreground">
          View your profile information, including personal details and bank information. Contact HR if you need to update any information.
        </p>
      </div>

      {/* Profile Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Side - Profile Picture */}
            <div className="flex flex-col items-center md:items-start">
              <div className="relative group">
                <img
                  src={profileData.image || "/placeholder.svg"}
                  alt={profileData.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
                <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition shadow-lg">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Middle - Personal Info */}
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Name</Label>
                <p className="text-2xl font-bold text-foreground">{profileData.name}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Job Position</Label>
                <p className="font-medium text-foreground">{profileData.jobPosition}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <p className="font-medium">{profileData.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Mobile</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <p className="font-medium">{profileData.mobile}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Company Info */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Company</Label>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <p className="font-medium">{profileData.company}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Department</Label>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <p className="font-medium">{profileData.department}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Manager</Label>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <p className="font-medium">{profileData.manager}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Location</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <p className="font-medium">{profileData.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="resume" className="w-full">
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="private">Private Info</TabsTrigger>
          <TabsTrigger value="salary">Salary Info</TabsTrigger>
        </TabsList>

        {/* Resume Tab */}
        <TabsContent value="resume" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                Your resume and professional information can be updated through HR. Contact your HR representative to make changes to your resume, skills, and professional background.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Private Info Tab */}
        <TabsContent value="private" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Date of Birth</Label>
                  <p className="font-medium text-foreground">{profileData.dateOfBirth}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Date of Joining</Label>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    <p className="font-medium text-foreground">{profileData.dateOfJoining}</p>
                  </div>
                </div>
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <Label className="text-sm text-muted-foreground">Residing Address</Label>
                  <p className="font-medium text-foreground">{profileData.residingAddress}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Nationality</Label>
                  <p className="font-medium text-foreground">{profileData.nationality}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Personal Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <p className="font-medium text-foreground">{profileData.personalEmail}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Gender</Label>
                  <p className="font-medium text-foreground">{profileData.gender}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Marital Status</Label>
                  <p className="font-medium text-foreground">{profileData.maritalStatus}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Salary Info Tab */}
        <TabsContent value="salary" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6">Bank Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Account Number</Label>
                  <p className="font-medium text-foreground">{profileData.accountNumber}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Bank Name</Label>
                  <p className="font-medium text-foreground">{profileData.bankName}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">IFSC Code</Label>
                  <p className="font-medium text-foreground">{profileData.ifscCode}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">PAN No</Label>
                  <p className="font-medium text-foreground">{profileData.panNo}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">UAN No</Label>
                  <p className="font-medium text-foreground">{profileData.uanNo}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Emp Code</Label>
                  <p className="font-medium text-foreground">{profileData.empCode}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50/50 border-blue-200">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Note:</span> For detailed salary breakdown including components, allowances, and deductions, please contact HR or check your monthly payslip. Bank details displayed here are used for salary credit.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
