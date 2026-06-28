# aiCme Project Plan

## Overview

aiCme is an open-source AI resume / CV personal website framework.

Users provide personal profile data as Markdown files. The system:

1. Parses display-friendly Markdown into a resume page without using an LLM.
2. Uses real Markdown content as grounded context for a profile chatbot.

The content model is intentionally low-restriction. Only content that must appear in the resume UI needs to follow the parser-friendly shape; other Markdown can remain flexible notes, project writeups, or AI-generated drafts.

---

## Content Layers

### Resume Display Content

- Root-level `content/*.md` and `content/*.example.md` files are used by the resume page.
- `.example.md` files are committed templates and can power demo mode.
- Real `.md` files are gitignored by default so personal data is not committed accidentally.
- The parser contract applies only to content that the current UI is expected to display.

### AI Knowledge Content

- The chatbot reads real `.md` files recursively under `content/`.
- Nested files such as `content/projects/my-project.md` can provide extra context without needing to match the resume parser.
- `prompt.md` can provide optional additional chatbot instructions.
- `.example.md` files are not used as chatbot knowledge, avoiding accidental demo answers in production.

---

## Data Flow

### Resume Page

1. Read root-level display Markdown from `content/`.
2. Prefer committed `.example.md` templates as demo fallback, plus real files that are not shadowed by a matching example.
3. Parse with `gray-matter` into `{ slug, frontmatter, body, source }`.
4. Convert parser-friendly Markdown into `EnhancedResume`.
5. Render through the resume UI components.

### Chatbot

1. User asks a question in English, Chinese, or mixed language.
2. A soft pre-LLM gate rejects only clearly unrelated requests.
3. Profile-related or ambiguous questions are sent to TanStack AI `chat()`.
4. The system prompt requires answers to be grounded only in real profile content.
5. Responses stream through `toServerSentEventsResponse()`.

---

## Topic Scope

The chatbot uses two layers:

- **Soft gate**: refuse obvious non-profile requests, such as weather, stock prices, news, or code-generation requests that do not mention the profile.
- **System prompt**: for all allowed questions, answer only from the profile context; if the profile does not contain the requested information, respond with `"I can only answer questions about {name}'s profile."`

This avoids a strict keyword gate because user questions may be Chinese, English, mixed language, or phrased indirectly.

---

## Content Checks

Before publishing, run:

```bash
pnpm check:content
```

The check reports:

- demo mode when only example content exists
- missing real `profile.md`
- resume display still using example content while real content exists

For CI or stricter release checks:

```bash
pnpm check:content:strict
```

---

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | TanStack Start |
| Routing | TanStack Router |
| AI SDK | TanStack AI |
| UI | React + TypeScript |
| Styling | Tailwind CSS v4 |
| Markdown | gray-matter |
| Package Manager | pnpm |

---

## Key Decisions

| Decision | Rationale |
| --- | --- |
| Markdown-first content | Easy for users and AI tools to edit |
| No CMS for v1 | Git and local files stay the source of truth |
| Resume parser is deterministic | Display rendering should be fast and predictable |
| Flexible AI knowledge files | Users can add rich project notes without UI schema pressure |
| Soft topic gate | Prevents obvious misuse without blocking valid multilingual questions |
| Example fallback stays visible | Demo content is useful, but content checks warn before production |

---

## Future Extensions

- Add `visibleSections` / `hiddenSections` or `display` frontmatter options.
- Add UI for selecting which content appears on the resume.
- Add stricter schema validation only for sections that need structured UI rendering.
- Add richer content diagnostics in the app shell or build output.
