"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CognitiveLogo } from "@/components/cognitive-logo"
import { Download, FileText, ArrowLeft } from "lucide-react"
import { getUserAssessments, type AssessmentResult } from "@/lib/services/assessment-service"
import { BackButton } from "@/components/back-button"

export default function ReportsPage() {
  const [reports, setReports] = useState<AssessmentResult[]>([])

  useEffect(() => {
    getUserAssessments().then((res) =>
      setReports((res || []).sort((a, b) => (b.completed_at || "").localeCompare(a.completed_at || ""))),
    )
  }, [])

  const download = (r: AssessmentResult) => {
    const dateStr = r.completed_at ? new Date(r.completed_at).toLocaleString() : "Unknown"
    const content = [
      "COGNITIVE ASSESSMENT REPORT (Summary)",
      `Name: ${r.user_name}`,
      `Phone: ${r.user_phone}`,
      `Age: ${r.user_age}`,
      `Gender: ${r.user_gender}`,
      `Assessment Type: ${r.assessment_type}`,
      `Completed At: ${dateStr}`,
      `Score: ${r.score}/100`,
      `Risk Level: ${r.risk_level.toUpperCase()}`,
      "",
      "Note: This is a summary export. Visit the Results page for the detailed breakdown and recommendations.",
    ].join("\n")
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    const safeName = (r.user_name || "Patient").replace(/\s+/g, "_")
    a.href = url
    a.download = `Cognitive_Report_${safeName}_${(r.completed_at || "").replace(/[:.]/g, "").slice(0, 15)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen hero-gradient">
      <header className="border-b border-border/20 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <CognitiveLogo className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">Your Reports</h1>
              <p className="text-xs text-muted-foreground">All assessments in one place</p>
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

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <BackButton className="mb-6" />
        <Card className="medical-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>Assessment Reports</CardTitle>
                <CardDescription>Download and review current and past assessments</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <p className="text-muted-foreground">
                No reports available yet. Take your first assessment to see reports here.
              </p>
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
                    {reports.map((r) => (
                      <tr key={r.id} className="border-b border-border/20">
                        <td className="py-3 pr-4">
                          {r.completed_at ? new Date(r.completed_at).toLocaleString() : "—"}
                        </td>
                        <td className="py-3 pr-4">{r.score}/100</td>
                        <td className="py-3 pr-4 capitalize">{r.risk_level}</td>
                        <td className="py-3 pr-4">{r.assessment_type}</td>
                        <td className="py-3 pr-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="btn-secondary bg-transparent"
                            onClick={() => download(r)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
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
