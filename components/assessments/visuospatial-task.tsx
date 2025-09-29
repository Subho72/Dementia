"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, RotateCcw, ArrowRight, Sparkles } from "lucide-react"

interface VisuospatialTaskProps {
  onComplete: (data: any) => void
}

export function VisuospatialTask({ onComplete }: VisuospatialTaskProps) {
  const [phase, setPhase] = useState<"instructions" | "drawing">("instructions")
  const [targetTime, setTargetTime] = useState("10:30")
  const [startTime, setStartTime] = useState<Date | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawingData, setDrawingData] = useState<string>("")

  useEffect(() => {
    if (phase === "drawing") {
      setStartTime(new Date())
      setupCanvas()
    }
  }, [phase])

  const setupCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 500
    canvas.height = 500

    // Set drawing styles
    ctx.strokeStyle = "#6366f1"
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    // Clear canvas with white background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    let x, y

    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    let x, y

    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (canvas) {
      setDrawingData(canvas.toDataURL())
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setDrawingData("")
  }

  const handleComplete = () => {
    const endTime = new Date()
    const canvas = canvasRef.current
    const finalDrawingData = canvas ? canvas.toDataURL() : drawingData

    const data = {
      taskId: "visuospatial",
      startTime: startTime?.toISOString(),
      endTime: endTime.toISOString(),
      duration: startTime ? endTime.getTime() - startTime.getTime() : 0,
      targetTime,
      drawingData: finalDrawingData,
      completedAt: new Date().toISOString(),
    }
    onComplete(data)
  }

  return (
    <div className="max-w-5xl mx-auto">
      {phase === "instructions" && (
        <Card className="card-hover border-0 shadow-2xl glass">
          <CardHeader className="text-center gradient-bg-2 text-white rounded-t-2xl">
            <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl mt-2.5">
              <Clock className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl text-white mb-2">The Clock Draw</CardTitle>
            <CardDescription className="text-lg text-white/90">Visuospatial Function Assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-10">
            <div className="glass p-8 rounded-2xl border border-primary/20">
              <h3 className="font-bold text-foreground mb-6 text-xl">Instructions:</h3>
              <ol className="list-decimal list-inside space-y-4 text-muted-foreground text-lg">
                <li>You will draw a clock face on the canvas provided</li>
                <li>Include all 12 numbers in their correct positions</li>
                <li>
                  Draw the hands to show the time: <strong className="text-foreground text-xl">{targetTime}</strong>
                </li>
                <li>Take your time and draw as accurately as possible</li>
                <li>You can clear and restart if needed</li>
              </ol>
            </div>

            <div className="glass p-8 rounded-2xl border border-accent/20">
              <p className="text-foreground text-lg">
                <strong className="text-primary flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Remember:
                </strong>
                Draw a complete clock with numbers 1-12, and set the hands to show {targetTime}.
              </p>
            </div>

            <div className="text-center">
              <Button
                onClick={() => setPhase("drawing")}
                size="lg"
                className="px-12 py-4 text-lg gradient-bg-2 hover:opacity-90 transition-all duration-300 text-white border-0 shadow-2xl glow-button hover:scale-105"
              >
                <ArrowRight className="w-6 h-6 mr-3" />
                Start Drawing
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === "drawing" && (
        <Card className="card-hover border-0 shadow-2xl glass">
          <CardHeader className="text-center gradient-bg-2 text-white rounded-t-2xl">
            <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl mt-2.5">
              <Clock className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl text-white mb-2">Draw a Clock Showing {targetTime}</CardTitle>
            <CardDescription className="text-lg text-white/90">
              Draw the clock face with numbers and hands
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-10">
            <div className="text-center">
              <div className="inline-block border-4 border-primary/20 rounded-2xl p-6 glass shadow-2xl">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="border-2 border-border/30 cursor-crosshair rounded-xl shadow-lg"
                  style={{ touchAction: "none", maxWidth: "100%", height: "auto" }}
                />
              </div>
            </div>

            <div className="flex justify-center gap-6">
              <Button
                onClick={clearCanvas}
                variant="outline"
                className="flex items-center gap-3 glass border-2 hover:bg-destructive/10 hover:scale-105 transition-all duration-300 px-8 py-3 text-lg bg-transparent"
              >
                <RotateCcw className="w-5 h-5" />
                Clear & Restart
              </Button>
              <Button
                onClick={handleComplete}
                size="lg"
                className="px-12 py-4 text-lg gradient-bg-2 hover:opacity-90 transition-all duration-300 text-white border-0 shadow-2xl glow-button hover:scale-105"
              >
                <ArrowRight className="w-6 h-6 mr-3" />
                Complete Task
              </Button>
            </div>

            <div className="glass p-6 rounded-2xl text-center border border-border/20">
              <p className="text-lg text-muted-foreground">
                <strong className="text-foreground">Target Time:</strong> {targetTime} (Ten thirty)
                <br />
                <span className="text-base">
                  Make sure to include all numbers 1-12 and position the hands correctly
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
