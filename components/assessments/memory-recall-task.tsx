"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Brain, Play, Mic, MicOff, Volume2, Pause, ArrowRight, Sparkles } from "lucide-react"

interface MemoryRecallTaskProps {
  onComplete: (data: any) => void
}

const sampleStory = {
  title: "The Village Market",
  content: `Maria walked to the village market on a sunny Tuesday morning. She needed to buy three items: fresh tomatoes, a loaf of bread, and some cheese for her family's dinner. At the market, she met her neighbor Carlos, who told her about the new bakery that opened last week. Maria bought the tomatoes from the first vendor, but the bread from the new bakery Carlos mentioned. She forgot to buy the cheese because she was distracted by a street musician playing guitar. On her way home, she remembered the cheese and returned to buy it from the dairy stand.`,
}

export function MemoryRecallTask({ onComplete }: MemoryRecallTaskProps) {
  const [phase, setPhase] = useState<"instructions" | "listening" | "recall" | "recording">("instructions")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [writtenRecall, setWrittenRecall] = useState("")
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioProgress, setAudioProgress] = useState(0)
  const [audioDuration, setAudioDuration] = useState(30)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (phase === "listening") {
      setStartTime(new Date())
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
    }
  }, [phase])

  const playStory = () => {
    if ("speechSynthesis" in window) {
      setIsPlaying(true)
      setAudioProgress(0)

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }

      const utterance = new SpeechSynthesisUtterance(sampleStory.content)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1

      utterance.onend = () => {
        setIsPlaying(false)
        setAudioProgress(100)
        setTimeout(() => setPhase("recall"), 1000)
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current)
          progressIntervalRef.current = null
        }
      }

      utterance.onerror = () => {
        setIsPlaying(false)
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current)
          progressIntervalRef.current = null
        }
      }

      speechSynthRef.current = utterance
      speechSynthesis.speak(utterance)

      // Enhanced progress tracking
      let progress = 0
      progressIntervalRef.current = setInterval(() => {
        progress += 100 / (audioDuration * 10)
        setAudioProgress(Math.min(progress, 95))
      }, 100)
    } else {
      // Fallback for browsers without speech synthesis
      setIsPlaying(true)
      setTimeout(() => {
        setIsPlaying(false)
        setPhase("recall")
      }, 30000)
    }
  }

  const pauseStory = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel()
      setIsPlaying(false)
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        setAudioBlob(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert("Unable to access microphone. Please check your permissions and try again.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleComplete = () => {
    const endTime = new Date()
    const data = {
      taskId: "memory-recall",
      startTime: startTime?.toISOString(),
      endTime: endTime.toISOString(),
      duration: startTime ? endTime.getTime() - startTime.getTime() : 0,
      writtenRecall,
      audioRecall: audioBlob ? "recorded" : null,
      storyContent: sampleStory.content,
      completedAt: new Date().toISOString(),
    }
    onComplete(data)
  }

  return (
    <div className="max-w-5xl mx-auto">
      {phase === "instructions" && (
        <Card className="card-hover border-0 shadow-2xl glass">
          <CardHeader className="text-center gradient-bg-1 text-white rounded-t-2xl">
            <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto shadow-xl mb-6 mt-2">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl text-white mb-2">The Storyteller</CardTitle>
            <CardDescription className="text-lg text-white/90">Memory & Recall Assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-10">
            <div className="glass p-8 rounded-2xl border border-primary/20">
              <h3 className="font-bold text-foreground mb-6 flex items-center gap-3 text-xl">
                <Volume2 className="w-6 h-6 text-primary" />
                Instructions:
              </h3>
              <ol className="list-decimal list-inside space-y-4 text-muted-foreground text-lg">
                <li>You will hear a short story about everyday activities</li>
                <li>Listen carefully and try to remember as many details as possible</li>
                <li>After the story ends, you'll retell it in your own words</li>
                <li>You can choose to write your response or record it by speaking</li>
                <li>Take your time - there's no rush</li>
              </ol>
            </div>

            <div className="glass p-8 rounded-2xl border border-accent/20">
              <p className="text-foreground text-lg">
                <strong className="text-primary flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Tip:
                </strong>
                Focus on the main events, characters, and important details. Don't worry about remembering every single
                word.
              </p>
            </div>

            <div className="text-center">
              <Button
                onClick={() => setPhase("listening")}
                size="lg"
                className="px-12 py-4 text-lg gradient-bg-1 hover:opacity-90 transition-all duration-300 text-white border-0 shadow-2xl glow-button hover:scale-105"
              >
                <Play className="w-6 h-6 mr-3" />
                Start Story
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === "listening" && (
        <Card className="card-hover border-0 shadow-2xl glass">
          <CardHeader className="text-center gradient-bg-2 text-white rounded-t-2xl">
            <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              {isPlaying ? (
                <div className="audio-visualizer text-white">
                  <div className="audio-bar"></div>
                  <div className="audio-bar"></div>
                  <div className="audio-bar"></div>
                  <div className="audio-bar"></div>
                  <div className="audio-bar"></div>
                </div>
              ) : (
                <Brain className="w-10 h-10 text-white" />
              )}
            </div>
            <CardTitle className="text-3xl text-white mb-2">Listen Carefully</CardTitle>
            <CardDescription className="text-lg text-white/90">
              The story is playing. Pay attention to the details.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-8 p-10">
            <div className="glass p-10 rounded-2xl border border-border/50">
              <div className="text-xl text-white mb-8 leading-relaxed text-balance font-medium">
                {sampleStory.content}
              </div>

              {isPlaying && (
                <div className="w-full bg-muted/50 rounded-full h-3 mb-6">
                  <div
                    className="gradient-bg-2 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${audioProgress}%` }}
                  ></div>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-6">
              {!isPlaying ? (
                <Button
                  onClick={playStory}
                  size="lg"
                  className="px-12 py-4 text-lg gradient-bg-2 hover:opacity-90 transition-all duration-300 text-white border-0 shadow-2xl glow-button hover:scale-105"
                >
                  <Play className="w-6 h-6 mr-3" />
                  Play Story Audio
                </Button>
              ) : (
                <Button
                  onClick={pauseStory}
                  size="lg"
                  variant="outline"
                  className="px-12 py-4 text-lg glass border-2 hover:bg-destructive/10 hover:scale-105 transition-all duration-300 bg-transparent"
                >
                  <Pause className="w-6 h-6 mr-3" />
                  Stop Audio
                </Button>
              )}
            </div>

            {!isPlaying && (
              <Button
                onClick={() => setPhase("recall")}
                variant="outline"
                className="mt-6 glass border-2 hover:bg-primary/10 hover:scale-105 transition-all duration-300"
              >
                Skip to Recall (Read Only)
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {phase === "recall" && (
        <Card className="card-hover border-0 shadow-2xl glass">
          <CardHeader className="text-center gradient-bg-3 text-white rounded-t-2xl">
            <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl text-white mb-2">Now Retell the Story</CardTitle>
            <CardDescription className="text-lg text-white/90">
              Share what you remember in your own words
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-10">
            <div className="space-y-6">
              <div>
                <label className="text-lg font-semibold text-foreground mb-4 block">Write your response:</label>
                <Textarea
                  placeholder="Tell me what you remember about the story. Include as many details as you can recall..."
                  value={writtenRecall}
                  onChange={(e) => setWrittenRecall(e.target.value)}
                  className="min-h-40 border-2 focus:border-primary/50 rounded-2xl text-lg p-6 glass"
                />
              </div>

              <div className="text-center">
                <p className="text-lg text-muted-foreground mb-6">Or record your response:</p>
                <div className="flex justify-center gap-6">
                  <Button
                    onClick={() => setPhase("recording")}
                    variant="outline"
                    className="flex items-center gap-3 border-2 hover:bg-accent/10 glass hover:scale-105 transition-all duration-300 px-8 py-3 text-lg"
                  >
                    <Mic className="w-5 h-5" />
                    Record Response
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={handleComplete}
                disabled={!writtenRecall.trim() && !audioBlob}
                size="lg"
                className="px-12 py-4 text-lg gradient-bg-3 hover:opacity-90 transition-all duration-300 text-white border-0 shadow-2xl disabled:opacity-50 glow-button hover:scale-105"
              >
                <ArrowRight className="w-6 h-6 mr-3" />
                Complete Task
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === "recording" && (
        <Card className="card-hover border-0 shadow-2xl glass">
          <CardHeader className="text-center gradient-bg-4 text-white rounded-t-2xl">
            <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl relative">
              {isRecording && <div className="absolute inset-0 rounded-full border-2 border-white/50 pulse-ring"></div>}
              <Mic className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl text-white mb-2">Record Your Response</CardTitle>
            <CardDescription className="text-lg text-white/90">Speak clearly and take your time</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-8 p-10">
            <div className="glass p-10 rounded-2xl border border-border/50">
              <p className="text-muted-foreground mb-8 text-lg">
                Click the microphone button to start recording, then retell the story in your own words.
              </p>

              <div className="flex justify-center">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    size="lg"
                    className="gradient-bg-4 hover:opacity-90 transition-all duration-300 text-white border-0 shadow-2xl px-12 py-4 text-lg glow-button hover:scale-105"
                  >
                    <Mic className="w-6 h-6 mr-3" />
                    Start Recording
                  </Button>
                ) : (
                  <Button
                    onClick={stopRecording}
                    size="lg"
                    variant="destructive"
                    className="shadow-2xl px-12 py-4 text-lg hover:scale-105 transition-all duration-300"
                  >
                    <MicOff className="w-6 h-6 mr-3" />
                    Stop Recording
                  </Button>
                )}
              </div>

              {isRecording && (
                <div className="mt-8">
                  <div className="w-6 h-6 bg-red-500 rounded-full mx-auto animate-pulse"></div>
                  <p className="text-lg text-red-600 mt-4 font-semibold">Recording in progress...</p>
                </div>
              )}
            </div>

            {audioBlob && (
              <div className="text-center glass p-8 rounded-2xl border border-green-200">
                <p className="text-green-700 mb-6 font-semibold text-lg">✓ Recording completed successfully!</p>
                <Button
                  onClick={handleComplete}
                  size="lg"
                  className="px-12 py-4 text-lg gradient-bg-4 hover:opacity-90 transition-all duration-300 text-white border-0 shadow-2xl glow-button hover:scale-105"
                >
                  <ArrowRight className="w-6 h-6 mr-3" />
                  Complete Task
                </Button>
              </div>
            )}

            <Button
              onClick={() => setPhase("recall")}
              variant="outline"
              className="glass border-2 hover:bg-primary/10 hover:scale-105 transition-all duration-300"
            >
              Back to Written Response
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
