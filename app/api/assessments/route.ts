import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

type RiskLevel = "low" | "moderate" | "high"

interface AssessmentResult {
  id: string
  user_name: string
  user_phone: string
  user_age: string
  user_gender: string
  assessment_type: string
  results: any
  score: number
  risk_level: RiskLevel
  completed_at?: string
  created_at?: string
}

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.from("assessments").select("*").order("created_at", { ascending: false })
    if (error) throw error
    return NextResponse.json({ data }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to load" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<AssessmentResult>

    // Minimal validation
    if (
      typeof body?.assessment_type !== "string" ||
      typeof body?.score !== "number" ||
      (body?.risk_level !== "low" && body?.risk_level !== "moderate" && body?.risk_level !== "high")
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const now = new Date().toISOString()
    // Let DB assign UUID; ignore body.id if provided (it may not be a valid UUID)
    const row = {
      user_name: body.user_name || "Anonymous",
      user_phone: body.user_phone || "",
      user_age: body.user_age || "",
      user_gender: body.user_gender || "",
      assessment_type: body.assessment_type,
      results: body.results ?? {},
      score: body.score,
      risk_level: body.risk_level,
      completed_at: body.completed_at || now,
      created_at: body.created_at || now,
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase.from("assessments").insert(row).select("*").single()
    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Failed to parse/insert" }, { status: 400 })
  }
}
