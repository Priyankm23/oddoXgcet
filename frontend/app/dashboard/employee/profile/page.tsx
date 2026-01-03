"use client"
import { useState, useEffect } from "react"
import { Edit, User, Mail, Phone, Building2, MapPin, Briefcase, Calendar as CalendarIcon, Copy, Eye, EyeOff, Shield, Upload, FileText, CreditCard, Landmark, Plus, Save, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface BankDetail {
  id: number
  account_number: string
  bank_name: string
  ifsc_code: string
  pan_number?: string
  uan_number?: string
}

interface EmployeeProfileData {
  id: number
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
  company_id: number
  company_name?: string
  company_logo?: string
  manager_id?: number
  resume_url?: string
}

interface SalaryStructure {
  id?: number
  basic_salary: number
  hra: number
  standard_allowance: number
  performance_bonus: number
  lta: number
  fixed_allowance: number
  professional_tax: number
  pf_contribution: number
}

const normalizeDateInput = (value: string | null | undefined) => {
  if (!value) return ""
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [day, month, year] = value.split("-")
    return `${year}-${month}-${day}`
  }
  return ""
}

const normalizeDateForApi = (value: string | null | undefined) => {
  const formatted = normalizeDateInput(value)
  return formatted || null
}

const normalizeEnum = (value: string | null | undefined) => (value ? value.toLowerCase() : null)

