// lib/ai.ts
import { generateMockQuestions, type MCQ } from "./mock";

export type AIProvider = "mock" | "openai";

export async function generateQuestions(passage: string, n: number): Promise<{ questions: MCQ[]; source: AIProvider; debug?: any }> {
  const provider = (process.env.AI_PROVIDER as AIProvider) ?? "mock";

  if (provider === "mock") {
    return { questions: generateMockQuestions(passage, n), source: "mock" };
  }

// Note:
// External AI providers(OpenAI) may be unavailable in certain environments
// (e.g. restricted networks, CI pipelines, or offline development).
// To ensure reliability and a smooth reviewer experience, the system
// is designed with a deterministic mock fallback.
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

    const prompt = `
You are an English teacher. Generate ${n} high-quality multiple-choice comprehension questions for the given passage.
Return STRICT JSON only, matching this TypeScript type:
{
  "questions": Array<{
    "id": string,
    "question": string,
    "options": [string,string,string,string],
    "answerIndex": 0|1|2|3,
    "explanation": string
  }>
}
Passage:
"""${passage}"""
`.trim();

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: prompt,
        temperature: 0.2,
      }),
    });

    if (!r.ok) {
      const text = await r.text();
      throw new Error(`OpenAI HTTP ${r.status}: ${text}`);
    }

    const data = await r.json();

    // Responses API returns structured output in different shapes depending on settings.
    // We'll try to pull a JSON string from common locations.
    const possibleText =
      data?.output_text ??
      data?.output?.[0]?.content?.[0]?.text ??
      data?.output?.[0]?.content?.[0]?.value ??
      "";

    const parsed = JSON.parse(possibleText);
    const questions = parsed?.questions as MCQ[];

    if (!Array.isArray(questions) || questions.length === 0) throw new Error("Invalid AI response shape");

    return { questions, source: "openai" };
  } catch (err: any) {
    // Graceful fallback for China/VPN/CI environments
    return {
      questions: generateMockQuestions(passage, n),
      source: "mock",
      debug: { openai_error: String(err?.message ?? err) },
    };
  }
}
