"use client"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CognitiveLogo } from "@/components/cognitive-logo"
import {
  Brain,
  Shield,
  Globe,
  Users,
  Play,
  ArrowRight,
  Clock,
  MessageSquare,
  Zap,
  Star,
  Award,
  User,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const currentUser = localStorage.getItem("cognitiveCurrentUser")
    setIsLoggedIn(!!currentUser)
  }, [])

  return (
    <div className="min-h-screen hero-gradient">
      {/* Header */}
      <header className="border-b border-border/20 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <CognitiveLogo className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">CogNitive Assessment</h1>
              <p className="text-xs text-muted-foreground">Clinical-Grade Cognitive Screening</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              How It Works
            </a>
            <a
              href="#about"
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              About
            </a>
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="btn-secondary bg-transparent">
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button variant="outline" size="sm" className="btn-secondary bg-transparent">
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="mb-12">
            <div className="w-20 h-20 medical-gradient-1 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <CognitiveLogo className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Early Detection for
              <span className="block text-primary">Better Outcomes</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-4xl mx-auto leading-relaxed">
              Professional-grade cognitive screening that helps identify early signs of cognitive decline. Clinically
              validated, accessible, and designed for healthcare professionals and individuals alike.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 py-4 btn-primary">
                  <Play className="w-5 h-5 mr-2" />
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button size="lg" className="text-lg px-8 py-4 btn-primary">
                  <Play className="w-5 h-5 mr-2" />
                  Start Assessment Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
            <Link href="/learn-more">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 btn-secondary bg-transparent">
                <MessageSquare className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
            <div className="flex items-center gap-2 trust-indicator px-4 py-2 rounded-full">
              <Shield className="w-4 h-4 text-primary" />
              <span className="font-medium">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 trust-indicator px-4 py-2 rounded-full">
              <Award className="w-4 h-4 text-accent" />
              <span className="font-medium">Clinically Validated</span>
            </div>
            <div className="flex items-center gap-2 trust-indicator px-4 py-2 rounded-full">
              <Globe className="w-4 h-4 text-primary" />
              <span className="font-medium">Multi-language Support</span>
            </div>
            <div className="flex items-center gap-2 trust-indicator px-4 py-2 rounded-full">
              <Users className="w-4 h-4 text-accent" />
              <span className="font-medium">Used by 10,000+ Patients</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Comprehensive Cognitive Assessment</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our evidence-based assessment evaluates key cognitive domains through engaging, scientifically validated
              tasks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="medical-card">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 medical-gradient-1 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg mb-2">Memory & Recall</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Story-based memory assessment analyzing information retention and semantic coherence.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="medical-card">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 medical-gradient-2 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg mb-2">Visuospatial Function</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Digital clock drawing test evaluating spatial awareness and executive function.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="medical-card">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 medical-gradient-3 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg mb-2">Verbal Fluency</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Category-based word generation measuring executive function and language processing.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="medical-card">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 trust-gradient rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg mb-2">Processing Speed</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Trail-making test assessing attention, cognitive flexibility, and processing speed.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Simple, Professional Process</h2>
            <p className="text-lg text-muted-foreground">
              Complete your assessment in 15-20 minutes with immediate, actionable results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 medical-gradient-1 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Account</h3>
              <p className="text-muted-foreground leading-relaxed">
                Sign up for a secure account to track your cognitive health progress over time.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 medical-gradient-2 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Complete Tasks</h3>
              <p className="text-muted-foreground leading-relaxed">
                Engage with four evidence-based cognitive assessments designed for clinical accuracy.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 medical-gradient-3 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
              <p className="text-muted-foreground leading-relaxed">
                View your results and track cognitive health trends through your personal dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Trusted by Healthcare Professionals</h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of patients and healthcare providers using CogNitive for early detection.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="medical-card">
              <CardHeader>
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  "CogNitive has revolutionized our screening process. The comprehensive reports help us make better
                  clinical decisions."
                </CardDescription>
                <div className="mt-4">
                  <p className="font-semibold text-sm">Dr. Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground">Neurologist, Mayo Clinic</p>
                </div>
              </CardHeader>
            </Card>

            <Card className="medical-card">
              <CardHeader>
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  "The early detection capabilities have been invaluable for my patients. Easy to use and clinically
                  accurate."
                </CardDescription>
                <div className="mt-4">
                  <p className="font-semibold text-sm">Dr. Michael Chen</p>
                  <p className="text-xs text-muted-foreground">Geriatrician, Johns Hopkins</p>
                </div>
              </CardHeader>
            </Card>

            <Card className="medical-card">
              <CardHeader>
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  "As a family member, this tool gave us peace of mind and helped us seek appropriate care early."
                </CardDescription>
                <div className="mt-4">
                  <p className="font-semibold text-sm">Maria Rodriguez</p>
                  <p className="text-xs text-muted-foreground">Patient Family Member</p>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-12 px-4 bg-card/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <CognitiveLogo className="w-8 h-8 text-primary" />
              <div>
                <h3 className="text-lg font-bold text-foreground">CogNitive Assessment</h3>
                <p className="text-sm text-muted-foreground">Clinical-Grade Cognitive Screening</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary transition-colors duration-300">
                Contact Support
              </a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border/20 text-center text-sm text-muted-foreground">
            <p>
              © 2025 CogNitive Assessment. This tool is for screening purposes only and does not provide medical
              diagnosis.
            </p>
            <p className="mt-2">Always consult with a qualified healthcare professional for medical advice.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
