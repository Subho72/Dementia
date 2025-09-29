"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CognitiveLogo } from "@/components/cognitive-logo"
import { Brain, Clock, MessageSquare, Zap, Play } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { saveAssessmentResult } from "@/lib/services/assessment-service"
import { Progress } from "@/components/ui/progress"

// Import individual assessment components
import { MemoryRecallTask } from "@/components/assessments/memory-recall-task"
import { VisuospatialTask } from "@/components/assessments/visuospatial-task"
import { VerbalFluencyTask } from "@/components/assessments/verbal-fluency-task"
import { ProcessingSpeedTask } from "@/components/assessments/processing-speed-task"

interface AssessmentData {
  memoryRecall?: any
  visuospatial?: any
  verbalFluency?: any
  processingSpeed?: any
}

const assessmentTasks = [
  {
    id: "memory-recall",
    title: "The Storyteller",
    subtitle: "Memory & Recall",
    description: "Listen to a short story and retell it in your own words",
    icon: Brain,
    estimatedTime: "5 minutes",
    gradient: "gradient-bg-1",
  },
  {
    id: "visuospatial",
    title: "The Clock Draw",
    subtitle: "Visuospatial Function",
    description: "Draw a clock showing a specific time",
    icon: Clock,
    estimatedTime: "3 minutes",
    gradient: "gradient-bg-2",
  },
  {
    id: "verbal-fluency",
    title: "Verbal Fluency Challenge",
    subtitle: "Executive Function",
    description: "Name as many items as possible in a given category",
    icon: MessageSquare,
    estimatedTime: "2 minutes",
    gradient: "gradient-bg-3",
  },
  {
    id: "processing-speed",
    title: "Digital Trail Making",
    subtitle: "Attention & Processing Speed",
    description: "Connect numbers and letters in alternating sequence",
    icon: Zap,
    estimatedTime: "4 minutes",
    gradient: "gradient-bg-4",
  },
]

