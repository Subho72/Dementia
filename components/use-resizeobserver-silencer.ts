"use client"

import { useEffect } from "react"

export function useSilenceResizeObserverErrors() {
  useEffect(() => {
    const filterROError = (event: any) => {
      try {
        const msg = (event && event.message) || (event && event.reason && event.reason.message) || ""
        if (
          typeof msg === "string" &&
          (msg.includes("ResizeObserver loop completed with undelivered notifications") ||
            msg.includes("ResizeObserver"))
        ) {
          event.preventDefault?.()
          event.stopPropagation?.()
          event.stopImmediatePropagation?.()
          return false
        }
      } catch {
        // ignore
      }
      return undefined
    }

    window.addEventListener("error", filterROError, true)
    window.addEventListener("unhandledrejection", filterROError, true)

    return () => {
      window.removeEventListener("error", filterROError, true)
      window.removeEventListener("unhandledrejection", filterROError, true)
    }
  }, [])
}
