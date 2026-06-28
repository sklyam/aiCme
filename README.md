# aiCme

An open-source AI resume / CV personal website framework.

aiCme is Markdown-first: users keep their profile, resume, project notes, and AI discussion context in `content/`. The site renders a deterministic resume page and provides a profile-bound chatbot that answers from the user's own Markdown content.

## What This Project Is

aiCme is designed as a personal website starter for people who want:

- a resume / CV page generated from local Markdown
- an AI chatbot that can discuss their background, projects, skills, and experience
- a low-friction content format that can be edited by humans or AI tools
- a safe default where personal `.md` files are not committed accidentally
- a framework that can later grow into user-controlled display options

The current goal is not to build a full CMS. Git and Markdown remain the source of truth.

## Quick Start

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open the app at:

```txt
http://localhost:3000
```

Build for production:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## Content Model

aiCme separates Markdown into two layers.

### Resume Display Content

This is content the resume UI parser can render into visible sections.

Current display content is expected to live at the root of `content/`, for example:

```txt
content/profile.md
content/skills.md
content/custom-section.md
```

The resume parser is intentionally conservative. Only the content that must appear in the UI needs to follow a display-friendly shape.

### AI Knowledge Content

This is flexible Markdown used by the chatbot as grounded context.

Any real `.md` file under `content/` can be used by the chatbot, including nested files:

```txt
content/projects/my-project.md
content/research/project-notes.md
content/interview-notes.md
```

These files do not need to match the resume parser. They can be project writeups, raw notes, AI-generated drafts, or structured summaries.

## Example Content And Personal Content

The repository includes committed templates:

```txt
content/profile.example.md
content/projects.example.md
content/skills.example.md
content/experience.example.md
content/education.example.md
content/prompt.example.md
```

Real personal content should use `.md` without `.example`:

```txt
content/profile.md
content/projects/my-app.md
```

By default, real `content/*.md` files are ignored by Git so personal data is not committed accidentally.

### Demo Fallback

The resume page can use `.example.md` files as demo fallback. This is intentional: a fresh clone should show a working site.

Before publishing your own site, run:

```bash
pnpm check:content
```

This reports whether the site is still in demo mode, whether `content/profile.md` is missing, and whether the resume display still uses example content.

For CI or strict release checks:

```bash
pnpm check:content:strict
```

## Recommended Content Format

See:

```txt
docs/content-format-recommendations.md
```

The recommendations are not a global schema. They are a guide for writing Markdown that is comfortable for humans, AI tools, and the current resume parser.

Important rule of thumb:

- If content must appear in the resume UI, keep it parser-friendly.
- If content is only for chatbot context, write normal Markdown freely.

## Chatbot Behavior

The chatbot is profile-bound. It should answer questions about:

- About / bio / background
- Projects and portfolio work
- Skills and technologies
- Experience and roles
- Education
- Contact information when present in the profile

Questions may be written in English, Chinese, or mixed language.

aiCme uses a soft pre-LLM gate:

- clear profile questions are sent to the LLM
- ambiguous questions that might be about the profile are allowed through
- clearly unrelated questions are refused before the LLM call

Examples of questions that should pass:

```txt
What projects has he built?
他做過什麼項目？
有什麼技能？
Tell me about this person's experience.
```

Examples of clearly unrelated questions:

```txt
What is the weather today?
今天股價怎麼樣？
幫我寫排序算法
Generate a SQL parser for me.
```

The system prompt also requires the model to answer only from the user's real profile content. If the information is not present, the chatbot should refuse or say it only answers questions about the profile.

## AI Provider Configuration

Set the provider with:

```env
PROVIDER=openai
```

Supported provider values:

```txt
openai
anthropic
gemini
ollama
```

Common environment variables:

```env
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
GEMINI_API_KEY=...
OLLAMA_HOST=http://localhost:11434
```

Optional model overrides:

```env
OPENAI_MODEL=gpt-4o-mini
ANTHROPIC_MODEL=claude-sonnet-4-6
GEMINI_MODEL=gemini-2.5-flash
OLLAMA_MODEL=llama3.2
```

The active defaults are defined in:

```txt
src/lib/config.ts
```

## Custom Chatbot Prompt

Create:

```txt
content/prompt.md
```

Use it to add extra style or behavior instructions for the chatbot.

Example:

```md
Keep responses concise and professional. When discussing projects, focus on impact and technologies used.
```

Custom instructions are appended to the base profile-bound system prompt. They should not be used to make the chatbot answer unrelated topics.

## Project Structure

```txt
aiCme/
  content/
    *.example.md
    .gitignore
  docs/
    content-format-recommendations.md
    plan.md
  src/
    components/
      resume/
      Chatbot.tsx
      ThemeProvider.tsx
      ThemeToggle.tsx
    lib/
      config.ts
      content.ts
      resume-parser.ts
    routes/
      __root.tsx
      index.tsx
      chatbot.tsx
      api.chat.ts
    server/
      content-api.ts
      llm.ts
      prompts.ts
      topic-gate.ts
    styles.css
  tools/
    check-content.mjs
    project-analysis/
  package.json
  vite.config.ts
```

## Scripts

```bash
pnpm dev
```

Run the local dev server.

```bash
pnpm build
```

Build the app for production.

```bash
pnpm preview
```

Preview the production build.

```bash
pnpm generate-routes
```

Regenerate TanStack Router route types.

```bash
pnpm check:content
```

Print content warnings without failing the command.

```bash
pnpm check:content:strict
```

Print content warnings and exit with a non-zero status when warnings exist.

## Deployment Checklist

Before deploying a personal version:

1. Create real content files such as `content/profile.md`.
2. Add real project or profile notes under `content/` if the chatbot should know them.
3. Run `pnpm check:content`.
4. Configure the required AI provider environment variables.
5. Run `pnpm build`.
6. Deploy to a Node-compatible or TanStack Start-compatible host.

## Design Principles

- Markdown should remain easy for humans to edit.
- AI can help discuss and reshape content, but should not invent missing facts.
- The resume page should stay deterministic and cheap to render.
- The chatbot should use flexible knowledge files without forcing every note into a UI schema.
- Example content is useful for demos, but production publishing should make demo usage visible.

## Tech Stack

- TanStack Start
- TanStack Router
- TanStack AI
- React
- TypeScript
- Tailwind CSS v4
- gray-matter
- pnpm

## Roadmap Ideas

- Add `visibleSections` / `hiddenSections` or `display` options for users.
- Add UI controls for deciding which content appears on the resume page.
- Add richer content diagnostics in the app shell.
- Add stricter schema validation only for sections that require structured rendering.
- Add deployment examples for Vercel, Docker, and other hosts.
