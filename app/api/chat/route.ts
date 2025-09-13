import { streamText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(req: Request) {
  console.log("[v0] API route called")

  try {
    const { messages } = await req.json()
    console.log("[v0] Messages received:", messages)

    const result = await streamText({
      model: groq("llama-3.3-70b-versatile"),
      system:
        'You are "Jimmy AI - The AI Proficiency Professor". Your goal is to help users understand and improve their AI skills. Explain everything in simple, everyday language that anyone can understand - avoid technical jargon and use relatable examples. Think of yourself as a friendly teacher talking to someone who might be completely new to AI. Keep responses concise (2-3 sentences) but make sure they\'re crystal clear. When assessing proficiency, give practical, actionable advice that feels encouraging rather than overwhelming.',
      messages,
    })

    console.log("[v0] Groq result created, returning stream")
    return result.toTextStreamResponse()
  } catch (error) {
    console.error("[v0] API route error:", error)
    return new Response(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
