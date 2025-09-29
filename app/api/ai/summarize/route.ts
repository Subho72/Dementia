import { NextResponse, type NextRequest } from "next/server"
import { generateText } from "ai"

export async function POST(req: NextRequest) {
  try {
    const { results, demographics } = (await req.json()) ?? {}

    const prompt = `
You are a clinical assistant generating a short, patient-friendly cognitive assessment summary.
Input JSON:
results:
${JSON.stringify(results ?? {}, null, 2)}
demographics:
${JSON.stringify(demographics ?? {}, null, 2)}

Write:
1) A 3-5 sentence summary of performance.
2) 3-5 bullet recommendations (actionable, general wellness; no diagnosis).
3) A one-line risk interpretation based on scores.

Return plain text only.
`.trim()

    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt,
    })

    return NextResponse.json({ data: { summary: text } }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to generate" }, { status: 500 })
  }
}
