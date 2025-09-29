"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, RotateCcw, ArrowRight, Sparkles } from "lucide-react"

interface ProcessingSpeedTaskProps {
  onComplete: (data: any) => void
}

interface TrailItem {
  id: string
  x: number
  y: number
  isNumber: boolean
  value: string
  completed: boolean
}

export function ProcessingSpeedTask({ onComplete }: ProcessingSpeedTaskProps) {
  const [phase, setPhase] = useState<"instructions" | "task" | "completed">("instructions")
  const [trailItems, setTrailItems] = useState<TrailItem[]>([])
  const [currentTarget, setCurrentTarget] = useState<string>("1")
  const [sequence, setSequence] = useState<string[]>([])
  const [errors, setErrors] = useState<number>(0)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [completionTime, setCompletionTime] = useState<number>(0)
  const [clickSequence, setClickSequence] = useState<{ item: string; timestamp: number; correct: boolean }[]>([])

  const generateNonOverlappingPositions = useCallback((count: number) => {
    const positions = []
    const minDistance = 80 // Minimum distance between items

    for (let i = 0; i < count; i++) {
      let attempts = 0
      let position

      do {
        position = {
          x: Math.random() * 70 + 10, // 10-80% of container width
          y: Math.random() * 70 + 10, // 10-80% of container height
        }
        attempts++
      } while (
        attempts < 50 &&
        positions.some(
          (pos) => Math.sqrt(Math.pow(pos.x - position.x, 2) + Math.pow(pos.y - position.y, 2)) < minDistance,
        )
      )

      positions.push(position)
    }

    return positions
  }, [])

  const generateTrail = useCallback(() => {
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8"]
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H"]
    const items: TrailItem[] = []

    // Create alternating sequence: 1-A-2-B-3-C-4-D-5-E-6-F-7-G-8-H
    const targetSequence = []
    for (let i = 0; i < 8; i++) {
      targetSequence.push(numbers[i])
      targetSequence.push(letters[i])
    }
    setSequence(targetSequence)

    // Generate better distributed positions for all items
    const allItems = [...numbers, ...letters]
    const positions = generateNonOverlappingPositions(allItems.length)

    allItems.forEach((item, index) => {
      const isNumber = numbers.includes(item)
      items.push({
        id: `${item}-${index}`,
        x: positions[index].x,
        y: positions[index].y,
        isNumber,
        value: item,
        completed: false,
      })
    })

    setTrailItems(items)
  }, [generateNonOverlappingPositions])

  const startTask = () => {
    setStartTime(new Date())
    setPhase("task")
    generateTrail()
    setCurrentTarget("1")
    setErrors(0)
    setClickSequence([])
  }

  const handleItemClick = (item: TrailItem) => {
    const timestamp = Date.now()
    const isCorrect = item.value === currentTarget

    setClickSequence((prev) => [
      ...prev,
      {
        item: item.value,
        timestamp,
        correct: isCorrect,
      },
    ])

    if (isCorrect) {
      // Mark item as completed
      setTrailItems((prev) => prev.map((i) => (i.value === item.value ? { ...i, completed: true } : i)))

      // Find next target in sequence
      const currentIndex = sequence.indexOf(currentTarget)
      if (currentIndex < sequence.length - 1) {
        setCurrentTarget(sequence[currentIndex + 1])
      } else {
        // Task completed
        const endTime = Date.now()
        const duration = startTime ? endTime - startTime.getTime() : 0
        setCompletionTime(duration)
        setPhase("completed")
      }
    } else {
      setErrors((prev) => prev + 1)
      // Visual feedback for incorrect click
      const element = document.getElementById(`trail-item-${item.id}`)
      if (element) {
        element.style.animation = "shake 0.5s"
        setTimeout(() => {
          element.style.animation = ""
        }, 500)
      }
    }
  }

  const resetTask = () => {
    generateTrail()
    setCurrentTarget("1")
    setErrors(0)
    setClickSequence([])
    setStartTime(new Date())
  }

  const handleComplete = () => {
    const endTime = new Date()
    const data = {
      taskId: "processing-speed",
      startTime: startTime?.toISOString(),
      endTime: endTime.toISOString(),
      duration: completionTime || (startTime ? endTime.getTime() - startTime.getTime() : 0),
      errors,
      sequence,
      clickSequence,
      completed: phase === "completed",
      completedAt: new Date().toISOString(),
    }
    onComplete(data)
  }

  return (
    <div className="max-w-5xl mx-auto">
      {phase === "instructions" && (
        <Card className="card-hover border-0 shadow-2xl glass">
          <CardHeader className="text-center gradient-bg-4 text-white rounded-t-2xl">
            <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl mt-2.5">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl text-white mb-2">Digital Trail Making</CardTitle>
            <CardDescription className="text-lg text-white/90">Attention & Processing Speed Assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-10">
            <div className="glass p-8 rounded-2xl border border-primary/20">
              <h3 className="font-bold text-foreground mb-6 text-xl">Instructions:</h3>
              <ol className="list-decimal list-inside space-y-4 text-muted-foreground text-lg">
                <li>You will see numbers (1-8) and letters (A-H) scattered on the screen</li>
                <li>
                  Click them in alternating order:{" "}
                  <strong className="text-foreground text-lg">
                    1 → A → 2 → B → 3 → C → 4 → D → 5 → E → 6 → F → 7 → G → 8 → H
                  </strong>
                </li>
                <li>Work as quickly and accurately as possible</li>
                <li>If you make a mistake, keep going - errors will be tracked</li>
                <li>The task is complete when you reach H</li>
              </ol>
            </div>

            <div className="glass p-8 rounded-2xl border border-accent/20">
              <p className="text-foreground text-lg">
                <strong className="text-primary flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Remember:
                </strong>
                Alternate between numbers and letters in sequence. Speed and accuracy are both important!
              </p>
            </div>

            <div className="text-center">
              <Button
                onClick={startTask}
                size="lg"
                className="px-12 py-4 text-lg gradient-bg-4 hover:opacity-90 transition-all duration-300 text-white border-0 shadow-2xl glow-button hover:scale-105"
              >
                <Zap className="w-6 h-6 mr-3" />
                Start Trail Making
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === "task" && (
        <Card className="card-hover border-0 shadow-2xl glass">
          <CardHeader className="text-center gradient-bg-4 text-white rounded-t-2xl">
            <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl mt-2.5">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl text-white mb-2">Click: {currentTarget}</CardTitle>
            <CardDescription className="text-lg text-white/90">
              Errors: {errors} | Next in sequence:{" "}
              {sequence.slice(sequence.indexOf(currentTarget), sequence.indexOf(currentTarget) + 3).join(" → ")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-10">
            <div
              className="relative glass rounded-2xl border-4 border-dashed border-primary/30 shadow-inner"
              style={{ height: "600px" }}
            >
              {trailItems.map((item) => (
                <button
                  key={item.id}
                  id={`trail-item-${item.id}`}
                  onClick={() => handleItemClick(item)}
                  className={`absolute w-16 h-16 rounded-2xl border-3 font-bold text-xl transition-all duration-300 transform hover:scale-125 shadow-lg ${
                    item.completed
                      ? "bg-green-100 border-green-500 text-green-700 shadow-green-200"
                      : item.value === currentTarget
                        ? "gradient-bg-1 text-white border-white shadow-2xl animate-pulse scale-110"
                        : item.isNumber
                          ? "bg-blue-100 border-blue-500 text-blue-700 hover:bg-blue-200 hover:shadow-blue-200"
                          : "bg-purple-100 border-purple-500 text-purple-700 hover:bg-purple-200 hover:shadow-purple-200"
                  }`}
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  disabled={item.completed}
                >
                  {item.value}
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-6">
              <Button
                onClick={resetTask}
                variant="outline"
                className="flex items-center gap-3 glass border-2 hover:bg-destructive/10 hover:scale-105 transition-all duration-300 px-8 py-3 text-lg bg-transparent"
              >
                <RotateCcw className="w-5 h-5" />
                Restart
              </Button>
            </div>

            <div className="glass p-6 rounded-2xl text-center border border-border/20">
              <p className="text-lg text-muted-foreground">
                <strong className="text-foreground">Current Target:</strong> {currentTarget} |{" "}
                <strong className="text-foreground">Progress:</strong> {sequence.indexOf(currentTarget) + 1}/
                {sequence.length} | <strong className="text-foreground">Errors:</strong> {errors}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === "completed" && (
        <Card className="card-hover border-0 shadow-2xl glass">
          <CardHeader className="text-center gradient-bg-5 text-white rounded-t-2xl">
            <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl mt-2.5">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl text-white mb-2">Trail Completed!</CardTitle>
            <CardDescription className="text-lg text-white/90">
              Excellent work! You completed the trail making task.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-10">
            <div className="grid grid-cols-2 gap-6">
              <div className="glass p-8 rounded-2xl text-center border border-border/20">
                <div className="text-4xl font-bold text-primary mb-2">{(completionTime / 1000).toFixed(1)}s</div>
                <div className="text-lg text-muted-foreground">Completion Time</div>
              </div>
              <div className="glass p-8 rounded-2xl text-center border border-border/20">
                <div className="text-4xl font-bold text-primary mb-2">{errors}</div>
                <div className="text-lg text-muted-foreground">Errors</div>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={handleComplete}
                size="lg"
                className="px-12 py-4 text-lg gradient-bg-5 hover:opacity-90 transition-all duration-300 text-white border-0 shadow-2xl glow-button hover:scale-105"
              >
                <ArrowRight className="w-6 h-6 mr-3" />
                Complete Task
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translate(-50%, -50%) translateX(0); }
          25% { transform: translate(-50%, -50%) translateX(-5px); }
          75% { transform: translate(-50%, -50%) translateX(5px); }
        }
      `}</style>
    </div>
  )
}
