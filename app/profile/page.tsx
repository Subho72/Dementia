"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CognitiveLogo } from "@/components/cognitive-logo"
import { User, ArrowLeft } from "lucide-react"
import { BackButton } from "@/components/back-button"

interface CurrentUser {
  id: string
  email: string
  fullName: string
  createdAt: string
}

interface OnboardingUser {
  fullName?: string
  age?: string
  gender?: string
  phone?: string
  language?: string
  education?: string
  primaryLanguage?: string
}

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [onboarding, setOnboarding] = useState<OnboardingUser | null>(null)

  useEffect(() => {
    const u = localStorage.getItem("cognitiveCurrentUser")
    if (u) setCurrentUser(JSON.parse(u))
    const o = localStorage.getItem("cognitiveOnboarding")
    if (o) setOnboarding(JSON.parse(o))
  }, [])

  return (
    <div className="min-h-screen hero-gradient">
      <header className="border-b border-border/20 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <CognitiveLogo className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">Your Profile</h1>
              <p className="text-xs text-muted-foreground">Manage your details</p>
            </div>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="btn-secondary bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <BackButton className="mb-6" />
        <Card className="medical-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>These details are private and stored locally</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                <p className="text-foreground font-medium">{onboarding?.fullName || currentUser?.fullName || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="text-foreground font-medium">{currentUser?.email || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Phone</p>
                <p className="text-foreground font-medium">{onboarding?.phone || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Age</p>
                <p className="text-foreground font-medium">{onboarding?.age || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Gender</p>
                <p className="text-foreground font-medium capitalize">{onboarding?.gender || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Preferred Language</p>
                <p className="text-foreground font-medium capitalize">{onboarding?.language || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Education</p>
                <p className="text-foreground font-medium capitalize">{onboarding?.education || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Native Language</p>
                <p className="text-foreground font-medium capitalize">{onboarding?.primaryLanguage || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
