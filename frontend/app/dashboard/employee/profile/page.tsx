"use client"
import { useState, useEffect } from "react"
import { Edit, User, Mail, Phone, Building2, MapPin, Briefcase, Calendar as CalendarIcon, Copy, Eye, EyeOff, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface EmployeeProfileData {
  first_name: string
  last_name: string
  department: string
  designation: string
  email: string
  phone: string
  joining_date: string
  profile_picture?: string
  nationality?: string
  address?: string
  personal_email?: string
  gender?: string
  marital_status?: string
  date_of_birth?: string
  employee_id: string
  bank_details?: any[]
}

export default function EmployeeProfile() {
  const [profileData, setProfileData] = useState<EmployeeProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch("http://127.0.0.1:8000/api/v1/employees/me", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setProfileData(data)
        } else {
          console.error("Failed to fetch profile")
          setError("Failed to load profile")
        }
      } catch (err) {
        console.error("Error fetching profile:", err)
        setError("Error loading data")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !profileData) {
    return (
      <div className="p-8 text-center text-destructive">
        <p>{error || "No profile data found"}</p>
      </div>
    )
  }

  const fullName = `${profileData.first_name} ${profileData.last_name}`

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
        <p className="text-muted-foreground">
          View your profile information, including personal details and credentials. Contact HR if you need to update any information.
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
                  src={profileData.profile_picture || "/placeholder.svg"}
                  alt={fullName}
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
                <p className="text-2xl font-bold text-foreground">{fullName}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Job Position</Label>
                <p className="font-medium text-foreground">{profileData.designation || "N/A"}</p>
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
                    <p className="font-medium">{profileData.phone || "N/A"}</p>
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
                    <p className="font-medium">TechCorp Inc.</p> {/* Placeholder */}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Department</Label>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <p className="font-medium">{profileData.department || "N/A"}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Location</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <p className="font-medium">{profileData.address ? "Address on file" : "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="security" className="w-full">
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="security">Details</TabsTrigger>
          <TabsTrigger value="private">Private Info</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="salary">Salary Info</TabsTrigger>
        </TabsList>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Account Credentials
              </h3>
              <div className="grid grid-cols-1 gap-6 max-w-2xl">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Login ID</Label>
                  <div className="flex items-center gap-3">
                    <code className="bg-muted px-3 py-2 rounded-md font-mono text-base flex-1">
                      {profileData.employee_id}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigator.clipboard.writeText(profileData.employee_id)}
                      title="Copy Login ID"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Work Email</Label>
                  <div className="flex items-center gap-3">
                    <code className="bg-muted px-3 py-2 rounded-md font-mono text-base flex-1">
                      {profileData.email}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigator.clipboard.writeText(profileData.email)}
                      title="Copy Email"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Password</Label>
                  <div className="flex items-center gap-3">
                    <code className="bg-muted px-3 py-2 rounded-md font-mono text-base flex-1">
                      {showPassword ? "********" : "••••••••"}
                    </code>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? "Hide" : "Show"}
                        disabled
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <span className="text-xs text-muted-foreground italic">Hidden for security</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Passwords cannot be viewed after creation. Please contact IT/HR if you need to reset it.
                  </p>
                </div>
              </div>
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
                  <p className="font-medium text-foreground">{profileData.date_of_birth || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Date of Joining</Label>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    <p className="font-medium text-foreground">{profileData.joining_date || "N/A"}</p>
                  </div>
                </div>
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <Label className="text-sm text-muted-foreground">Residing Address</Label>
                  <p className="font-medium text-foreground">{profileData.address || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Nationality</Label>
                  <p className="font-medium text-foreground">{profileData.nationality || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Personal Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <p className="font-medium text-foreground">{profileData.personal_email || "N/A"}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Gender</Label>
                  <p className="font-medium text-foreground">{profileData.gender || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Marital Status</Label>
                  <p className="font-medium text-foreground">{profileData.marital_status || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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


        {/* Salary Info Tab */}
        <TabsContent value="salary" className="space-y-6">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <p>Salary information is not currently available.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
