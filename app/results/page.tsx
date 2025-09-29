"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CognitiveLogo } from "@/components/cognitive-logo"
import { BackButton } from "@/components/back-button"
import {
  Brain,
  Clock,
  MessageSquare,
  Zap,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getUserAssessments, type AssessmentResult } from "@/lib/services/assessment-service"

interface AssessmentResults {
  memoryRecall?: any
  visuospatial?: any
  verbalFluency?: any
  processingSpeed?: any
  completedAt: string
  totalTime: number
  taskScores?: any // Added to match the RiskAnalysis interface
}

interface RiskAnalysis {
  overallRisk: number
  riskLevel: "Low" | "Moderate" | "High"
  riskColor: string
  taskScores: {
    memoryRecall: number
    visuospatial: number
    verbalFluency: number
    processingSpeed: number
  }
  recommendations: string[]
  strengths: string[]
  concerns: string[]
}

export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<AssessmentResults | null>(null)
  const [onboardingData, setOnboardingData] = useState<any>(null)
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [dbAssessment, setDbAssessment] = useState<AssessmentResult | null>(null)

  // Function to normalize result keys
  function normalizeResultsKeys(r: any) {
    if (!r || typeof r !== "object") return r
    const n = { ...r }
    if (r.memoryrecall && !r.memoryRecall) n.memoryRecall = r.memoryrecall
    if (r.verbalfluency && !r.verbalFluency) n.verbalFluency = r.verbalfluency
    if (r.processingspeed && !r.processingSpeed) n.processingSpeed = r.processingspeed
    return n
  }

  useEffect(() => {
    loadAssessmentData()
  }, [router])

  const loadAssessmentData = async () => {
    try {
      console.log("[v0] Loading assessment data...")

      // Try to load from database first
      const assessments = await getUserAssessments()
      console.log("[v0] Database assessments:", assessments)

      if (assessments && assessments.length > 0) {
        const latestAssessment = assessments[0]
        setDbAssessment(latestAssessment)

        // Convert database format to expected format and normalize keys
        const assessmentData = normalizeResultsKeys(latestAssessment.results)
        setResults(assessmentData)

        // Load onboarding data from localStorage (still needed for demographic info)
        const onboarding = localStorage.getItem("cognitiveOnboarding")
        if (onboarding) {
          setOnboardingData(JSON.parse(onboarding))
        }

        // Analyze results for this specific latest assessment
        const analysis = analyzeResults(assessmentData, JSON.parse(onboarding || "{}"))
        setRiskAnalysis(analysis)
        setLoading(false)
        return
      }
    } catch (error) {
      console.error("[v0] Error loading from database:", error)
    }

    // Fallback to localStorage if database fails or no data
    console.log("[v0] Falling back to localStorage...")
    const assessmentData = localStorage.getItem("cognitiveAssessmentData")
    const onboarding = localStorage.getItem("cognitiveOnboarding")

    if (!assessmentData || !onboarding) {
      router.push("/")
      return
    }

    const parsedResults = normalizeResultsKeys(JSON.parse(assessmentData))
    const parsedOnboarding = JSON.parse(onboarding)

    setResults(parsedResults)
    setOnboardingData(parsedOnboarding)

    // Analyze results
    const analysis = analyzeResults(parsedResults, parsedOnboarding)
    setRiskAnalysis(analysis)
    setLoading(false)
  }

  const analyzeResults = (assessmentData: AssessmentResults, demographic: any): RiskAnalysis => {
    // Simplified risk analysis algorithm
    const scores = {
      memoryRecall: calculateMemoryScore(assessmentData.memoryRecall),
      visuospatial: calculateVisuospatialScore(assessmentData.visuospatial),
      verbalFluency: calculateVerbalFluencyScore(assessmentData.verbalFluency),
      processingSpeed: calculateProcessingSpeedScore(assessmentData.processingSpeed),
    }

    // Calculate weighted overall risk (1-10 scale)
    const overallRisk =
      scores.memoryRecall * 0.3 +
      scores.visuospatial * 0.25 +
      scores.verbalFluency * 0.25 +
      scores.processingSpeed * 0.2

    let riskLevel: "Low" | "Moderate" | "High"
    let riskColor: string

    if (overallRisk <= 3) {
      riskLevel = "Low"
      riskColor = "text-green-600"
    } else if (overallRisk <= 6) {
      riskLevel = "Moderate"
      riskColor = "text-yellow-600"
    } else {
      riskLevel = "High"
      riskColor = "text-red-600"
    }

    const recommendations = generateRecommendations(scores, riskLevel, demographic)
    const strengths = identifyStrengths(scores)
    const concerns = identifyConcerns(scores)

    return {
      overallRisk,
      riskLevel,
      riskColor,
      taskScores: scores,
      recommendations,
      strengths,
      concerns,
    }
  }

  const calculateMemoryScore = (data: any): number => {
    if (!data) return 5

    let score = 0
    const writtenLength = data.writtenRecall?.length || 0
    const hasAudio = data.audioRecall !== null && data.audioRecall !== undefined

    // Written recall scoring (0-6 points)
    if (writtenLength >= 200) score += 6
    else if (writtenLength >= 150) score += 5
    else if (writtenLength >= 100) score += 4
    else if (writtenLength >= 50) score += 3
    else if (writtenLength >= 25) score += 2
    else if (writtenLength > 0) score += 1

    // Audio recall bonus (0-2 points)
    if (hasAudio) score += 2

    // Story comprehension bonus (0-2 points)
    if (writtenLength >= 100) score += 2
    else if (writtenLength >= 50) score += 1

    return Math.min(10, Math.max(1, score))
  }

  const calculateVisuospatialScore = (data: any): number => {
    if (!data) return 5

    let score = 0
    const hasDrawing = data.drawingData && data.drawingData.length > 0
    const completionTime = data.duration || 0

    // Drawing completion (0-5 points)
    if (hasDrawing) {
      score += 5

      // Time bonus (0-3 points)
      if (completionTime < 120000)
        score += 3 // Under 2 minutes
      else if (completionTime < 180000)
        score += 2 // Under 3 minutes
      else if (completionTime < 300000) score += 1 // Under 5 minutes

      // Drawing quality bonus (0-2 points) - simplified
      if (data.drawingData.length > 100)
        score += 2 // More complex drawing
      else if (data.drawingData.length > 50) score += 1
    } else {
      score = 2 // Minimal score for no drawing
    }

    return Math.min(10, Math.max(1, score))
  }

  const calculateVerbalFluencyScore = (data: any): number => {
    if (!data) return 5

    const wordCount = data.totalWords || 0
    const uniqueWords = data.uniqueWords || wordCount
    const category = data.category || "animals"

    let score = 0

    // Base word count scoring (age-adjusted norms)
    if (wordCount >= 20) score += 6
    else if (wordCount >= 15) score += 5
    else if (wordCount >= 12) score += 4
    else if (wordCount >= 8) score += 3
    else if (wordCount >= 5) score += 2
    else if (wordCount > 0) score += 1

    // Unique words bonus (0-2 points)
    const uniqueRatio = uniqueWords / Math.max(wordCount, 1)
    if (uniqueRatio >= 0.9) score += 2
    else if (uniqueRatio >= 0.8) score += 1

    // Category difficulty bonus (0-2 points)
    if (category === "animals" && wordCount >= 15) score += 2
    else if (category === "animals" && wordCount >= 10) score += 1

    return Math.min(10, Math.max(1, score))
  }

  const calculateProcessingSpeedScore = (data: any): number => {
    if (!data) return 5

    const completed = data.completed || false
    const errors = data.errors || 0
    const duration = data.duration || 0
    const totalTargets = data.totalTargets || 25

    let score = 0

    if (!completed) {
      // Partial completion scoring
      const completedTargets = data.completedTargets || 0
      score = Math.max(1, (completedTargets / totalTargets) * 3)
    } else {
      // Full completion scoring
      score = 5

      // Speed bonus (0-3 points)
      if (duration < 45000)
        score += 3 // Under 45 seconds
      else if (duration < 60000)
        score += 2 // Under 1 minute
      else if (duration < 90000) score += 1 // Under 1.5 minutes

      // Accuracy bonus (0-2 points)
      if (errors === 0) score += 2
      else if (errors <= 1) score += 1
    }

    return Math.min(10, Math.max(1, score))
  }

  const generateRecommendations = (scores: any, riskLevel: string, demographic: any): string[] => {
    const recommendations = []

    if (riskLevel === "High") {
      recommendations.push("Consult with a healthcare professional for comprehensive cognitive evaluation")
      recommendations.push("Consider scheduling a follow-up assessment in 3-6 months")
    } else if (riskLevel === "Moderate") {
      recommendations.push("Discuss results with your primary care physician")
      recommendations.push("Consider lifestyle modifications to support cognitive health")
    } else {
      recommendations.push("Continue maintaining healthy lifestyle habits")
      recommendations.push("Consider annual cognitive screening")
    }

    if (scores.memoryRecall < 5) {
      recommendations.push("Practice memory exercises and maintain social engagement")
    }
    if (scores.processingSpeed < 5) {
      recommendations.push("Engage in activities that challenge processing speed and attention")
    }

    return recommendations
  }

  const identifyStrengths = (scores: any): string[] => {
    const strengths = []
    if (scores.memoryRecall >= 7) strengths.push("Strong memory and recall abilities")
    if (scores.visuospatial >= 7) strengths.push("Good visuospatial and executive function")
    if (scores.verbalFluency >= 7) strengths.push("Excellent verbal fluency and language skills")
    if (scores.processingSpeed >= 7) strengths.push("Fast processing speed and attention")
    return strengths
  }

  const identifyConcerns = (scores: any): string[] => {
    const concerns = []
    if (scores.memoryRecall < 4) concerns.push("Memory and recall performance below expected range")
    if (scores.visuospatial < 4) concerns.push("Visuospatial function may need attention")
    if (scores.verbalFluency < 4) concerns.push("Verbal fluency below typical performance")
    if (scores.processingSpeed < 4) concerns.push("Processing speed slower than expected")
    return concerns
  }

  const downloadReport = () => {
    if (!results || !riskAnalysis || !onboardingData) return

    const reportContent = generateHumanReadableReport()
    const dataBlob = new Blob([reportContent], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url

    const patientName = onboardingData.fullName || "Patient"
    const dateStr = new Date().toISOString().split("T")[0]
    link.download = `Cognitive_Assessment_Report_${patientName.replace(/\s+/g, "_")}_${dateStr}.txt`

    link.click()
    URL.revokeObjectURL(url)
  }

  const generateHumanReadableReport = (): string => {
    if (!results || !riskAnalysis || !onboardingData) return ""

    const reportDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const assessmentDate = new Date(results.completedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const overallScore = dbAssessment?.score || Math.round(((10 - riskAnalysis.overallRisk) / 9) * 100)
    const riskLevelFromDb = dbAssessment?.risk_level || riskAnalysis.riskLevel.toLowerCase()

    return `
COGNITIVE ASSESSMENT REPORT
Generated by CogNitive Assessment Platform
Report Date: ${reportDate}

================================================================================
PATIENT INFORMATION
================================================================================

Name: ${onboardingData.fullName || "Not provided"}
Date of Birth: ${onboardingData.dateOfBirth || "Not provided"}
Age: ${onboardingData.age || "Not provided"} years
Gender: ${onboardingData.gender || "Not provided"}
Education Level: ${onboardingData.educationLevel || "Not provided"}
Primary Language: ${onboardingData.primaryLanguage || "Not provided"}

Assessment Date: ${assessmentDate}
Total Assessment Time: ${Math.round(results.totalTime / 60000)} minutes
Assessment ID: ${dbAssessment?.id || "localStorage"}

================================================================================
OVERALL RESULTS SUMMARY
================================================================================

OVERALL SCORE: ${overallScore} / 100
DEMENTIA RISK INDEX: ${riskAnalysis.overallRisk.toFixed(1)} / 10
RISK LEVEL: ${riskLevelFromDb.toUpperCase()}

Risk Interpretation:
• Low Risk (1.0-3.0): Cognitive performance within normal range
• Moderate Risk (3.1-6.0): Some areas may benefit from attention
• High Risk (6.1-10.0): Recommend professional evaluation

================================================================================
DETAILED TASK RESULTS
================================================================================

1. MEMORY & RECALL ASSESSMENT
   Score: ${riskAnalysis.taskScores.memoryRecall.toFixed(1)} / 10
   Task: Story comprehension and recall
   
   Performance Details:
   • Written Response: ${results.memoryRecall?.writtenRecall ? "Provided" : "Not provided"}
   • Response Length: ${results.memoryRecall?.writtenRecall?.length || 0} characters
   • Audio Response: ${results.memoryRecall?.audioRecall ? "Provided" : "Not provided"}
   
   Interpretation:
   ${
     riskAnalysis.taskScores.memoryRecall >= 7
       ? "✓ Strong memory and recall abilities"
       : riskAnalysis.taskScores.memoryRecall >= 4
         ? "• Memory performance within acceptable range"
         : "⚠ Memory performance below expected range - consider follow-up"
   }

2. VISUOSPATIAL FUNCTION ASSESSMENT
   Score: ${riskAnalysis.taskScores.visuospatial.toFixed(1)} / 10
   Task: Clock drawing test
   
   Performance Details:
   • Drawing Completed: ${results.visuospatial?.drawingData ? "Yes" : "No"}
   • Completion Time: ${results.visuospatial?.duration ? Math.round(results.visuospatial.duration / 1000) + " seconds" : "Not recorded"}
   • Drawing Complexity: ${
     results.visuospatial?.drawingData?.length > 100
       ? "High"
       : results.visuospatial?.drawingData?.length > 50
         ? "Moderate"
         : "Low"
   }
   
   Interpretation:
   ${
     riskAnalysis.taskScores.visuospatial >= 7
       ? "✓ Good visuospatial and executive function"
       : riskAnalysis.taskScores.visuospatial >= 4
         ? "• Visuospatial performance within acceptable range"
         : "⚠ Visuospatial function may need attention - consider follow-up"
   }

3. VERBAL FLUENCY ASSESSMENT
   Score: ${riskAnalysis.taskScores.verbalFluency.toFixed(1)} / 10
   Task: Category fluency (naming items in a category)
   
   Performance Details:
   • Total Words Generated: ${results.verbalFluency?.totalWords || 0}
   • Category: ${results.verbalFluency?.category || "Animals"}
   • Time Limit: 60 seconds
   
   Age-Adjusted Norms:
   • Excellent (20+ words): Above 90th percentile
   • Good (15-19 words): 75th-90th percentile  
   • Average (12-14 words): 25th-75th percentile
   • Below Average (8-11 words): 10th-25th percentile
   • Concerning (<8 words): Below 10th percentile
   
   Interpretation:
   ${
     riskAnalysis.taskScores.verbalFluency >= 7
       ? "✓ Excellent verbal fluency and language skills"
       : riskAnalysis.taskScores.verbalFluency >= 4
         ? "• Verbal fluency within acceptable range"
         : "⚠ Verbal fluency below typical performance - consider follow-up"
   }

4. PROCESSING SPEED ASSESSMENT
   Score: ${riskAnalysis.taskScores.processingSpeed.toFixed(1)} / 10
   Task: Digital trail making (connecting numbers and letters)
   
   Performance Details:
   • Task Completed: ${results.processingSpeed?.completed ? "Yes" : "No"}
   • Completion Time: ${results.processingSpeed?.duration ? Math.round(results.processingSpeed.duration / 1000) + " seconds" : "Not completed"}
   • Errors Made: ${results.processingSpeed?.errors || 0}
   • Targets Hit: ${results.processingSpeed?.completedTargets || 0} / ${results.processingSpeed?.totalTargets || 25}
   
   Interpretation:
   ${
     riskAnalysis.taskScores.processingSpeed >= 7
       ? "✓ Fast processing speed and attention"
       : riskAnalysis.taskScores.processingSpeed >= 4
         ? "• Processing speed within acceptable range"
         : "⚠ Processing speed slower than expected - consider follow-up"
   }

================================================================================
COGNITIVE STRENGTHS
================================================================================

${
  riskAnalysis.strengths.length > 0
    ? riskAnalysis.strengths.map((strength, index) => `${index + 1}. ${strength}`).join("\n")
    : "No specific strengths identified in this assessment."
}

================================================================================
AREAS OF CONCERN
================================================================================

${
  riskAnalysis.concerns.length > 0
    ? riskAnalysis.concerns.map((concern, index) => `${index + 1}. ${concern}`).join("\n")
    : "No specific areas of concern identified in this assessment."
}

================================================================================
PERSONALIZED RECOMMENDATIONS
================================================================================

${riskAnalysis.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join("\n")}

Additional Lifestyle Recommendations:
• Maintain regular physical exercise (150 minutes moderate activity per week)
• Engage in mentally stimulating activities (reading, puzzles, learning new skills)
• Maintain social connections and community involvement
• Follow a brain-healthy diet (Mediterranean or MIND diet)
• Ensure adequate sleep (7-9 hours per night)
• Manage stress through relaxation techniques or meditation
• Stay up to date with regular medical checkups

================================================================================
IMPORTANT MEDICAL DISCLAIMER
================================================================================

This cognitive assessment is a SCREENING TOOL designed to identify potential 
cognitive concerns. It is NOT A MEDICAL DIAGNOSIS and should not replace 
professional medical evaluation.

Key Points:
• This assessment provides an indication of cognitive performance at one point in time
• Results can be influenced by factors such as fatigue, stress, medication, or illness
• Normal aging can affect some cognitive abilities without indicating dementia
• Some individuals may perform poorly on tests despite having normal cognition
• A comprehensive medical evaluation is needed for definitive diagnosis

WHEN TO SEEK PROFESSIONAL HELP:
• If this assessment indicates moderate to high risk
• If you or family members notice changes in memory, thinking, or daily functioning
• If you have concerns about your cognitive health regardless of test results
• For baseline cognitive evaluation if you have risk factors for dementia

NEXT STEPS:
1. Share these results with your primary care physician
2. Discuss any concerns about cognitive changes
3. Consider comprehensive neuropsychological testing if recommended
4. Follow up with annual cognitive screening

================================================================================
TECHNICAL INFORMATION
================================================================================

Assessment Platform: CogNitive v1.0
Scoring Algorithm: Weighted composite score
- Memory & Recall: 30% weight
- Visuospatial Function: 25% weight  
- Verbal Fluency: 25% weight
- Processing Speed: 20% weight

Overall Score: ${overallScore}/100 (Database stored)
Risk Level: ${riskLevelFromDb} (Database stored)

Report Generated: ${reportDate}
Assessment ID: ${dbAssessment?.id || results.completedAt.replace(/[:.]/g, "").substring(0, 16)}

For questions about this report, contact: support@cognitive.app

================================================================================
END OF REPORT
================================================================================
`.trim()
  }

  if (loading || !results || !riskAnalysis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <CognitiveLogo className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Analyzing your results...</p>
        </div>
      </div>
    )
  }

  const taskDetails = [
    {
      id: "memory-recall",
      title: "Memory & Recall",
      icon: Brain,
      score: riskAnalysis.taskScores.memoryRecall,
      data: results.memoryRecall,
      description: "Story comprehension and recall ability",
    },
    {
      id: "visuospatial",
      title: "Visuospatial Function",
      icon: Clock,
      score: riskAnalysis.taskScores.visuospatial,
      data: results.visuospatial,
      description: "Spatial awareness and executive function",
    },
    {
      id: "verbal-fluency",
      title: "Verbal Fluency",
      icon: MessageSquare,
      score: riskAnalysis.taskScores.verbalFluency,
      data: results.verbalFluency,
      description: "Language processing and executive function",
    },
    {
      id: "processing-speed",
      title: "Processing Speed",
      icon: Zap,
      score: riskAnalysis.taskScores.processingSpeed,
      data: results.processingSpeed,
      description: "Attention and cognitive processing speed",
    },
  ]

  return (
    <div className="min-h-screen hero-gradient">
      {/* Header */}
      <header className="border-b border-border/20 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <CognitiveLogo className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">Cognitive</h1>
              <p className="text-xs text-muted-foreground">Assessment Results</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              onClick={downloadReport}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent"
            >
              <Download className="w-4 h-4" />
              Download Report
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <BackButton className="mb-4" />
        {/* Overall Risk Assessment */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-3xl">Your Cognitive Assessment Results</CardTitle>
            <CardDescription className="text-base">
              Completed on {new Date(results.completedAt).toLocaleDateString()} • Total time:{" "}
              {Math.round(results.totalTime / 60000)} minutes
              {dbAssessment && (
                <span className="block text-green-600 text-sm mt-1">✓ Results saved to your secure profile</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="mb-4">
                {dbAssessment && (
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-primary mb-1">{dbAssessment.score}/100</div>
                    <div className="text-sm text-muted-foreground mb-2">Overall Assessment Score</div>
                  </div>
                )}
                <div className={`text-6xl font-bold ${riskAnalysis.riskColor} mb-2`}>
                  {riskAnalysis.overallRisk.toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground mb-2">Dementia Risk Index (1-10 scale)</div>
                <Badge
                  variant={riskAnalysis.riskLevel === "Low" ? "default" : "destructive"}
                  className="text-base px-4 py-1"
                >
                  {riskAnalysis.riskLevel} Risk
                </Badge>
              </div>
              <Progress value={(10 - riskAnalysis.overallRisk) * 10} className="h-3 mb-4" />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {riskAnalysis.strengths.length > 0 && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-800">Strengths</h3>
                  </div>
                  <ul className="text-sm text-green-700 space-y-1">
                    {riskAnalysis.strengths.map((strength, index) => (
                      <li key={index}>• {strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {riskAnalysis.concerns.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-semibold text-yellow-800">Areas of Concern</h3>
                  </div>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {riskAnalysis.concerns.map((concern, index) => (
                      <li key={index}>• {concern}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">Recommendations</h3>
                </div>
                <ul className="text-sm text-blue-700 space-y-1">
                  {riskAnalysis.recommendations.slice(0, 3).map((rec, index) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task Breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {taskDetails.map((task) => {
            const IconComponent = task.icon
            const scorePercentage = (task.score / 10) * 100

            return (
              <Card key={task.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <CardDescription>{task.description}</CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{task.score.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">/ 10</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={scorePercentage} className="h-2 mb-4" />
                  <div className="text-sm text-muted-foreground">
                    {task.id === "verbal-fluency" && task.data && (
                      <span>Words generated: {task.data.totalWords || 0}</span>
                    )}
                    {task.id === "processing-speed" && task.data && (
                      <span>
                        Completion: {task.data.completed ? "Yes" : "No"} • Errors: {task.data.errors || 0}
                      </span>
                    )}
                    {task.id === "memory-recall" && task.data && (
                      <span>Response provided: {task.data.writtenRecall ? "Written" : "Audio"}</span>
                    )}
                    {task.id === "visuospatial" && task.data && (
                      <span>Clock drawing: {task.data.drawingData ? "Completed" : "Not completed"}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Detailed Recommendations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Detailed Recommendations
            </CardTitle>
            <CardDescription>
              Based on your assessment results and demographic profile, here are personalized recommendations:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskAnalysis.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">{index + 1}</span>
                  </div>
                  <p className="text-sm text-foreground">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Important Disclaimer */}
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800 mb-2">Important Medical Disclaimer</h3>
                <p className="text-sm text-red-700 mb-4">
                  This assessment is a screening tool designed to identify potential cognitive concerns. It is{" "}
                  <strong>not a medical diagnosis</strong> and should not replace professional medical evaluation.
                </p>
                <p className="text-sm text-red-700">
                  If you have concerns about your cognitive health or if this assessment indicates moderate to high
                  risk, please consult with a qualified healthcare provider for comprehensive evaluation and appropriate
                  care.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center mt-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={downloadReport} size="lg" className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download Full Report
            </Button>
            <Button variant="outline" size="lg" className="flex items-center gap-2 bg-transparent">
              <Share2 className="w-5 h-5" />
              Share with Doctor
            </Button>
            <Link href="/">
              <Button variant="outline" size="lg" className="flex items-center gap-2 bg-transparent">
                Go Home
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" className="flex items-center gap-2">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button variant="outline" size="lg">
                Take Assessment Again
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            Questions about your results?{" "}
            <Link href="mailto:support@cognitive.app" className="text-primary hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
