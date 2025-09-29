"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CognitiveLogo } from "@/components/cognitive-logo"
import { User, Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication process
    setTimeout(() => {
      if (isLogin) {
        // Check if user exists in localStorage
        const users = JSON.parse(localStorage.getItem("cognitiveUsers") || "[]")
        const user = users.find((u: any) => u.email === formData.email && u.password === formData.password)

        if (user) {
          localStorage.setItem("cognitiveCurrentUser", JSON.stringify(user))
          router.push("/dashboard")
        } else {
          alert("Invalid credentials. Please check your email and password.")
        }
      } else {
        // Sign up process
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match!")
          setIsLoading(false)
          return
        }

        const users = JSON.parse(localStorage.getItem("cognitiveUsers") || "[]")
        const existingUser = users.find((u: any) => u.email === formData.email)

        if (existingUser) {
          alert("User already exists with this email!")
          setIsLoading(false)
          return
        }

        const newUser = {
          id: Date.now().toString(),
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          createdAt: new Date().toISOString(),
          assessments: [],
        }

        users.push(newUser)
        localStorage.setItem("cognitiveUsers", JSON.stringify(users))
        localStorage.setItem("cognitiveCurrentUser", JSON.stringify(newUser))
        router.push("/dashboard")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <CognitiveLogo className="w-12 h-12 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">CogNitive Assessment</h1>
              <p className="text-sm text-muted-foreground">Clinical-Grade Cognitive Screening</p>
            </div>
          </Link>
        </div>

        <Card className="medical-card">
          <CardHeader className="text-center">
            <div className="w-16 h-16 medical-gradient-1 rounded-full flex items-center justify-center mx-auto mb-4">
              {isLogin ? <Lock className="w-8 h-8 text-white" /> : <User className="w-8 h-8 text-white" />}
            </div>
            <CardTitle className="text-2xl">{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
            <CardDescription>
              {isLogin
                ? "Sign in to access your cognitive assessment dashboard"
                : "Join us to start your cognitive health journey"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required={!isLogin}
                    className="h-12"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-12 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="h-12 pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required={!isLogin}
                      className="h-12 pl-10"
                    />
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full h-12 btn-primary" disabled={isLoading}>
                {isLoading ? (
                  "Processing..."
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline ml-1">
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Contact our support team at{" "}
            <Link href="mailto:support@cognitive.app" className="text-primary hover:underline">
              support@cognitive.app
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