export default function EmployeeProfile() {
  const { toast } = useToast()
  const [profileData, setProfileData] = useState<EmployeeProfileData | null>(null)
  const [bankDetails, setBankDetails] = useState<BankDetail[]>([])
  const [salaryStructure, setSalaryStructure] = useState<SalaryStructure | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [isAddingBank, setIsAddingBank] = useState(false)
  const [savingBank, setSavingBank] = useState(false)
  const [bankForm, setBankForm] = useState({
    account_number: "",
    bank_name: "",
    ifsc_code: "",
    pan_number: "",
    uan_number: ""
  })
  const [isEditingPersonal, setIsEditingPersonal] = useState(false)
  const [savingPersonal, setSavingPersonal] = useState(false)
  const [personalForm, setPersonalForm] = useState({
    date_of_birth: "",
    address: "",
    nationality: "",
    personal_email: "",
    gender: "",
    marital_status: ""
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        // Fetch profile
        const profileResponse = await api.get("/employees/me", token)
        setProfileData(profileResponse)

        // Fetch bank details
        try {
          const bankResponse = await api.get("/employees/me/bank-details", token)
          setBankDetails(bankResponse || [])
        } catch (e) {
          console.log("No bank details found")
        }

        // Fetch salary structure
        try {
          const salaryResponse = await api.get("/salary/me", token)
          setSalaryStructure(salaryResponse)
        } catch (e) {
          console.log("No salary structure found")
        }

      } catch (err) {
        console.error("Error fetching profile:", err)
        setError("Error loading data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile-picture' | 'resume') => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`http://localhost:8000/api/v1/upload/${type}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()

      if (type === 'profile-picture' && profileData) {
        const newUrl = `http://localhost:8000${data.url}`
        setProfileData({ ...profileData, profile_picture: newUrl })
        await api.put(`/employees/${profileData.id}`, { profile_picture: newUrl }, token)
        toast({ title: "Success", description: "Profile picture updated" })
      } else if (type === 'resume' && profileData) {
        const newUrl = `http://localhost:8000${data.url}`
        setProfileData({ ...profileData, resume_url: newUrl })
        await api.put(`/employees/${profileData.id}`, { resume_url: newUrl }, token)
        toast({ title: "Success", description: "Resume uploaded" })
      }

    } catch (error) {
      console.error(error)
      toast({ title: "Error", description: "File upload failed", variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  const handleBankFormChange = (field: string, value: string) => {
    setBankForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveBankDetails = async () => {
    if (!profileData || !bankForm.account_number || !bankForm.bank_name || !bankForm.ifsc_code) {
      toast({ title: "Error", description: "Please fill in required fields (Account Number, Bank Name, IFSC Code)", variant: "destructive" })
      return
    }

    setSavingBank(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const newBankDetail = await api.post("/employees/me/bank-details", {
        employee_profile_id: profileData.id,
        account_number: bankForm.account_number,
        bank_name: bankForm.bank_name,
        ifsc_code: bankForm.ifsc_code,
        pan_number: bankForm.pan_number || null,
        uan_number: bankForm.uan_number || null
      }, token)

      setBankDetails([...bankDetails, newBankDetail])
      setBankForm({ account_number: "", bank_name: "", ifsc_code: "", pan_number: "", uan_number: "" })
      setIsAddingBank(false)
      toast({ title: "Success", description: "Bank details added successfully" })
    } catch (error: any) {
      console.error(error)
      toast({
        title: "Error",
        description: error.message || "Failed to save bank details",
        variant: "destructive"
      })
    } finally {
      setSavingBank(false)
    }
  }

  const handleStartEditPersonal = () => {
    if (profileData) {
      setPersonalForm({
        date_of_birth: normalizeDateInput(profileData.date_of_birth),
        address: profileData.address || "",
        nationality: profileData.nationality || "",
        personal_email: profileData.personal_email || "",
        gender: profileData.gender?.toLowerCase() || "",
        marital_status: profileData.marital_status?.toLowerCase() || ""
      })
      setIsEditingPersonal(true)
    }
  }

  const handlePersonalFormChange = (field: string, value: string) => {
    setPersonalForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSavePersonalInfo = async () => {
    if (!profileData) return

    setSavingPersonal(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const normalizedDob = normalizeDateForApi(personalForm.date_of_birth)
      if (personalForm.date_of_birth && !normalizedDob) {
        toast({ title: "Error", description: "Date of Birth must be in YYYY-MM-DD format", variant: "destructive" })
        return
      }

      await api.put(`/employees/${profileData.id}`, {
        date_of_birth: normalizedDob,
        address: personalForm.address || null,
        nationality: personalForm.nationality || null,
        personal_email: personalForm.personal_email || null,
        gender: normalizeEnum(personalForm.gender),
        marital_status: normalizeEnum(personalForm.marital_status)
      }, token)

      // Update local state
      setProfileData({
        ...profileData,
        date_of_birth: normalizedDob || "",
        address: personalForm.address,
        nationality: personalForm.nationality,
        personal_email: personalForm.personal_email,
        gender: personalForm.gender.toLowerCase(),
        marital_status: personalForm.marital_status.toLowerCase()
      })
      setIsEditingPersonal(false)
      toast({ title: "Success", description: "Personal information updated successfully" })
    } catch (error: any) {
      console.error(error)
      toast({
        title: "Error",
        description: error.message || "Failed to update personal information",
        variant: "destructive"
      })
    } finally {
      setSavingPersonal(false)
    }
  }

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

  // Calculate salary totals
  const grossSalary = salaryStructure
    ? salaryStructure.basic_salary + salaryStructure.hra + salaryStructure.standard_allowance +
    salaryStructure.performance_bonus + salaryStructure.lta + salaryStructure.fixed_allowance
    : 0
  const totalDeductions = salaryStructure
    ? salaryStructure.professional_tax + salaryStructure.pf_contribution
    : 0
  const netSalary = grossSalary - totalDeductions

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            View your profile information, including personal details and credentials. Contact HR if you need to update any information.
          </p>
        </div>
        <Button variant="default" className="flex items-center gap-2">
          <Edit className="w-4 h-4" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Side - Profile Picture */}
            <div className="flex flex-col items-center md:items-start">
              <div className="relative">
                <img
                  src={profileData.profile_picture || "/placeholder.svg"}
                  alt={fullName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
                <input
                  type="file"
                  id="profile-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'profile-picture')}
                  disabled={uploading}
                />
              </div>
              <div className="flex gap-2 mt-3">
                {profileData.profile_picture && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profileData.profile_picture} target="_blank" rel="noopener noreferrer">
                      <Eye className="w-4 h-4 mr-1" /> View
                    </a>
                  </Button>
                )}
                <Button size="sm" onClick={() => document.getElementById('profile-upload')?.click()} disabled={uploading}>
                  <Upload className="w-4 h-4 mr-1" /> {uploading ? "..." : "Upload"}
                </Button>
              </div>
            </div>

            {/* Middle - Personal Info */}
            <div className="flex-1 space-y-4">
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Name</Label>
                <p className="text-2xl font-bold text-foreground">{fullName}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Job Position</Label>
                <p className="font-medium text-foreground">{profileData.designation || "N/A"}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <p className="font-medium">{profileData.email}</p>
                  </div>
                </div>
                <div className="space-y-1">
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
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Company</Label>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <p className="font-medium">{profileData.company_name || "N/A"}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Department</Label>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <p className="font-medium">{profileData.department || "N/A"}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Manager</Label>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <p className="font-medium">{profileData.manager_id ? `Manager ID: ${profileData.manager_id}` : "N/A"}</p>
                  </div>
                </div>
                <div className="space-y-1">
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
      <Tabs defaultValue="private" className="w-full">
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="private">Private Info</TabsTrigger>
          <TabsTrigger value="salary">Salary Info</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Resume Tab */}
        <TabsContent value="resume" className="space-y-6">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Resume</h3>
                  <p className="text-sm text-muted-foreground">
                    {profileData.resume_url ? "Resume uploaded" : "No resume uploaded"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {profileData.resume_url && (
                  <Button variant="outline" asChild>
                    <a href={profileData.resume_url} target="_blank" rel="noopener noreferrer">
                      <Eye className="w-4 h-4 mr-1" /> View
                    </a>
                  </Button>
                )}
                <div className="relative">
                  <input
                    type="file"
                    id="resume-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e, 'resume')}
                    disabled={uploading}
                  />
                  <Button onClick={() => document.getElementById('resume-upload')?.click()} disabled={uploading}>
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? "Uploading..." : "Upload New"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Private Info Tab */}
        <TabsContent value="private" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                {!isEditingPersonal ? (
                  <Button variant="outline" size="sm" onClick={handleStartEditPersonal}>
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditingPersonal(false)} disabled={savingPersonal}>
                      <X className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                    <Button size="sm" onClick={handleSavePersonalInfo} disabled={savingPersonal}>
                      <Save className="w-4 h-4 mr-1" /> {savingPersonal ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Date of Birth</Label>
                    {isEditingPersonal ? (
                      <Input
                        type="date"
                        value={personalForm.date_of_birth}
                        onChange={(e) => handlePersonalFormChange("date_of_birth", e.target.value)}
                      />
                    ) : (
                      <p className="font-medium">{profileData.date_of_birth || "N/A"}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Date of Joining</Label>
                    <p className="font-medium">{profileData.joining_date || "N/A"}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Residing Address</Label>
                  {isEditingPersonal ? (
                    <Textarea
                      placeholder="Enter your address"
                      value={personalForm.address}
                      onChange={(e) => handlePersonalFormChange("address", e.target.value)}
                      rows={2}
                    />
                  ) : (
                    <p className="font-medium">{profileData.address || "N/A"}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Nationality</Label>
                    {isEditingPersonal ? (
                      <Input
                        placeholder="Enter nationality"
                        value={personalForm.nationality}
                        onChange={(e) => handlePersonalFormChange("nationality", e.target.value)}
                      />
                    ) : (
                      <p className="font-medium">{profileData.nationality || "N/A"}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Personal Email</Label>
                    {isEditingPersonal ? (
                      <Input
                        type="email"
                        placeholder="Enter personal email"
                        value={personalForm.personal_email}
                        onChange={(e) => handlePersonalFormChange("personal_email", e.target.value)}
                      />
                    ) : (
                      <p className="font-medium">{profileData.personal_email || "N/A"}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Gender</Label>
                    {isEditingPersonal ? (
                      <Select value={personalForm.gender} onValueChange={(value) => handlePersonalFormChange("gender", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="font-medium capitalize">{profileData.gender || "N/A"}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Marital Status</Label>
                    {isEditingPersonal ? (
                      <Select value={personalForm.marital_status} onValueChange={(value) => handlePersonalFormChange("marital_status", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="font-medium capitalize">{profileData.marital_status || "N/A"}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bank Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Landmark className="w-5 h-5" />
                  Bank Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bankDetails.length > 0 ? (
                  bankDetails.map((bank, index) => (
                    <div key={bank.id || index} className="space-y-3 p-4 bg-muted/30 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-sm text-muted-foreground">Account Number</Label>
                          <p className="font-medium font-mono">{bank.account_number}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm text-muted-foreground">Bank Name</Label>
                          <p className="font-medium">{bank.bank_name}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-sm text-muted-foreground">IFSC Code</Label>
                          <p className="font-medium font-mono">{bank.ifsc_code}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm text-muted-foreground">PAN No</Label>
                          <p className="font-medium font-mono">{bank.pan_number || "N/A"}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-sm text-muted-foreground">UAN No</Label>
                          <p className="font-medium font-mono">{bank.uan_number || "N/A"}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm text-muted-foreground">Emp Code</Label>
                          <p className="font-medium font-mono">{profileData.employee_id}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : isAddingBank ? (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Account Number *</Label>
                        <Input
                          placeholder="Enter account number"
                          value={bankForm.account_number}
                          onChange={(e) => handleBankFormChange("account_number", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Bank Name *</Label>
                        <Input
                          placeholder="Enter bank name"
                          value={bankForm.bank_name}
                          onChange={(e) => handleBankFormChange("bank_name", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>IFSC Code *</Label>
                        <Input
                          placeholder="Enter IFSC code"
                          value={bankForm.ifsc_code}
                          onChange={(e) => handleBankFormChange("ifsc_code", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>PAN No</Label>
                        <Input
                          placeholder="Enter PAN number"
                          value={bankForm.pan_number}
                          onChange={(e) => handleBankFormChange("pan_number", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>UAN No</Label>
                        <Input
                          placeholder="Enter UAN number"
                          value={bankForm.uan_number}
                          onChange={(e) => handleBankFormChange("uan_number", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Emp Code</Label>
                        <Input
                          value={profileData.employee_id}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                      <Button variant="outline" onClick={() => setIsAddingBank(false)} disabled={savingBank}>
                        <X className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                      <Button onClick={handleSaveBankDetails} disabled={savingBank}>
                        <Save className="w-4 h-4 mr-1" /> {savingBank ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No bank details added yet.</p>
                    <Button variant="outline" className="mt-4" onClick={() => setIsAddingBank(true)}>
                      <Plus className="w-4 h-4 mr-1" /> Add Bank Details
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Salary Info Tab */}
        <TabsContent value="salary" className="space-y-6">
          {salaryStructure ? (
            <>
              {/* Salary Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Gross Salary</p>
                    <p className="text-3xl font-bold text-foreground">₹{grossSalary.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">/ month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Deductions</p>
                    <p className="text-3xl font-bold text-red-500">₹{totalDeductions.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">/ month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Net Salary</p>
                    <p className="text-3xl font-bold text-green-600">₹{netSalary.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">/ month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Salary Components */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Earnings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: "Basic Salary", value: salaryStructure.basic_salary },
                      { label: "House Rent Allowance", value: salaryStructure.hra },
                      { label: "Standard Allowance", value: salaryStructure.standard_allowance },
                      { label: "Performance Bonus", value: salaryStructure.performance_bonus },
                      { label: "Leave Travel Allowance", value: salaryStructure.lta },
                      { label: "Fixed Allowance", value: salaryStructure.fixed_allowance },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm">{item.label}</span>
                        <span className="font-medium">₹{item.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Deductions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: "Professional Tax", value: salaryStructure.professional_tax },
                      { label: "PF Contribution", value: salaryStructure.pf_contribution },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
                        <span className="text-sm">{item.label}</span>
                        <span className="font-medium text-red-600">- ₹{item.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No salary information available.</p>
                <p className="text-sm text-muted-foreground mt-1">Contact HR for more details.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

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
                  <Label className="text-sm text-muted-foreground">Login ID / Employee Code</Label>
                  <div className="flex items-center gap-3">
                    <code className="bg-muted px-3 py-2 rounded-md font-mono text-base flex-1">
                      {profileData.employee_id}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(profileData.employee_id)
                        toast({ title: "Copied!", description: "Login ID copied to clipboard" })
                      }}
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
                      onClick={() => {
                        navigator.clipboard.writeText(profileData.email)
                        toast({ title: "Copied!", description: "Email copied to clipboard" })
                      }}
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
      </Tabs>
    </div>
  )
}
