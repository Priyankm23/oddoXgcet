"use client"

import { useState } from "react"
import { Edit, User, Mail, Phone, Building2, MapPin, Briefcase, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false)
  
  // Mock admin data
  const [profileData] = useState({
    name: "John Doe",
    loginId: "admin001",
    email: "john.doe@company.com",
    mobile: "+1 (555) 123-4567",
    company: "TechCorp Inc.",
    department: "Administration",
    manager: "CEO",
    location: "San Francisco",
    image: "/admin-avatar.png",
    // Resume sections
    about: "Experienced HR professional with over 10 years in talent management and organizational development. Passionate about creating positive workplace cultures and driving employee engagement initiatives.",
    whatILove: "I love fostering a collaborative environment where every team member feels valued and empowered. Building strong relationships and helping people reach their full potential is what drives me every day.",
    interests: "Leadership development, organizational psychology, team building activities, professional coaching, and staying updated with the latest HR technology trends.",
    skills: ["Leadership", "Communication", "Strategic Planning", "Employee Relations", "Performance Management"],
    // Salary Info
    monthlyWage: 50000,
    yearlyWage: 600000,
    workingDaysPerWeek: 5,
    breakTime: "1 hour",
    salaryComponents: [
      { name: "Basic Salary", amount: 25000, percentage: 50.00 },
      { name: "House Rent Allowance", amount: 12500, percentage: 50.00 },
      { name: "Standard Allowance", amount: 4167, percentage: 16.67 },
      { name: "Performance Bonus", amount: 2082.50, percentage: 8.33 },
      { name: "Leave Travel Allowance", amount: 2082.50, percentage: 8.33 },
      { name: "Fixed Allowance", amount: 2918, percentage: 11.67 },
    ],
    pfContribution: {
      employee: { amount: 3000, percentage: 12.00 },
      employer: { amount: 3000, percentage: 12.00 },
    },
    taxDeductions: {
      professionalTax: 200,
    },
  })

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
        <p className="text-muted-foreground">
          View and manage your profile information, including personal details, resume, and salary information.
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Login ID</Label>
                  <p className="font-medium">{profileData.loginId}</p>
                </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* About Section */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    About
                    <Edit className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{profileData.about}</p>
              </CardContent>
            </Card>

            {/* Skills Section */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {skill}
                    </Badge>
                  ))}
                  <button className="px-3 py-1 text-xs border border-dashed border-muted-foreground rounded-md text-muted-foreground hover:text-foreground hover:border-foreground transition">
                    + Add Skill
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* What I love about my job */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  What I love about my job
                  <Edit className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{profileData.whatILove}</p>
            </CardContent>
          </Card>

          {/* My interests and hobbies */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  My interests and hobbies
                  <Edit className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{profileData.interests}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Private Info Tab */}
        <TabsContent value="private">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Private information section - Additional personal details will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Salary Info Tab */}
        <TabsContent value="salary" className="space-y-6">
          {/* Important Note */}
          <Card className="bg-yellow-50/50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground mb-2">Important</p>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      The Salary Information tab allows users to define and manage all salary-related details for an employee,
                      including wage type, working schedule, salary components, benefits. Salary components should be calculated
                      automatically based on the defined wage.
                    </p>
                    <div className="space-y-1 mt-3">
                      <p className="font-medium text-foreground">- Wage Type</p>
                      <p className="ml-4">Fixed wage.</p>
                      
                      <p className="font-medium text-foreground mt-2">- Salary Components</p>
                      <p className="ml-4">Section where users can define salary structure components.</p>
                      <p className="ml-4">Each component should include: Basic, House Rent Allowance, Standard Allowance, Performance Bonus, Leave Travel Allowance, Fixed Allowance</p>
                      
                      <p className="ml-4 mt-2">Computation Type: Fixed Amount or Percentage of Wage</p>
                      <p className="ml-4">Value: Percentage field (e.g., 50% for Basic, 50% of Basic for HRA, etc.)</p>
                      
                      <p className="ml-4 mt-2">Salary component values should auto-update when the wage amount changes.</p>
                      <p className="ml-4">The total of all components should not exceed the defined Wage</p>
                      
                      <p className="font-medium text-foreground mt-2">- Automatic Calculation:</p>
                      <p className="ml-4">The system should calculate each component amount based on the employee's defined Wage.</p>
                      <p className="ml-4">Example: If Wage = ₹50,000 and Basic = 50% of wage, then Basic = ₹25,000.</p>
                      <p className="ml-4">If HRA = 50% of Basic, then HRA = ₹12,500.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salary Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Month Wage</p>
                <p className="text-3xl font-bold text-foreground">₹{profileData.monthlyWage.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">/ Month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Yearly Wage</p>
                <p className="text-3xl font-bold text-foreground">₹{profileData.yearlyWage.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">/ Yearly</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Working Days</p>
                <p className="text-3xl font-bold text-foreground">{profileData.workingDaysPerWeek}</p>
                <p className="text-sm text-muted-foreground">days/week</p>
              </CardContent>
            </Card>
          </div>

          {/* Salary Components */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Salary Components</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Define Basic salary from company cost compute it based on monthly Wages
              </p>
              <div className="space-y-3">
                {profileData.salaryComponents.map((component, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{component.name}</p>
                      {component.name === "House Rent Allowance" && (
                        <p className="text-xs text-muted-foreground mt-1">HRA provided to employees 50% of the basic salary</p>
                      )}
                      {component.name === "Standard Allowance" && (
                        <p className="text-xs text-muted-foreground mt-1">A standard allowance is a predetermined, fixed amount provided to employee as part of their salary</p>
                      )}
                      {component.name === "Performance Bonus" && (
                        <p className="text-xs text-muted-foreground mt-1">Variable amount paid during payroll. The value defined by the company and calculated as a % of the basic salary</p>
                      )}
                      {component.name === "Leave Travel Allowance" && (
                        <p className="text-xs text-muted-foreground mt-1">LTA is paid by the company to employees to cover their travel expenses; and calculated as a % of the basic salary</p>
                      )}
                      {component.name === "Fixed Allowance" && (
                        <p className="text-xs text-muted-foreground mt-1">Fixed allowance portion of wages is determined after calculating all salary components</p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold text-foreground">₹{component.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">₹ / month</p>
                      <Badge variant="outline" className="mt-1 bg-green-50 text-green-700 border-green-200">
                        {component.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* PF Contribution & Tax Deductions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PF Contribution */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Provident Fund (PF) Contribution</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-foreground">Employee</p>
                      <p className="text-xs text-muted-foreground mt-1">PF is calculated based on the basic salary</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">₹{profileData.pfContribution.employee.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">₹ / month</p>
                      <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700 border-blue-200">
                        {profileData.pfContribution.employee.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-foreground">Employer</p>
                      <p className="text-xs text-muted-foreground mt-1">PF is calculated based on the basic salary</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">₹{profileData.pfContribution.employer.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">₹ / month</p>
                      <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700 border-blue-200">
                        {profileData.pfContribution.employer.percentage}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tax Deductions */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Tax Deductions</h3>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground">Professional Tax</p>
                    <p className="text-xs text-muted-foreground mt-1">Professional Tax deducted from the Gross salary</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">₹{profileData.taxDeductions.professionalTax}</p>
                    <p className="text-sm text-muted-foreground">₹ / month</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Break Time:</span> {profileData.breakTime}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
