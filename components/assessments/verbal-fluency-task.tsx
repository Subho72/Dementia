"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MessageSquare, Timer, Plus, ArrowRight, Sparkles } from "lucide-react"

interface VerbalFluencyTaskProps {
  onComplete: (data: any) => void
}

const categories = [
  { id: "animals", name: "Animals", example: "dog, cat, elephant...", color: "gradient-bg-1" },
  { id: "fruits", name: "Fruits", example: "apple, banana, orange...", color: "gradient-bg-2" },
  { id: "colors", name: "Colors", example: "red, blue, green...", color: "gradient-bg-3" },
]

export function VerbalFluencyTask({ onComplete }: VerbalFluencyTaskProps) {
  const [phase, setPhase] = useState<"instructions" | "task" | "completed">("instructions")
  const [selectedCategory, setSelectedCategory] = useState(categories[0])
  const [timeLeft, setTimeLeft] = useState(60)
  const [isActive, setIsActive] = useState(false)
  const [words, setWords] = useState<string[]>([])
  const [currentWord, setCurrentWord] = useState("")
  const [startTime, setStartTime] = useState<Date | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsActive(false)
            setPhase("completed")
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isActive]) // Removed timeLeft from dependencies to prevent loop

  const startTask = () => {
    setStartTime(new Date())
    setPhase("task")
    setIsActive(true)
    setTimeLeft(60)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const addWord = () => {
    const trimmedWord = currentWord.trim().toLowerCase()
    if (trimmedWord && !words.includes(trimmedWord) && trimmedWord.length > 1) {
      setWords([...words, trimmedWord])
      setCurrentWord("")
      // Visual feedback for successful word addition
      if (inputRef.current) {
        inputRef.current.style.borderColor = "#10b981"
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.style.borderColor = ""
          }
        }, 300)
      }
    } else if (words.includes(trimmedWord)) {
      // Visual feedback for duplicate word
      if (inputRef.current) {
        inputRef.current.style.borderColor = "#ef4444"
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.style.borderColor = ""
          }
        }, 300)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addWord()
    }
  }

  const removeWord = (index: number) => {
    setWords(words.filter((_, i) => i !== index))
  }

  const handleComplete = () => {
    const endTime = new Date()

    // Analyze word clusters (basic grouping)
    const clusters = analyzeWordClusters(words, selectedCategory.id)

    const data = {
      taskId: "verbal-fluency",
      startTime: startTime?.toISOString(),
      endTime: endTime.toISOString(),
      duration: startTime ? endTime.getTime() - startTime.getTime() : 0,
      category: selectedCategory.id,
      words,
      totalWords: words.length,
      uniqueWords: words.length, // Already filtered for uniqueness
      clusters,
      completedAt: new Date().toISOString(),
    }
    onComplete(data)
  }

  const analyzeWordClusters = (wordList: string[], category: string) => {
    // Simple clustering logic based on category
    const clusters: { [key: string]: string[] } = {}

    if (category === "animals") {
      const pets = ["dog", "cat", "hamster", "rabbit", "bird", "fish"]
      const wild = ["lion", "tiger", "elephant", "giraffe", "zebra", "monkey"]
      const farm = ["cow", "pig", "chicken", "horse", "sheep", "goat"]

      clusters.pets = wordList.filter((word) => pets.some((pet) => word.includes(pet)))
      clusters.wild = wordList.filter((word) => wild.some((w) => word.includes(w)))
      clusters.farm = wordList.filter((word) => farm.some((f) => word.includes(f)))
      clusters.other = wordList.filter(
        (word) => !clusters.pets.includes(word) && !clusters.wild.includes(word) && !clusters.farm.includes(word),
      )
    } else {
      clusters.all = wordList
    }

    return clusters
  }

  return (
    <div className="max-w-5xl mx-auto">
      {phase === "instructions" && (
        <Card className="card-hover border-0 shadow-2xl glass">
          <CardHeader className="text-center gradient-bg-3 text-white rounded-t-2xl">
            <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl mt-2.5">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl text-white mb-2">Verbal Fluency Challenge</CardTitle>
            <CardDescription className="text-lg text-white/90">Executive Function Assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-10">
            <div className="glass p-8 rounded-2xl border border-primary/20">
              <h3 className="font-bold text-foreground mb-6 text-xl">Instructions:</h3>
              <ol className="list-decimal list-inside space-y-4 text-muted-foreground text-lg">
                <li>
                  You have <strong className="text-foreground">60 seconds</strong> to name as many items as possible in
                  the given category
                </li>
                <li>Type each word and press Enter to add it to your list</li>
                <li>Try to think of as many different items as you can</li>
                <li>Duplicate words won't be counted</li>
                <li>The timer will start as soon as you begin</li>
              </ol>
            </div>

            <div className="space-y-6">
              <h3 className="font-bold text-foreground text-xl">Select Category:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <Card
                    key={category.id}
                    className={`cursor-pointer transition-all duration-300 hover:scale-105 card-hover ${
                      selectedCategory.id === category.id
                        ? "border-primary/50 shadow-2xl scale-105"
                        : "border-border/30 hover:border-primary/30"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                      >
                        <span className="text-white font-bold text-lg">{category.name[0]}</span>
                      </div>
                      <h4 className="font-semibold text-foreground mb-3 text-lg">{category.name}</h4>
                      <p className="text-sm text-muted-foreground">{category.example}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="glass p-8 rounded-2xl border border-accent/20">
              <p className="text-foreground text-lg">
                <strong className="text-primary flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Selected:
                </strong>
                {selectedCategory.name} - Name as many {selectedCategory.name.toLowerCase()} as you can in 60 seconds!
              </p>
            </div>

            <div className="text-center">
              <Button
                onClick={startTask}
                size="lg"
                className="px-12 py-4 text-lg gradient-bg-3 hover:opacity-90 transition-all duration-300 text-white border-0 shadow-2xl glow-button hover:scale-105"
              >
                <Timer className="w-6 h-6 mr-3" />
                Start Challenge
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === "task" && (
        <Card className="card-hover border-0 shadow-2xl glass">
          <CardHeader className="text-center gradient-bg-3 text-white rounded-t-2xl">
            <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl mt-2.5.5">
              <Timer className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl text-white mb-2">Name {selectedCategory.name}</CardTitle>
            <CardDescription className="text-lg text-white/90">
              Time remaining:{" "}
              <span className={`font-bold text-3xl ${timeLeft <= 10 ? "text-red-200" : "text-white"}`}>
                {timeLeft}s
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-10">
            <div className="flex gap-4">
              <Input
                ref={inputRef}
                value={currentWord}
                onChange={(e) => setCurrentWord(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Type a ${selectedCategory.name.slice(0, -1).toLowerCase()}...`}
                className="flex-1 text-lg p-4 rounded-xl border-2 focus:border-primary/50"
                disabled={!isActive}
              />
              <Button
                onClick={addWord}
                disabled={!currentWord.trim() || !isActive}
                className="px-6 py-4 gradient-bg-3 hover:opacity-90 transition-all duration-300 text-white border-0 shadow-lg hover:scale-105"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            <div className="glass p-8 rounded-2xl border border-border/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-foreground text-xl">Your Words ({words.length})</h3>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {words.length} words
                </Badge>
              </div>
              <div className="flex flex-wrap gap-3 min-h-[120px]">
                {words.map((word, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 hover:scale-105 text-base px-4 py-2"
                    onClick={() => removeWord(index)}
                  >
                    {word} ×
                  </Badge>
                ))}
                {words.length === 0 && (
                  <p className="text-muted-foreground italic text-lg">Your words will appear here...</p>
                )}
              </div>
            </div>

            <div className="text-center">
              <div
                className={`text-4xl font-bold mb-4 ${timeLeft <= 10 ? "text-red-600 animate-pulse" : "text-primary"}`}
              >
                {timeLeft}s remaining
              </div>
              <div className="w-full bg-muted/50 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all duration-1000 ${timeLeft <= 10 ? "bg-red-500" : "bg-gradient-to-r from-primary to-accent"}`}
                  style={{ width: `${(timeLeft / 60) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === "completed" && (
        <Card className="card-hover border-0 shadow-2xl glass">
          <CardHeader className="text-center gradient-bg-5 text-white rounded-t-2xl">
            <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl mt-2.5">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl text-white mb-2">Time's Up!</CardTitle>
            <CardDescription className="text-lg text-white/90">
              Great job! You named {words.length} {selectedCategory.name.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-10">
            <div className="glass p-8 rounded-2xl border border-border/20">
              <h3 className="font-bold text-foreground mb-6 text-xl">Your Final List:</h3>
              <div className="flex flex-wrap gap-3">
                {words.map((word, index) => (
                  <Badge key={index} variant="secondary" className="text-base px-4 py-2">
                    {word}
                  </Badge>
                ))}
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
    </div>
  )
}
