"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CognitiveLogo } from "@/components/cognitive-logo"
import {
  Brain,
  ArrowLeft,
  BookOpen,
  Shield,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Heart,
  Activity,
  Lightbulb,
  Target,
  Award,
  Stethoscope,
} from "lucide-react"
import Link from "next/link"

export default function LearnMorePage() {
  return (
    <div className="min-h-screen hero-gradient">
      {/* Header */}
      <header className="border-b border-border/20 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <CognitiveLogo className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">CogNitive Assessment</h1>
              <p className="text-xs text-muted-foreground">Learn About Cognitive Health</p>
            </div>
          </Link>
          <Link href="/">
            <Button variant="outline" size="sm" className="btn-secondary bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 medical-gradient-1 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Understanding Cognitive Health</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Learn about cognitive assessments, early detection, and how CogNitive can help you monitor your brain
            health.
          </p>
        </div>

        {/* What is Cognitive Assessment */}
        <section className="mb-16">
          <Card className="medical-card">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 medical-gradient-1 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">What is Cognitive Assessment?</CardTitle>
                  <CardDescription>Understanding the science behind cognitive screening</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Cognitive assessment is a systematic evaluation of mental processes including memory, attention,
                language, problem-solving, and executive function. These assessments help identify changes in cognitive
                abilities that may indicate early signs of dementia or other neurological conditions.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Key Cognitive Domains
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Memory and Learning
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Attention and Concentration
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Language and Communication
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Visuospatial Processing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Executive Function
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-accent" />
                    Why It Matters
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Early detection of cognitive changes
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Baseline establishment for monitoring
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Treatment planning and intervention
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Peace of mind and proactive care
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Our Assessment Tasks */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Assessment Tasks</h2>
            <p className="text-lg text-muted-foreground">
              CogNitive uses four scientifically validated tasks to evaluate different aspects of cognitive function.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="medical-card">
              <CardHeader>
                <div className="w-12 h-12 medical-gradient-1 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Memory & Recall Task</CardTitle>
                <CardDescription>Story-based memory assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Participants listen to a short story and then retell it, testing episodic memory, attention, and
                  language comprehension.
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-foreground">Evaluates:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Short-term memory retention</li>
                    <li>• Semantic processing</li>
                    <li>• Narrative coherence</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="medical-card">
              <CardHeader>
                <div className="w-12 h-12 medical-gradient-2 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Clock Drawing Test</CardTitle>
                <CardDescription>Visuospatial and executive function</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  A classic neuropsychological test where participants draw a clock face showing a specific time,
                  assessing multiple cognitive domains.
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-foreground">Evaluates:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Visuospatial skills</li>
                    <li>• Executive planning</li>
                    <li>• Working memory</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="medical-card">
              <CardHeader>
                <div className="w-12 h-12 medical-gradient-3 rounded-lg flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Verbal Fluency Task</CardTitle>
                <CardDescription>Language and executive function</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Participants generate words from specific categories within time limits, testing language retrieval
                  and cognitive flexibility.
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-foreground">Evaluates:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Language processing</li>
                    <li>• Cognitive flexibility</li>
                    <li>• Processing speed</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="medical-card">
              <CardHeader>
                <div className="w-12 h-12 trust-gradient rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Processing Speed Task</CardTitle>
                <CardDescription>Attention and cognitive speed</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Trail-making style tasks that measure how quickly and accurately participants can process and respond
                  to visual information.
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-foreground">Evaluates:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Processing speed</li>
                    <li>• Visual attention</li>
                    <li>• Task switching</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Early Detection Benefits */}
        <section className="mb-16">
          <Card className="medical-card">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 medical-gradient-2 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">The Importance of Early Detection</CardTitle>
                  <CardDescription>Why cognitive screening matters for your health</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Early detection of cognitive changes can significantly impact treatment outcomes and quality of life.
                When cognitive decline is identified early, there are more opportunities for intervention, lifestyle
                modifications, and planning.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Better Treatment</h3>
                  <p className="text-sm text-muted-foreground">
                    Early intervention can slow progression and improve outcomes
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Family Planning</h3>
                  <p className="text-sm text-muted-foreground">More time to plan care and make important decisions</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Peace of Mind</h3>
                  <p className="text-sm text-muted-foreground">
                    Regular monitoring provides reassurance and early alerts
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Security and Privacy */}
        <section className="mb-16">
          <Card className="medical-card">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 medical-gradient-3 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Security & Privacy</CardTitle>
                  <CardDescription>Your data is protected with enterprise-grade security</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Data Protection
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      HIPAA compliant infrastructure
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      End-to-end encryption
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Secure data storage
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Regular security audits
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent" />
                    Privacy Controls
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      You control your data
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      No data sharing without consent
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Right to data deletion
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Transparent privacy policy
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Important Disclaimer */}
        <section className="mb-16">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <CardTitle className="text-xl text-red-800">Important Medical Disclaimer</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-red-700">
                <p>
                  <strong>CogNitive is a screening tool, not a diagnostic instrument.</strong> Our assessments are
                  designed to identify potential cognitive concerns that warrant further evaluation by qualified
                  healthcare professionals.
                </p>
                <p>
                  Results from CogNitive should never be used as a substitute for professional medical advice,
                  diagnosis, or treatment. If you have concerns about your cognitive health or receive concerning
                  results, please consult with a qualified healthcare provider immediately.
                </p>
                <p>
                  Always seek the advice of your physician or other qualified health provider with any questions you may
                  have regarding a medical condition.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="medical-card">
            <CardContent className="p-12">
              <div className="w-16 h-16 medical-gradient-1 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Start Your Assessment?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Take the first step towards proactive cognitive health monitoring with our clinically validated
                assessment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth">
                  <Button size="lg" className="btn-primary px-8 py-4 text-lg">
                    <Brain className="w-5 h-5 mr-2" />
                    Start Assessment
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" size="lg" className="btn-secondary bg-transparent px-8 py-4 text-lg">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
