// app/api/generate-questions/route.ts
import { NextResponse } from "next/server";
import { generateQuestions } from "@/lib/ai";

export const runtime = "nodejs"; // ensure Node runtime for fetch/env

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const passage = String(body?.passage ?? "").trim();
    const numQuestions = Number(body?.numQuestions ?? 5);

    if (!passage) {
      return NextResponse.json({ error: "passage is required" }, { status: 400 });
    }

    const n = Number.isFinite(numQuestions) ? Math.min(Math.max(numQuestions, 1), 10) : 5;

    const result = await generateQuestions(passage, n);

    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: "Invalid request", debug: String(e?.message ?? e) }, 
    { status: 400 });
  }
}
