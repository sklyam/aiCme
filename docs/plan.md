# aiCme — Project Plan

## Overview

An open-source AI Resume / CV personal website framework.

Users provide personal info as **Markdown files**. The system:
1. **Parses** `.md` files → resume page (pure parser, no LLM)
2. **Chatbot** answers questions about the user (uses LLM)

Chatbot has **strict topic scope**: only About Me, Projects, Skills, Experience. Out-of-scope: `"I can only answer questions about {name}'s profile."`

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | **TanStack Start** (React, SSR, file-based routing) |
| Styling | **Tailwind CSS v4** |
| AI SDK | **TanStack AI** (`@tanstack/ai`) — `chat()`, multi-provider adapters |
| Language | **TypeScript** |
| Markdown | **gray-matter** (frontmatter parsing) |
| Package Manager | **pnpm** |
| Deployment | Vercel (serverless) → future Docker |

---

## Directory Structure

```
aiCme/
├── src/
│   ├── routes/
│   │   ├── __root.tsx              # Root layout (nav, theme, HeadContent)
│   │   ├── index.tsx               # Resume page (loader: parseResumeFromMd)
│   │   ├── chatbot.tsx             # Chatbot page (loader: fetchProfileName)
│   │   └── api.chat.ts             # POST /api/chat (SSE streaming via TanStack AI)
│   ├── components/
│   │   ├── resume/
│   │   │   ├── Resume.tsx          # Main resume shell
│   │   │   ├── ResumeHeader.tsx    # Name, title, contact bar
│   │   │   ├── BioSection.tsx      # About section
│   │   │   └── SectionsList.tsx    # Generic sections renderer
│   │   ├── Chatbot.tsx             # Chat UI with useChat
│   │   ├── ThemeToggle.tsx         # Dark/light toggle
│   │   └── ThemeProvider.tsx       # CSS variable theme context
│   ├── server/
│   │   ├── llm.ts                  # Multi-provider LLM client (chat())
│   │   ├── prompts.ts              # Prompt templates (scope constraints)
│   │   ├── enhance-resume.ts       # (deprecated) LLM-enhanced resume — kept for type
│   │   └── content-api.ts          # Server fns: fetchProfileName, fetchAllContent
│   ├── lib/
│   │   ├── content.ts              # Read & parse markdown files (server-only)
│   │   ├── resume-parser.ts        # Pure parser: .md → EnhancedResume (no LLM)
│   │   ├── cache.ts                # File-based cache with mtime invalidation
│   │   └── config.ts               # App config (provider, model, prompt)
│   ├── router.tsx
│   ├── routeTree.gen.ts            # Auto-generated
│   └── styles.css                  # Tailwind + CSS custom properties theme
├── content/
│   ├── .gitignore                  # * ignores all, !*.example.md un-ignores templates
│   ├── profile.example.md          # Frontmatter-driven (name, title, contact)
│   ├── experience.example.md       # Work history
│   ├── education.example.md        # Education background
│   ├── projects.example.md         # Projects
│   ├── skills.example.md           # Skills
│   └── prompt.example.md           # Optional custom chatbot system prompt
├── docs/
│   ├── plan.md                     # This file
│   └── content-format-recommendations.md
├── tools/
│   └── project-analysis/           # Prompts + skills for generating project content
├── work/                           # Local scratch files (gitignored)
├── public/
├── .gitignore
├── AGENTS.md
├── vite.config.ts
├── tsconfig.json
├── tsr.config.json
├── package.json
└── pnpm-lock.yaml
```

---

## Content Layer

- All `.md` files under `content/` are auto-discovered recursively
- `.example.md` files are reference templates (committed); code skips them
- Real `.md` files are gitignored — users create by copying `.example` and removing suffix
- `content/llm_profile_pack/` is a gitignored subdirectory for the user's personal LLM analysis

**Special files:**
- `profile.md` — frontmatter-driven (`name`, `title`, `email`, `location`, `social`); body is bio
- `prompt.md` — optional custom system prompt for chatbot (overrides config default)

**Generic files:** section type derived from file slug or `## heading` text.

---

## Data Flow

### Resume Page
1. Server reads all `content/*.md` files (excluding `.example.md`)
2. Parses with `gray-matter` into `{slug, frontmatter, body}`
3. Pure parser (`resume-parser.ts`) converts `.md` → `EnhancedResume` JSON:
   - Profile frontmatter → name, title, contact
   - Profile body → bio
   - `## headings` → sections; `### items` → subsection items
   - Bullet lists → highlights; `**Stack:**` → tags; `**Links:**` → links
4. Lightweight cache with mtime invalidation (optional, parser is fast)
5. Server passes JSON to React components for rendering

### Chatbot
1. User types a question
2. **Topic Gate** (keyword rules): check if question is about allowed topics
3. If out of scope → SSE stream with `"I can only answer questions about {name}'s profile."`
4. If in scope → build system prompt with content + scope constraints
5. Call LLM via TanStack AI `chat()` — multi-provider (OpenAI, Anthropic, Gemini, Ollama)
6. Stream AG-UI events via `toServerSentEventsResponse()`

---

## Topic Scope Enforcement

**Two layers:**

### Layer 1: Topic Gate (pre-LLM keyword match)
Keywords: `you`, `your`, `work`, `project`, `skill`, `experience`, `background`, `resume`, `about`, `built`, `tech`, `company`, `role`, `education`, `school`, `degree`

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

CSS custom properties:

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

## Key Decisions

| Decision | Rationale |
|---|---|
| No content management UI | Raw markdown never client-exposed; Git is source of truth |
| `.example.md` committed, `.md` gitignored | Personal data never in git history |
| Resume: pure parser, no LLM | Faster, cheaper, deterministic; LLM not needed for formatting |
| Chatbot: TanStack AI `chat()` | Unified multi-provider API with built-in SSE streaming |
| Out-of-scope: SSE stream | Matches client `fetchServerSentEvents` format; fixes `StreamTruncatedError` |
| Recursive content discovery | Supports subdirectory profiles (e.g. `llm_profile_pack/`) |
| `work/` directory gitignored | Local scratch files for AI tooling, never committed |

---

## Implementation Phases

| # | Phase | Status |
|---|---|---|
| 1 | **Scaffold** — TanStack Start, Tailwind, TypeScript, AI add-on | Done |
| 2 | **Content Layer** — `lib/content.ts`, `lib/config.ts`, sample `.md` | Done |
| 3 | **Resume Page** — Components, `server/enhance-resume.ts` → parser, route | Done |
| 4 | **LLM Integration** — `server/llm.ts`, `server/prompts.ts` | Done |
| 5 | **Chatbot** — `Chatbot.tsx`, `api.chat.ts`, topic gate | Done |
| 6 | **Polish** — Theme toggle, responsive, error states, SEO | Done |
| 7 | **Content Restructure** — `.example.md` templates, `.gitignore`, recursive scan | Done |
| 8 | **Resume Parser** — Pure `.md` → `EnhancedResume` without LLM | Done |
| | **Deployment** — Vercel / Docker | Pending |

---

## Key Dependencies

| Package | Purpose |
|---|---|
| `@tanstack/start` + `@tanstack/react-router` | Framework |
| `react` + `react-dom` | UI |
| `tailwindcss` + `@tailwindcss/vite` | Styling |
| `@tanstack/ai` + provider adapters | LLM (OpenAI, Anthropic, Gemini, Ollama) |
| `gray-matter` | Markdown frontmatter parsing |
| `zod` | Runtime config validation |
