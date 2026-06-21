# aiCme MVP — Project Plan

## Overview

An open-source AI Resume / CV personal website framework.

Users provide personal information and project experience as **Markdown files**. The system uses **LLM** to:
1. Generate a professional resume page.
2. Provide a chatbot that answers questions about the user.

The chatbot has **strict topic scope**: only answers questions about **About Me, Projects, Skills, Experience**. Any other questions receive the response: `"I can only answer questions about {name}'s profile."`

---

## Tech Stack

| Layer | Choice |
|---|---|---|
| Framework | **TanStack Start** (React, file-based routing, SSR) |
| Styling | **Tailwind CSS v4** |
| AI SDK | **TanStack AI** (`@tanstack/ai`) — multi-provider: OpenAI, Anthropic, Gemini, Ollama |
| Language | **TypeScript** |
| Markdown | **gray-matter** (frontmatter parsing) |
| Package Manager | **pnpm** |
| Deployment | Vercel (serverless) → future Docker |

---

## Git Workflow

- **GitHub Flow**: `main` (stable) ← `feature/*` branches → PR → main
- **Conventional Commits**: `feat:`, `fix:`, `docs:`, `refactor:`, `style:`, `chore:`

---

## Directory Structure

```
aiCme/
├── src/
│   ├── routes/
│   │   ├── __root.tsx             # Root layout (nav, theme provider)
│   │   ├── index.tsx              # Resume page (loader: enhanceResume)
│   │   ├── chatbot.tsx            # Chatbot page (loader: fetchProfileName)
│   │   └── api.chat.ts            # API route POST /api/chat (SSE streaming)
│   ├── components/
│   │   ├── resume/
│   │   │   ├── Resume.tsx         # Main resume shell
│   │   │   ├── ResumeHeader.tsx   # Name, title, contact bar
│   │   │   ├── BioSection.tsx     # About section
│   │   │   └── SectionsList.tsx   # Generic sections renderer
│   │   ├── Chatbot.tsx            # Chat messages + input + streaming
│   │   ├── ThemeToggle.tsx        # Dark/light toggle
│   │   └── ThemeProvider.tsx      # CSS variable theme context
│   ├── server/
│   │   ├── llm.ts                 # Multi-provider LLM client
│   │   ├── prompts.ts             # Prompt templates (scope constraints)
│   │   ├── enhance-resume.ts      # Server fn: LLM-enhanced resume
│   │   └── content-api.ts         # Server fns: fetchProfileName, fetchAllContent
│   ├── lib/
│   │   ├── content.ts             # Read & parse markdown files (server-only)
│   │   └── config.ts              # App configuration
│   ├── router.tsx
│   ├── routeTree.gen.ts           # Auto-generated
│   └── styles.css                 # Tailwind + CSS custom properties theme
├── content/
│   ├── profile.md                 # Bio, contact (frontmatter-driven)
│   ├── experience.md
│   ├── education.md
│   ├── projects.md
│   ├── skills.md
│   └── prompt.md                  # Optional: custom chatbot system prompt
├── public/
├── vite.config.ts
├── tsconfig.json
├── tsr.config.json
├── package.json
└── pnpm-lock.yaml
```

---

## Content Layer

All `.md` files in `content/` are auto-discovered (no hardcoded section types).

**Special files:**
- `profile.md` — frontmatter-driven (`name`, `title`, `email`, `location`, `social`), body is bio
- `prompt.md` — optional custom system prompt for chatbot (overrides config default)

**Generic files** (any name): section title from first `## heading`, content from body.

---

## Data Flow

### Resume Page
1. Server reads all `content/*.md` files
2. Parses with `gray-matter` into structured data `{slug, frontmatter, body}`
3. Single LLM call: all raw content → structured JSON (headline, bio, sections with items)
4. Cache enhanced JSON (invalidated on mtime change)
5. Render with React components + Tailwind styling

### Chatbot
1. User types a question
2. **Topic Gate** (keyword rules): check if question is about allowed topics
3. If out of scope → return `"I can only answer questions about {name}'s profile."`
4. If in scope → build system prompt with all content + custom prompt + scope constraints
5. Call LLM via Vercel AI SDK `streamText()`
6. Stream response tokens to Chatbot UI

---

## Topic Scope Enforcement

**Two layers:**

### Layer 1: Topic Gate (keyword rules, pre-LLM)
Allow keywords: `you`, `your`, `work`, `project`, `skill`, `experience`, `background`, `resume`, `about`, `built`, `tech`, `company`, `role`, `education`, `school`, `degree`

### Layer 2: System Prompt (LLM-level constraint)
```
You are an AI assistant for {name}. You MUST ONLY answer questions about:
1. About Me (bio, background, contact)
2. Projects (work, open-source, side projects)
3. Skills (technologies, tools, expertise)
4. Experience (work history, roles, achievements)

For ANY question outside these topics, respond with:
"I can only answer questions about {name}'s profile."

Do NOT answer questions about general knowledge, other people,
technical advice, code generation, or any topic outside the scope above.
```

---

## Theme System

CSS custom properties for easy reskinning:

```css
:root {
  --color-primary: #6366f1;
  --color-accent: #06b6d4;
  --color-surface: #ffffff;
  --color-text: #1e293b;
}
.dark {
  --color-primary: #818cf8;
  --color-accent: #22d3ee;
  --color-surface: #0f172a;
  --color-text: #f1f5f9;
}
```

---

## Implementation Phases

| # | Phase | Tasks |
|---|---|---|
| 1 | **Scaffold** | `npm create @tanstack/start`, install deps, config Tailwind/TS |
| 2 | **Content Layer** | `lib/content.ts`, `lib/config.ts`, sample `.md` files |
| 3 | **Resume Page** | All `<resume/*>` components, `server/enhance-resume.ts`, route |
| 4 | **LLM Integration** | `server/llm.ts`, `server/prompts.ts` |
| 5 | **Chatbot** | `Chatbot.tsx`, `server/chat.ts`, topic gate |
| 6 | **Polish** | Theme toggle, responsive, error states, SEO meta |

---

## Key Dependencies

| Package | Purpose |
|---|---|
| `@tanstack/start` + `@tanstack/react-router` | Framework |
| `react` + `react-dom` | UI |
| `tailwindcss` + `@tailwindcss/vite` | Styling |
| `ai` + `@ai-sdk/openai` + `@ai-sdk/anthropic` + `@ai-sdk/ollama` | LLM |
| `gray-matter` | Markdown frontmatter parsing |
| `react-markdown` | Rendering markdown body |
| `zod` | Runtime config validation |
