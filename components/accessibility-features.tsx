"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Accessibility,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Type,
  Contrast,
  MousePointer,
  Keyboard,
  Settings,
} from "lucide-react"

interface AccessibilitySettings {
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
  screenReader: boolean
  keyboardNavigation: boolean
  audioDescriptions: boolean
  fontSize: number
}

export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    audioDescriptions: false,
    fontSize: 16,
  })

  useEffect(() => {
    // Load saved accessibility settings
    const savedSettings = localStorage.getItem("cognitiveAccessibility")
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      setSettings(parsed)
      applySettings(parsed)
    }
  }, [])

  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement

    // High contrast
    if (newSettings.highContrast) {
      root.classList.add("high-contrast")
    } else {
      root.classList.remove("high-contrast")
    }

    // Large text
    if (newSettings.largeText) {
      root.classList.add("large-text")
    } else {
      root.classList.remove("large-text")
    }

    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add("reduce-motion")
    } else {
      root.classList.remove("reduce-motion")
    }

    // Font size
    root.style.fontSize = `${newSettings.fontSize}px`

    // Save settings
    localStorage.setItem("cognitiveAccessibility", JSON.stringify(newSettings))
  }

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean | number) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    applySettings(newSettings)
  }

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      audioDescriptions: false,
      fontSize: 16,
    }
    setSettings(defaultSettings)
    applySettings(defaultSettings)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 p-0"
        aria-label="Open accessibility settings"
      >
        <Accessibility className="w-6 h-6" />
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="border-2 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Accessibility</h3>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              aria-label="Close accessibility settings"
            >
              ×
            </Button>
          </div>

          <div className="space-y-3">
            {/* Visual Settings */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Visual
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">High Contrast</span>
                  <Button
                    onClick={() => updateSetting("highContrast", !settings.highContrast)}
                    variant={settings.highContrast ? "default" : "outline"}
                    size="sm"
                    className="h-6 px-2"
                  >
                    <Contrast className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Large Text</span>
                  <Button
                    onClick={() => updateSetting("largeText", !settings.largeText)}
                    variant={settings.largeText ? "default" : "outline"}
                    size="sm"
                    className="h-6 px-2"
                  >
                    <Type className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Font Size</span>
                  <div className="flex items-center gap-1">
                    <Button
                      onClick={() => updateSetting("fontSize", Math.max(12, settings.fontSize - 2))}
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      -
                    </Button>
                    <span className="text-xs w-8 text-center">{settings.fontSize}</span>
                    <Button
                      onClick={() => updateSetting("fontSize", Math.min(24, settings.fontSize + 2))}
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Motion Settings */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <MousePointer className="w-4 h-4" />
                Motion
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-sm">Reduce Motion</span>
                <Button
                  onClick={() => updateSetting("reducedMotion", !settings.reducedMotion)}
                  variant={settings.reducedMotion ? "default" : "outline"}
                  size="sm"
                  className="h-6 px-2"
                >
                  {settings.reducedMotion ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </Button>
              </div>
            </div>

            {/* Audio Settings */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Audio
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-sm">Audio Descriptions</span>
                <Button
                  onClick={() => updateSetting("audioDescriptions", !settings.audioDescriptions)}
                  variant={settings.audioDescriptions ? "default" : "outline"}
                  size="sm"
                  className="h-6 px-2"
                >
                  {settings.audioDescriptions ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                </Button>
              </div>
            </div>

            {/* Navigation Settings */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Keyboard className="w-4 h-4" />
                Navigation
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-sm">Keyboard Navigation</span>
                <Badge variant={settings.keyboardNavigation ? "default" : "secondary"}>
                  {settings.keyboardNavigation ? "On" : "Off"}
                </Badge>
              </div>
            </div>

            {/* Reset Button */}
            <div className="pt-2 border-t">
              <Button
                onClick={resetSettings}
                variant="outline"
                size="sm"
                className="w-full flex items-center gap-2 bg-transparent"
              >
                <Settings className="w-3 h-3" />
                Reset to Default
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Screen reader announcements
export function ScreenReaderAnnouncement({ message }: { message: string }) {
  return (
    <div className="sr-only" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  )
}

// Skip to content link
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
    >
      Skip to main content
    </a>
  )
}
