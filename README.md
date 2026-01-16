# EdAccelerator – AI Reading Comprehension Assessment

## Overview

This project is a take-home technical assessment for the **Junior Software Engineering** role at **EdAccelerator**.

The application demonstrates an AI-assisted reading comprehension workflow designed to help students improve reading understanding. Students read a passage, answer AI-generated comprehension questions, and receive feedback along with a final score.

The system is intentionally designed to be **reliable, testable, and production-ready**, even in network-restricted environments.

The scope of this assessment focuses on core system design, AI integration strategy, and data flow clarity rather than visual polish.

---

## Features
- Display reading passages with AI-generated comprehension questions
- AI-assisted generation of multiple-choice reading comprehension questions with explanations
- Track correct and incorrect multiple-choice answers
- Show final score upon completion
- Responsive UI for both mobile and desktop
- Clear feedback and explanations for learning improvement

---

## AI Integration (Reliable by Design)

This project supports **two AI generation modes**:

- **Mock AI (default)** – deterministic question generation for local development and restricted networks
- **OpenAI API** – real AI-generated questions using OpenAI

This approach ensures reviewers can evaluate logic and architecture without being blocked by external dependencies.

### Why mock by default?

In some environments (e.g. restricted networks, VPNs, corporate firewalls), server-side calls to external AI providers may fail.

To ensure the application is:

- always functional,
- easy to review,
- and resilient in real-world conditions,

the API gracefully falls back to a high-quality deterministic mock generator.

This design demonstrates production thinking, reliability, and good developer experience.


### Configuration

Configure the AI provider in `.env.local`:

```env
AI_PROVIDER=mock
# AI_PROVIDER=openai
# OPENAI_API_KEY=your_api_key_here

Each API response includes a `source` field (`mock` or `openai`) so reviewers can clearly see which path is used.

---

## Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **OpenAI API (optional)**
- Deterministic mock question generator
- Vercel-ready deployment

---

## Project Structure (Key Parts)

```bash
app/
 ├─ api/
 │   └─ generate-questions/
 │       └─ route.ts   # AI / Mock question generation
 ├─ page.tsx           # Main UI (reading, questions, scoring)
 └─ layout.tsx

** Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

## Usage

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

You can start editing the page by modifying `app/page.tsx`.  
The page auto-updates as you edit the file.

---

## Notes for Reviewers

- The application defaults to **mock AI** to ensure reliability in restricted environments.
- OpenAI integration can be enabled easily via environment variables.
- The focus of this assessment is **clean architecture, reliability, and clarity**, rather than excessive UI complexity.
- UI is intentionally kept simple to prioritise readability, assessment flow, and maintainability.

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

---

## Deploy on Vercel

The easiest way to deploy this Next.js app is via the  
[Vercel Platform](https://vercel.com).

Check out the  
[Next.js deployment documentation](https://nextjs.org/docs/deployment)  
for more details.


