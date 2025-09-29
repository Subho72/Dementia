"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BackButton({ className = "" }: { className?: string }) {
  const router = useRouter()
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => router.back()}
      className={`btn-secondary bg-transparent ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back
    </Button>
  )
}
