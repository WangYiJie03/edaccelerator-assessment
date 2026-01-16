// lib/mock.ts
export type MCQ = {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

function pick<T>(arr: T[], i: number) {
  return arr[i % arr.length];
}

export function generateMockQuestions(passage: string, n: number): MCQ[] {
  const p = passage.trim();
  const lower = p.toLowerCase();

  // very small heuristics to look “AI-ish” but deterministic and fast
  const hasBecause = lower.includes("because");
  const hasWhen = lower.includes("when") || lower.includes("after") || lower.includes("before");
  const hasWhere = lower.includes("at ") || lower.includes("in ") || lower.includes("to ");
  const hasWho = lower.includes(" he ") || lower.includes(" she ") || lower.includes(" they ") || lower.includes(" tom ") || lower.includes(" mary ");

  const templates: Omit<MCQ, "id">[] = [
    {
      question: "What is the main idea of the passage?",
      options: ["It describes a random event.", "It explains what happened and why.", "It lists unrelated facts.", "It gives instructions."],
      answerIndex: 1,
      explanation: "The passage focuses on describing events and their reasons."
    },
    {
      question: "Which detail is explicitly stated in the passage?",
      options: ["A detail not mentioned.", "A detail only implied.", "A detail directly stated.", "A detail contradicted by the passage."],
      answerIndex: 2,
      explanation: "Choose the option that is directly supported by the text."
    },
    {
      question: hasBecause ? "Why did the event happen?" : "What is a likely reason based on the passage?",
      options: [
        "Because of a reason not mentioned.",
        "Because it was convenient or beneficial.",
        "Because someone forced it.",
        "Because it was an accident."
      ],
      answerIndex: 1,
      explanation: hasBecause
        ? "The passage includes a 'because' clause indicating the reason."
        : "The best answer aligns with what the passage suggests."
    },
    {
      question: hasWhen ? "When did the event take place?" : "What happened first in the passage?",
      options: ["At the end.", "In the middle.", "At the beginning.", "Not enough information."],
      answerIndex: hasWhen ? 3 : 2,
      explanation: hasWhen
        ? "If the passage does not give a clear time, choose 'Not enough information'."
        : "The first event is described at the start of the passage."
    },
    {
      question: hasWhere ? "Where did the event happen?" : "Which setting best matches the passage?",
      options: ["A market/store.", "A classroom.", "A hospital.", "A beach."],
      answerIndex: 0,
      explanation: "Pick the setting most consistent with the passage context."
    },
    {
      question: hasWho ? "Who is the passage mainly about?" : "Who is most likely the main subject?",
      options: ["The narrator.", "A main character mentioned.", "A stranger.", "No one."],
      answerIndex: 1,
      explanation: "The main subject is the person/character described in the passage."
    }
  ];

  const out: MCQ[] = [];
  for (let i = 0; i < Math.max(1, n); i++) {
    const t = pick(templates, i);
    out.push({ id: `q${i + 1}`, ...t });
  }

  return out;
}