export default function AssessmentPage() {
  const router = useRouter()
  const [currentTask, setCurrentTask] = useState<number>(-1) // -1 for overview
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({})
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const onboardingData = localStorage.getItem("cognitiveOnboarding")
    if (!onboardingData) {
      // Create minimal onboarding data if none exists
      const defaultOnboarding = {
        fullName: "Anonymous User",
        age: "30-39",
        gender: "prefer-not-to-say",
        phone: "",
        language: "english",
        education: "high-school",
        primaryLanguage: "english",
        consentGiven: true,
        privacyAccepted: true,
      }
      localStorage.setItem("cognitiveOnboarding", JSON.stringify(defaultOnboarding))
      console.log("[v0] Created default onboarding data for assessment")
    }
    setStartTime(new Date())
  }, [router])

  const taskIdToKey = (taskId: string) => {
    const map: Record<string, string> = {
      "memory-recall": "memoryRecall",
      visuospatial: "visuospatial",
      "verbal-fluency": "verbalFluency",
      "processing-speed": "processingSpeed",
    }
    // Fallback: convert kebab-case to camelCase
    return map[taskId] ?? taskId.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
  }

  const calculateScores = (finalData: AssessmentData & { completedAt: string; totalTime: number }) => {
    const memoryScore = calculateMemoryScore(finalData.memoryRecall)
    const visuospatialScore = calculateVisuospatialScore(finalData.visuospatial)
    const verbalFluencyScore = calculateVerbalFluencyScore(finalData.verbalFluency)
    const processingSpeedScore = calculateProcessingSpeedScore(finalData.processingSpeed)

    // Calculate weighted overall risk (1-10 scale)
    const overallScore =
      memoryScore * 0.3 + visuospatialScore * 0.25 + verbalFluencyScore * 0.25 + processingSpeedScore * 0.2

    // Convert to 0-100 scale for database storage
    const finalScore = Math.round(((10 - overallScore) / 9) * 100)

    let riskLevel: "low" | "moderate" | "high"
    if (overallScore <= 3) {
      riskLevel = "low"
    } else if (overallScore <= 6) {
      riskLevel = "moderate"
    } else {
      riskLevel = "high"
    }

    return {
      finalScore,
      riskLevel,
      taskScores: { memoryScore, visuospatialScore, verbalFluencyScore, processingSpeedScore },
    }
  }

  const calculateMemoryScore = (data: any): number => {
    if (!data) return 5

    let score = 0
    const writtenLength = data.writtenRecall?.length || 0
    const hasAudio = data.audioRecall !== null && data.audioRecall !== undefined

    if (writtenLength >= 200) score += 6
    else if (writtenLength >= 150) score += 5
    else if (writtenLength >= 100) score += 4
    else if (writtenLength >= 50) score += 3
    else if (writtenLength >= 25) score += 2
    else if (writtenLength > 0) score += 1

    if (hasAudio) score += 2
    if (writtenLength >= 100) score += 2
    else if (writtenLength >= 50) score += 1

    return Math.min(10, Math.max(1, score))
  }

  const calculateVisuospatialScore = (data: any): number => {
    if (!data) return 5

    let score = 0
    const hasDrawing = data.drawingData && data.drawingData.length > 0
    const completionTime = data.duration || 0

    if (hasDrawing) {
      score += 5
      if (completionTime < 120000) score += 3
      else if (completionTime < 180000) score += 2
      else if (completionTime < 300000) score += 1

      if (data.drawingData.length > 100) score += 2
      else if (data.drawingData.length > 50) score += 1
    } else {
      score = 2
    }

    return Math.min(10, Math.max(1, score))
  }

  const calculateVerbalFluencyScore = (data: any): number => {
    if (!data) return 5

    const wordCount = data.totalWords || 0
    const uniqueWords = data.uniqueWords || wordCount
    const category = data.category || "animals"

    let score = 0

    if (wordCount >= 20) score += 6
    else if (wordCount >= 15) score += 5
    else if (wordCount >= 12) score += 4
    else if (wordCount >= 8) score += 3
    else if (wordCount >= 5) score += 2
    else if (wordCount > 0) score += 1

    const uniqueRatio = uniqueWords / Math.max(wordCount, 1)
    if (uniqueRatio >= 0.9) score += 2
    else if (uniqueRatio >= 0.8) score += 1

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
      const completedTargets = data.completedTargets || 0
      score = Math.max(1, (completedTargets / totalTargets) * 3)
    } else {
      score = 5
      if (duration < 45000) score += 3
      else if (duration < 60000) score += 2
      else if (duration < 90000) score += 1

      if (errors === 0) score += 2
      else if (errors <= 1) score += 1
    }

    return Math.min(10, Math.max(1, score))
  }

  const handleTaskComplete = useCallback(
    async (taskId: string, data: any) => {
      console.log("[v0] Task completed:", taskId, data)

      setAssessmentData((prev) => ({
        ...prev,
        [taskIdToKey(taskId)]: data,
      }))

      // Move to next task or results
      setCurrentTask((prevTask) => {
        if (prevTask < assessmentTasks.length - 1) {
          return prevTask + 1
        } else {
          const finalData = {
            ...assessmentData,
            [taskIdToKey(taskId)]: data,
            completedAt: new Date().toISOString(),
            totalTime: startTime ? Date.now() - startTime.getTime() : 0,
          }

          // Save to database
          saveAssessmentToDatabase(finalData)
          return prevTask
        }
      })
    },
    [assessmentData, startTime],
  )

  const saveAssessmentToDatabase = async (finalData: AssessmentData & { completedAt: string; totalTime: number }) => {
    setSaving(true)
    console.log("[v0] Saving assessment to database:", finalData)

    const { finalScore, riskLevel, taskScores } = calculateScores(finalData)

    await saveAssessmentResult({
      assessment_type: "cognitive_assessment",
      results: {
        ...finalData,
        taskScores,
        calculatedAt: new Date().toISOString(),
      },
      score: finalScore,
      risk_level: riskLevel,
    })

    console.log("[v0] Assessment saved successfully")

    // Also save to localStorage as backup for immediate results viewing
    localStorage.setItem("cognitiveAssessmentData", JSON.stringify(finalData))

    router.push("/results")

    setSaving(false)
  }

  const startAssessment = () => {
    setCurrentTask(0)
  }

  const completedTasks = Object.keys(assessmentData).length
  const progressPercentage = (completedTasks / assessmentTasks.length) * 100

  if (saving) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <CognitiveLogo className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Saving your assessment results...</p>
        </div>
      </div>
    )
  }

  // Overview screen
  if (currentTask === -1) {
    return (
      <div className="min-h-screen hero-gradient">
        {/* Header */}
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-md shadow-sm">
          <div className="container flex items-center justify-between text-primary mx-px my-0 gap-0 py-3 px-px bg-[rgba(39,108,245,1)]">
            <Link href="/" className="flex items-center gap-3">
              <CognitiveLogo className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-lg font-semibold text-foreground">CogNitive</h1>
                <p className="text-xs text-muted-foreground">Cognitive Assessment</p>
              </div>
            </Link>
            <div className="text-sm text-muted-foreground bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full">
              Total Time: ~15 minutes
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 gradient-bg-1 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Begin Your Assessment?</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              You'll complete four engaging tasks designed to evaluate different aspects of cognitive function. Take
              your time and do your best on each task.
            </p>
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 p-6 rounded-xl max-w-2xl mx-auto backdrop-blur-sm">
              <p className="text-sm text-foreground">
                <strong className="text-primary">Important:</strong> Find a quiet space where you won't be interrupted.
                Make sure your device's microphone is enabled for the speaking tasks.
              </p>
            </div>
          </div>

          {/* Task Overview */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {assessmentTasks.map((task, index) => {
              const IconComponent = task.icon
              return (
                <Card
                  key={task.id}
                  className="card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden group"
                >
                  <div className={`${task.gradient} p-6 relative`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-transparent leading-3 rounded-xl border-b-0 mb-0 mt-0 ml-0 mr-0"></div>
                    <CardHeader className="relative z-10 p-0">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm text-white/90 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          {task.estimatedTime}
                        </span>
                      </div>
                      <CardTitle className="text-xl text-white mb-2">{task.title}</CardTitle>
                      <CardDescription className="text-base text-white/90">
                        <span className="font-medium text-white">{task.subtitle}</span>
                        <br />
                        <span className="text-white/80">{task.description}</span>
                      </CardDescription>
                    </CardHeader>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Start Button */}
          <div className="text-center">
            <Button
              size="lg"
              onClick={startAssessment}
              className="text-base px-8 gradient-bg-1 hover:opacity-90 transition-opacity text-white border-0 shadow-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Begin Assessment
            </Button>
            <p className="text-sm text-muted-foreground mt-4">You can pause between tasks if needed</p>
          </div>
        </div>
      </div>
    )
  }

  // Individual task screens
  const task = assessmentTasks[currentTask]
  const IconComponent = task.icon

  return (
    <div className="min-h-screen hero-gradient">
      {/* Header with Progress */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md shadow-sm">
        <div className="container py-4 px-4 mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CognitiveLogo className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-lg font-semibold text-foreground">Cognitive Assessment</h1>
                <p className="text-xs text-muted-foreground">
                  Task {currentTask + 1} of {assessmentTasks.length}
                </p>
              </div>
            </div>
            <div className="text-sm text-foreground bg-muted/60 px-3 py-1 rounded-full border border-border/50">
              {task.estimatedTime}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-foreground">{task.title}</span>
              <span className="text-muted-foreground">{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-3" aria-label="Assessment progress" />
          </div>
        </div>
      </header>

      {/* Task Content */}
      <div className="container mx-auto px-4 py-8">
        {currentTask === 0 && <MemoryRecallTask onComplete={(data) => handleTaskComplete("memory-recall", data)} />}
        {currentTask === 1 && <VisuospatialTask onComplete={(data) => handleTaskComplete("visuospatial", data)} />}
        {currentTask === 2 && <VerbalFluencyTask onComplete={(data) => handleTaskComplete("verbal-fluency", data)} />}
        {currentTask === 3 && (
          <ProcessingSpeedTask onComplete={(data) => handleTaskComplete("processing-speed", data)} />
        )}
      </div>
    </div>
  )
}
