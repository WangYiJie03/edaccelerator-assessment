# EdAccelerator – AI Reading Comprehension Interface

## Live Demo

👉 **Production URL**  
https://edaccelerator-assessment-psi.vercel.app

(Responsive and tested on both desktop and mobile)

---

## Overview

This project is a take-home technical assessment for the **Junior Software Engineer** role at **EdAccelerator**.

The goal is to design and build a **next-generation reading comprehension interface** that improves student engagement, encourages genuine understanding, and demonstrates thoughtful AI integration.

The application allows students to:

1. Read a passage  
2. Generate AI-assisted comprehension questions  
3. Answer questions with immediate feedback  
4. Review explanations and receive a final score  

The system is intentionally designed to be **reliable, review-friendly, and production-ready**, even in restricted or offline environments.

---

## Design Goals & Rationale

This implementation directly responds to the provided user feedback and requirements:

- Encourage **actual reading**, not guessing
- Provide **clear feedback and explanations**
- Support **different reading speeds**
- Avoid brittle reliance on external AI services
- Maintain a clean, maintainable architecture

Rather than focusing on excessive UI complexity, the project prioritises **clarity, flow, and robustness**, reflecting real production constraints.

---

## Features

- Display reading passages with selectable difficulty/length
- AI-generated multiple-choice comprehension questions
- Explanations shown after submission to reinforce learning
- Answer tracking (correct / incorrect)
- Final score and retry flow
- Responsive layout (mobile & desktop)
- Clear loading and disabled states during generation
- Deterministic mock AI for consistent review

---

## AI Question Generation (Reliable by Design)

The system supports **two AI generation modes**:

### 1. Mock AI (Default)
- Deterministic, high-quality question generation
- Always available
- Ideal for local development, CI, and restricted networks

### 2. OpenAI (Optional)
- Real AI-generated comprehension questions
- Uses OpenAI’s API when enabled

Each API response includes a `source` field (`mock` or `openai`) so reviewers can clearly see which path is used.

---

### Why Mock by Default?

External AI providers may be unavailable in certain environments  
(e.g. China, VPNs, corporate firewalls, CI pipelines).

To ensure:

- the app always works,
- reviewers are never blocked,
- and behaviour is predictable,

the system **gracefully falls back** to a deterministic mock generator.

This approach demonstrates **production thinking**, reliability, and good developer experience.

---

## Configuration

AI behaviour is controlled via environment variables:

```env
AI_PROVIDER=mock
# AI_PROVIDER=openai
# OPENAI_API_KEY=your_api_key_here
```

No configuration is required to run the app in mock mode.

Tech Stack

Next.js (App Router)

TypeScript

Tailwind CSS

OpenAI API (optional)

Deterministic mock AI generator

Deployed on Vercel

Project Structure (Key Files)
app/
 ├─ api/
 │   └─ generate-questions/
 │       └─ route.ts        # AI / mock question generation logic
 ├─ page.tsx                # Main UI (reading, questions, scoring)
 └─ layout.tsx

lib/
 ├─ ai.ts                   # AI provider abstraction + fallback logic
 ├─ mock.ts                 # Deterministic mock question generator
 └─ passages.ts             # Reading passages

Getting Started (Local Development)
npm install
npm run dev


Open
http://localhost:3000

The app runs in mock mode by default.

Notes for Reviewers

The application defaults to mock AI for reliability and ease of review

OpenAI integration can be enabled instantly via environment variables

The focus of this assessment is architecture, data flow, and robustness

UI decisions prioritise readability, learning flow, and maintainability

All core requirements from the assessment brief are implemented

Deployment

This project is deployed using Vercel.

Any push to the main branch automatically triggers a new production deployment.

Final Remarks

This implementation is intentionally scoped to demonstrate:

Practical AI integration strategies

Thoughtful handling of real-world constraints

Clean, maintainable frontend architecture

A strong focus on learning outcomes over superficial features