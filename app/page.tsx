"use client";

import { useMemo, useState } from "react";
import type { Passage } from "@/lib/passages";
import { PASSAGES } from "@/lib/passages";

type MCQ = {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

type ApiResponse = {
  questions: MCQ[];
  source: "mock" | "openai";
  debug?: any;
};

type Status = "idle" | "loading" | "ready" | "finished" | "error";

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700"
      aria-label="Loading"
    />
  );
}

export default function HomePage() {
  const [selectedPassageId, setSelectedPassageId] = useState(PASSAGES[0]?.id ?? "");
  const passage: Passage | undefined = useMemo(
    () => PASSAGES.find((p) => p.id === selectedPassageId),
    [selectedPassageId]
  );

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [source, setSource] = useState<"mock" | "openai">("mock");

  const total = questions.length;
  const answeredCount = Object.keys(answers).length;

  const score = useMemo(() => {
    if (!submitted) return 0;
    let correct = 0;
    for (const q of questions) {
      if (answers[q.id] === q.answerIndex) correct++;
    }
    return correct;
  }, [submitted, questions, answers]);

  const isBusy = status === "loading";
  const canSubmit = status === "ready" && total > 0 && answeredCount === total;

  async function generate() {
    if (!passage?.text) return;

    setStatus("loading");
    setErrorMsg("");
    setSubmitted(false);
    setAnswers({});
    setQuestions([]);

    // loading for few seconds than instantly show results
    const minLoadingMs = 650;
    const start = Date.now();

    try {
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passage: passage.text, numQuestions: 5 }),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(`API error ${res.status}: ${t}`);
      }

      const data = (await res.json()) as ApiResponse;
      if (!Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error("No questions returned from API.");
      }

      const elapsed = Date.now() - start;
      if (elapsed < minLoadingMs) {
        await new Promise((r) => setTimeout(r, minLoadingMs - elapsed));
      }

      setQuestions(data.questions);
      setSource(data.source);
      setStatus("ready");
    } catch (e: any) {
      setErrorMsg(String(e?.message ?? e));
      setStatus("error");
    }
  }

  function choose(qId: string, optionIndex: number) {
    if (submitted || isBusy) return;
    setAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
  }

  function submit() {
    if (!canSubmit) return;
    setSubmitted(true);
    setStatus("finished");
  }

  function reset() {
    setStatus("idle");
    setErrorMsg("");
    setSubmitted(false);
    setQuestions([]);
    setAnswers({});
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Reading Comprehension Practice
          </h1>
          <p className="mt-2 text-slate-600">
            Read a passage, generate AI-style questions, answer them, and get a final score.
          </p>
        </div>

        {/* Layout */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left: Passage */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm text-slate-500">Passage</div>
                <div className="text-xl font-semibold">{passage?.title ?? "Select a passage"}</div>
              </div>

              <select
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm disabled:opacity-60"
                value={selectedPassageId}
                disabled={isBusy}
                onChange={(e) => {
                  setSelectedPassageId(e.target.value);
                  reset();
                }}
              >
                {PASSAGES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 max-h-[460px] overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-800 whitespace-pre-line">
              {passage?.text}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={generate}
                disabled={isBusy}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
              >
                {isBusy ? (
                  <>
                    <Spinner />
                    Generating…
                  </>
                ) : (
                  "Generate Questions"
                )}
              </button>

              <button
                onClick={reset}
                disabled={isBusy}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm hover:bg-slate-50 disabled:opacity-60"
              >
                Reset
              </button>

              <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
                <span className="rounded-full border border-slate-200 bg-white px-2 py-1">
                  Source: {source}
                </span>
                {status === "ready" || status === "finished" ? (
                  <span className="rounded-full border border-slate-200 bg-white px-2 py-1">
                    Answered: {answeredCount}/{total}
                  </span>
                ) : null}
              </div>
            </div>

            {/* Prominent Loading Banner */}
            {status === "loading" ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                <div className="flex items-center gap-2 font-medium">
                  <Spinner />
                  Generating questions…
                </div>
                <div className="mt-1 text-slate-500">
                  (Mock is instant; OpenAI may take longer.)
                </div>
              </div>
            ) : null}

            {status === "error" ? (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                <div className="font-semibold">Something went wrong</div>
                <div className="mt-1 break-words text-red-700">{errorMsg}</div>
              </div>
            ) : null}
          </div>

          {/* Right: Questions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">Questions</div>
                <div className="text-xl font-semibold">AI-generated MCQs</div>
              </div>
            </div>

            {status === "idle" ? (
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                Click <span className="font-semibold text-slate-900">Generate Questions</span> to start.
              </div>
            ) : null}

            {(status === "ready" || status === "finished") && questions.length > 0 ? (
              <div className="mt-4 space-y-4">
                {questions.map((q, idx) => {
                  const chosen = answers[q.id];
                  const isCorrect = submitted && chosen === q.answerIndex;
                  const isWrong = submitted && chosen !== undefined && chosen !== q.answerIndex;

                  return (
                    <div key={q.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="text-sm text-slate-500">Question {idx + 1}</div>
                      <div className="mt-1 font-semibold text-slate-900">{q.question}</div>

                      <div className="mt-3 grid gap-2">
                        {q.options.map((opt, oi) => {
                          const selected = chosen === oi;

                          let cls =
                            "rounded-xl border px-3 py-2 text-sm text-slate-900 shadow-sm hover:bg-slate-50 border-slate-200";
                          if (!submitted && selected)
                            cls = "rounded-xl border px-3 py-2 text-sm border-slate-900 bg-slate-900 text-white shadow-sm";
                          if (submitted && oi === q.answerIndex)
                            cls = "rounded-xl border px-3 py-2 text-sm border-emerald-200 bg-emerald-50 text-emerald-900";
                          if (submitted && selected && oi !== q.answerIndex)
                            cls = "rounded-xl border px-3 py-2 text-sm border-red-200 bg-red-50 text-red-900";

                          return (
                            <button
                              key={oi}
                              onClick={() => choose(q.id, oi)}
                              className={cls}
                              disabled={submitted || isBusy}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {submitted ? (
                        <div className="mt-3 text-sm">
                          <div className={isCorrect ? "text-emerald-700 font-semibold" : isWrong ? "text-red-700 font-semibold" : "text-slate-600"}>
                            {isCorrect ? "Correct ✅" : isWrong ? "Incorrect ❌" : "Not answered"}
                          </div>
                          <div className="mt-1 text-slate-600">{q.explanation}</div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
                {/* Bottom Submit (better UX) */}
                {status === "ready" && !submitted ? (
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm text-slate-600">
                      {canSubmit
                        ? "Ready to submit?"
                        : `Answer all questions to submit (${answeredCount}/${total}).`}
                    </div>

                    <button
                      onClick={submit}
                      disabled={!canSubmit}
                      className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
                      title={!canSubmit ? "Answer all questions to submit" : "Submit"}
                    >
                      Submit
                    </button>
                  </div>
                ) : null}
                {/* Final score */}
                {submitted ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Final Score</div>
                    <div className="mt-1 text-2xl font-semibold text-slate-900">
                      {score} / {total}
                    </div>
                    <div className="mt-2 text-sm text-slate-700">
                      You got {Math.round((score / Math.max(1, total)) * 100)}% correct.
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setStatus("ready");
                          setAnswers({});
                        }}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm hover:bg-slate-50"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={reset}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm hover:bg-slate-50"
                      >
                        Choose Another Passage
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-8 text-xs text-slate-500">
          MVP focus: reading passage → AI questions → answer tracking → final score → responsive layout.
        </div>
      </div>
    </div>
  );
}
