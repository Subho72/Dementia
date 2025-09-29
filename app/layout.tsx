import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AccessibilityPanel, SkipToContent } from "@/components/accessibility-features"
import { ErrorBoundary } from "@/components/error-boundary"
import "./globals.css"
import { LanguageInit } from "@/components/language-init"

export const metadata: Metadata = {
  title: "CogNitive - Early Dementia Detection",
  description:
    "AI-powered cognitive screening tool for early dementia detection through speech and behavioral analysis",
  generator: "CogNitive App",
  keywords: ["dementia", "cognitive assessment", "AI screening", "healthcare", "accessibility"],
  authors: [{ name: "CogNitive Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <SkipToContent />
        <ErrorBoundary />
        <LanguageInit />
        <Suspense fallback={null}>
          <main id="main-content">{children}</main>
        </Suspense>
        <AccessibilityPanel />
        <Analytics />
      </body>
    </html>
  )
}
