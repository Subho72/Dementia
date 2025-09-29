"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CognitiveLogo } from "@/components/cognitive-logo"
import { Brain, Play, ArrowRight, LogOut, TrendingUp, Clock, Award, BarChart3 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User } from "lucide-react" // Import User component
import { getUserAssessments, type AssessmentResult } from "@/lib/services/assessment-service"
import { BackButton } from "@/components/back-button"

interface DashboardUser {
  id: string
  email: string
  fullName: string
  createdAt: string
  assessments: any[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [assessments, setAssessments] = useState<AssessmentResult[]>([])

  useEffect(() => {
    const currentUser = localStorage.getItem("cognitiveCurrentUser")
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    } else {
      router.push("/auth")
    }
    getUserAssessments().then((res) => setAssessments(res || []))
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("cognitiveCurrentUser")
    router.push("/")
  }

  const handleStartAssessment = () => {
    router.push("/onboarding")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="text-center">
          <CognitiveLogo className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen hero-gradient">
      {/* Header */}
      <header className="border-b border-border/20 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <CognitiveLogo className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">CogNitive Dashboard</h1>
              <p className="text-xs text-muted-foreground">Your Cognitive Health Journey</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/profile" className="hidden md:flex items-center gap-2 hover:opacity-90">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{user.fullName}</span>
            </Link>
            <Button onClick={handleLogout} variant="outline" size="sm" className="btn-secondary bg-transparent">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <BackButton className="mb-6" />

        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user.fullName.split(" ")[0]}!</h2>
          <p className="text-lg text-muted-foreground">
            Track your cognitive health progress and take new assessments.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="medical-card">
            <CardHeader>
              <div className="w-12 h-12 medical-gradient-1 rounded-lg flex items-center justify-center mb-4">
                <Play className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">Start New Assessment</CardTitle>
              <CardDescription>Take a comprehensive cognitive screening test</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleStartAssessment} className="w-full btn-primary">
                <Play className="w-4 h-4 mr-2" />
                Begin Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardHeader>
              <div className="w-12 h-12 medical-gradient-2 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">View Progress</CardTitle>
              <CardDescription>See your assessment history and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/reports">
                <Button
                  variant="outline"
                  className="w-full btn-secondary bg-transparent"
                  disabled={assessments.length === 0}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Reports
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardHeader>
              <div className="w-12 h-12 medical-gradient-3 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">Learn More</CardTitle>
              <CardDescription>Understand cognitive health and assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/learn-more">
                <Button variant="outline" className="w-full btn-secondary bg-transparent">
                  <Brain className="w-4 h-4 mr-2" />
                  Explore Resources
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Assessment History */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Assessment History
            </CardTitle>
            <CardDescription>Your completed cognitive assessments and results</CardDescription>
          </CardHeader>
          <CardContent>
            {assessments.length === 0 ? (
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Assessments Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Take your first cognitive assessment to start tracking your progress.
                </p>
                <Button onClick={handleStartAssessment} className="btn-primary">
                  <Play className="w-4 h-4 mr-2" />
                  Start Your First Assessment
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground border-b border-border/30">
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Score</th>
                      <th className="py-2 pr-4">Risk</th>
                      <th className="py-2 pr-4">Type</th>
                      <th className="py-2 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.map((a) => (
                      <tr key={a.id} className="border-b border-border/20">
                        <td className="py-3 pr-4">
                          {a.completed_at ? new Date(a.completed_at).toLocaleString() : "—"}
                        </td>
                        <td className="py-3 pr-4">{a.score}/100</td>
                        <td className="py-3 pr-4 capitalize">{a.risk_level}</td>
                        <td className="py-3 pr-4">{a.assessment_type}</td>
                        <td className="py-3 pr-4">
                          <Link href="/reports">
                            <Button variant="outline" size="sm" className="btn-secondary bg-transparent">
                              View Report
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
