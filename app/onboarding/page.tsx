"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { CognitiveLogo } from "@/components/cognitive-logo"
import { ArrowLeft, ArrowRight, User, Phone, Shield, Clock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface OnboardingData {
  fullName: string
  age: string
  gender: string
  phone: string
  language: string
  education: string
  primaryLanguage: string
  consentGiven: boolean
  privacyAccepted: boolean
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    fullName: "",
    age: "",
    gender: "",
    phone: "",
    language: "",
    education: "",
    primaryLanguage: "",
    consentGiven: false,
    privacyAccepted: false,
  })

  const totalSteps = 4 // Reduced from 5 to 4 steps since we removed one step

  useEffect(() => {
    const originalConsoleError = console.error
    console.error = (...args) => {
      if (
        args[0] &&
        typeof args[0] === "string" &&
        args[0].includes("ResizeObserver loop completed with undelivered notifications")
      ) {
        // Suppress ResizeObserver errors
        return
      }
      originalConsoleError.apply(console, args)
    }

    const handleError = (event: ErrorEvent) => {
      if (event.message && event.message.includes("ResizeObserver loop completed with undelivered notifications")) {
        event.preventDefault()
        event.stopPropagation()
        return false
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason && event.reason.message && event.reason.message.includes("ResizeObserver")) {
        event.preventDefault()
        return false
      }
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      console.error = originalConsoleError
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  useEffect(() => {
    const langMap: Record<string, string> = {
      english: "en",
      hindi: "hi",
      bengali: "bn",
      telugu: "te",
      marathi: "mr",
      tamil: "ta",
      gujarati: "gu",
      urdu: "ur",
      kannada: "kn",
      odia: "or",
      punjabi: "pa",
      malayalam: "ml",
      assamese: "as",
    }
    if (data.language) {
      const lang = langMap[data.language] || "en"
      try {
        localStorage.setItem("cognitiveLang", lang)
      } catch {}
      if (typeof document !== "undefined") {
        document.documentElement.lang = lang
      }
    }
  }, [data.language])

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      localStorage.setItem("cognitiveOnboarding", JSON.stringify(data))
      router.push("/assessment")
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.fullName !== "" && data.age !== "" && data.gender !== "" && data.phone !== ""
      case 2:
        return data.language !== ""
      case 3:
        return data.education !== "" && data.primaryLanguage !== ""
      case 4:
        return data.consentGiven && data.privacyAccepted
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen hero-gradient">
      <header className="border-b border-border/20 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <CognitiveLogo className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">CogNitive Assessment</h1>
              <p className="text-xs text-muted-foreground">Setup Your Profile</p>
            </div>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Step {step} of {totalSteps}
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Profile Setup</span>
            <span className="text-sm text-muted-foreground">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="medical-gradient-1 h-3 rounded-full transition-all duration-500 ease-in-out"
              style={{
                width: `${(step / totalSteps) * 100}%`,
                transform: "translateZ(0)", // Force hardware acceleration to prevent layout thrashing
              }}
            />
          </div>
        </div>

        {step === 1 && (
          <Card className="medical-card">
            <CardHeader className="text-center">
              <div className="w-16 h-16 medical-gradient-1 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Your Information</CardTitle>
              <CardDescription>
                We need your basic details to personalize your assessment and send you the results report about your
                cognitive health.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={data.fullName}
                  onChange={(e) => setData({ ...data, fullName: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <div style={{ minHeight: "48px" }}>
                    <Select value={data.age} onValueChange={(value) => setData({ ...data, age: value })}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select your age" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="18-29">18-29 years</SelectItem>
                        <SelectItem value="30-39">30-39 years</SelectItem>
                        <SelectItem value="40-49">40-49 years</SelectItem>
                        <SelectItem value="50-59">50-59 years</SelectItem>
                        <SelectItem value="60-69">60-69 years</SelectItem>
                        <SelectItem value="70-79">70-79 years</SelectItem>
                        <SelectItem value="80+">80+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <RadioGroup
                    value={data.gender}
                    onValueChange={(value) => setData({ ...data, gender: value })}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={data.phone}
                    onChange={(e) => setData({ ...data, phone: e.target.value })}
                    className="h-12 pl-10"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  We'll send your assessment results and dementia risk report to this number.
                </p>
              </div>

              <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 inline mr-2 text-accent" />
                  Your information is kept completely confidential and secure. We only use it to personalize your
                  assessment and deliver your results.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="medical-card">
            <CardHeader className="text-center">
              <div className="w-16 h-16 medical-gradient-2 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <CardTitle className="text-2xl">Choose Your Language</CardTitle>
              <CardDescription>
                Select your preferred language for the assessment. This helps us provide culturally relevant content and
                accurate analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Assessment Language</Label>
                <div style={{ minHeight: "48px" }}>
                  <Select value={data.language} onValueChange={(value) => setData({ ...data, language: value })}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select your preferred language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">हिन्दी (Hindi)</SelectItem>
                      <SelectItem value="bengali">বাংলা (Bengali)</SelectItem>
                      <SelectItem value="telugu">తెలుగు (Telugu)</SelectItem>
                      <SelectItem value="marathi">मराठी (Marathi)</SelectItem>
                      <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                      <SelectItem value="gujarati">ગુજરાતી (Gujarati)</SelectItem>
                      <SelectItem value="urdu">اردو (Urdu)</SelectItem>
                      <SelectItem value="kannada">ಕನ್ನಡ (Kannada)</SelectItem>
                      <SelectItem value="odia">ଓଡ଼ିଆ (Odia)</SelectItem>
                      <SelectItem value="punjabi">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                      <SelectItem value="malayalam">മലയാളം (Malayalam)</SelectItem>
                      <SelectItem value="assamese">অসমীয়া (Assamese)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="medical-card">
            <CardHeader className="text-center">
              <div className="w-16 h-16 medical-gradient-3 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <CardTitle className="text-2xl">Education & Language</CardTitle>
              <CardDescription>
                Your educational background and native language help us better interpret your assessment results.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="education">Highest Level of Education</Label>
                <div style={{ minHeight: "48px" }}>
                  <Select value={data.education} onValueChange={(value) => setData({ ...data, education: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elementary">Elementary School</SelectItem>
                      <SelectItem value="middle">Middle School</SelectItem>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="some-college">Some College</SelectItem>
                      <SelectItem value="associates">Associate's Degree</SelectItem>
                      <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                      <SelectItem value="masters">Master's Degree</SelectItem>
                      <SelectItem value="doctorate">Doctorate/PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryLanguage">Native/Primary Language</Label>
                <div style={{ minHeight: "48px" }}>
                  <Select
                    value={data.primaryLanguage}
                    onValueChange={(value) => setData({ ...data, primaryLanguage: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your native language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="bengali">Bengali</SelectItem>
                      <SelectItem value="telugu">Telugu</SelectItem>
                      <SelectItem value="marathi">Marathi</SelectItem>
                      <SelectItem value="tamil">Tamil</SelectItem>
                      <SelectItem value="gujarati">Gujarati</SelectItem>
                      <SelectItem value="urdu">Urdu</SelectItem>
                      <SelectItem value="kannada">Kannada</SelectItem>
                      <SelectItem value="odia">Odia</SelectItem>
                      <SelectItem value="punjabi">Punjabi</SelectItem>
                      <SelectItem value="malayalam">Malayalam</SelectItem>
                      <SelectItem value="assamese">Assamese</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 inline mr-2" />
                  This information helps us adjust scoring algorithms to account for cultural and educational
                  differences, ensuring more accurate results.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card className="medical-card">
            <CardHeader className="text-center">
              <div className="w-16 h-16 trust-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Consent & Privacy</CardTitle>
              <CardDescription>
                Please review and accept our terms to proceed with your cognitive assessment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consent"
                    checked={data.consentGiven}
                    onCheckedChange={(checked) => setData({ ...data, consentGiven: checked as boolean })}
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="consent"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Assessment Consent
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      I understand that this is a screening tool and not a medical diagnosis. I consent to participate
                      in the cognitive assessment and understand that results should be discussed with a healthcare
                      professional.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacy"
                    checked={data.privacyAccepted}
                    onCheckedChange={(checked) => setData({ ...data, privacyAccepted: checked as boolean })}
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="privacy"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Privacy Policy
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      I have read and accept the{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                      . I understand how my data will be used and that all information is kept confidential and secure.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Important Disclaimer</h4>
                <p className="text-sm text-muted-foreground">
                  CogNitive is a screening tool designed to identify potential cognitive concerns. It is not a
                  substitute for professional medical evaluation. If you have concerns about your cognitive health,
                  please consult with a qualified healthcare provider.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between items-center mt-8">
          <Button variant="outline" onClick={handleBack} disabled={step === 1} className="btn-secondary bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Button onClick={handleNext} disabled={!canProceed()} className="btn-primary">
            {step === totalSteps ? "Start Assessment" : "Continue"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Contact our support team at{" "}
            <Link href="mailto:support@cognitive.app" className="text-primary hover:underline">
              support@cognitive.app
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
