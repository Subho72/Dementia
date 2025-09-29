"use client"

import { useEffect } from "react"

export function ErrorBoundary() {
  useEffect(() => {
    const originalError = console.error
    console.error = (...args) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("ResizeObserver loop completed with undelivered notifications")
      ) {
        return
      }
      originalError(...args)
    }

    // Handle uncaught errors
    const handleError = (event: ErrorEvent) => {
      if (event.message && event.message.includes("ResizeObserver loop completed with undelivered notifications")) {
        event.preventDefault()
        return
      }
    }

    window.addEventListener("error", handleError)

    return () => {
      console.error = originalError
      window.removeEventListener("error", handleError)
    }
  }, [])

  return null
}
