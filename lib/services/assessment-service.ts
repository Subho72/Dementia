export interface AssessmentResult {
  id?: string
  user_name: string
  user_phone: string
  user_age: string
  user_gender: string
  assessment_type: string
  results: any
  score: number
  risk_level: "low" | "moderate" | "high"
  completed_at?: string
  created_at?: string
}

export interface UserDetails {
  fullName: string
  age: string
  gender: string
  phone: string
  language: string
  education: string
  primaryLanguage: string
}

function normalizeResultsKeys(r: any) {
  if (!r || typeof r !== "object") return r
  const n = { ...r }
  if (r.memoryrecall && !r.memoryRecall) n.memoryRecall = r.memoryrecall
  if (r.verbalfluency && !r.verbalFluency) n.verbalFluency = r.verbalfluency
  if (r.processingspeed && !r.processingSpeed) n.processingSpeed = r.processingspeed
  // visuospatial already matches expected key
  return n
}

export async function saveAssessmentResult(
  result: Omit<AssessmentResult, "user_name" | "user_phone" | "user_age" | "user_gender">,
) {
  console.log("[v0] Saving assessment result to localStorage")

  // Get user details from onboarding data
  const onboardingData = localStorage.getItem("cognitiveOnboarding")
  const userDetails: UserDetails = onboardingData ? JSON.parse(onboardingData) : {}

  const localResults = JSON.parse(localStorage.getItem("assessmentResults") || "[]")
  const newResult: AssessmentResult = {
    id: Date.now().toString(),
    ...result,
    user_name: userDetails.fullName || "Anonymous",
    user_phone: userDetails.phone || "",
    user_age: userDetails.age || "",
    user_gender: userDetails.gender || "",
    completed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  }

  localResults.push(newResult)
  localStorage.setItem("assessmentResults", JSON.stringify(localResults))

  console.log(`[v0] Assessment complete for ${newResult.user_name}`)
  console.log(`[v0] Report would be sent to phone: ${newResult.user_phone}`)
  console.log(`[v0] Risk level: ${newResult.risk_level}, Score: ${newResult.score}`)

  return newResult
}

export async function getUserAssessments(): Promise<AssessmentResult[]> {
  console.log("[v0] Loading assessment results from localStorage")
  const localResults = JSON.parse(localStorage.getItem("assessmentResults") || "[]")
  const sorted: AssessmentResult[] = (localResults as AssessmentResult[]).sort((a, b) => {
    const ad = new Date(a.completed_at || a.created_at || 0).getTime()
    const bd = new Date(b.completed_at || b.created_at || 0).getTime()
    return bd - ad
  })
  return sorted.map((res) => ({ ...res, results: normalizeResultsKeys(res.results) }))
}

export function getUserDetails(): UserDetails | null {
  const onboardingData = localStorage.getItem("cognitiveOnboarding")
  return onboardingData ? JSON.parse(onboardingData) : null
}

export function sendAssessmentReport(result: AssessmentResult) {
  console.log("[v0] Simulating SMS report delivery...")
  console.log(`[v0] Sending to: ${result.user_phone}`)
  console.log(`[v0] Message: Hello ${result.user_name}, your cognitive assessment is complete.`)
  console.log(`[v0] Your score: ${result.score}/100`)
  console.log(`[v0] Risk level: ${result.risk_level.toUpperCase()}`)

  if (result.risk_level === "high") {
    console.log(`[v0] IMPORTANT: High risk detected. Please consult with a healthcare professional.`)
  } else if (result.risk_level === "moderate") {
    console.log(`[v0] Moderate risk detected. Consider discussing with your doctor.`)
  } else {
    console.log(`[v0] Low risk detected. Continue monitoring your cognitive health.`)
  }

  // In a real implementation, this would integrate with an SMS service
  alert(
    `Assessment report sent to ${result.user_phone}!\n\nScore: ${result.score}/100\nRisk Level: ${result.risk_level.toUpperCase()}\n\nCheck your phone for the detailed report.`,
  )
}

export async function migrateLocalStorageData() {
  console.log("[v0] No migration needed - using localStorage only")
  return Promise.resolve()
}
