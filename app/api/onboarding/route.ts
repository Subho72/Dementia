import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

interface OnboardingProfile {
  id: string
  user_name: string | null
  user_phone: string | null
  details: any
  created_at: string
}

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("onboarding_profiles")
      .select("*")
      .order("created_at", { ascending: false })
    if (error) throw error
    return NextResponse.json({ data }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to load" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<OnboardingProfile> & {
      details?: Record<string, any>
    }
    const now = new Date().toISOString()

    const row = {
      user_name: body.user_name ?? null,
      user_phone: body.user_phone ?? null,
      details: body.details ?? {},
      created_at: now,
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase.from("onboarding_profiles").insert(row).select("*").single()
    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to parse/insert" }, { status: 400 })
  }
}
