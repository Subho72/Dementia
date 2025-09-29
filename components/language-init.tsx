"use client"

import { useEffect } from "react"

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

export function LanguageInit() {
  useEffect(() => {
    try {
      const onboarding = localStorage.getItem("cognitiveOnboarding")
      let langCode = "en"
      if (onboarding) {
        const parsed = JSON.parse(onboarding)
        if (parsed?.language && langMap[parsed.language]) {
          langCode = langMap[parsed.language]
        }
      } else {
        const stored = localStorage.getItem("cognitiveLang")
        if (stored) langCode = stored
      }
      document.documentElement.lang = langCode
    } catch {
      document.documentElement.lang = "en"
    }
  }, [])
  return null
}
