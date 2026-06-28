# Content Format Recommendations

These files describe recommended shapes for user-provided profile data. They are examples, not strict schemas. The real `content/` files can be replaced by a user's own data.

aiCme treats Markdown as two related layers:

1. **Resume display content** — root-level files that the resume UI parser can turn into structured sections.
2. **AI knowledge content** — any real `.md` file under `content/`, including nested folders such as `content/projects/my-project.md`, that the chatbot can use as grounded context.

The recommendations below are intentionally flexible. Only content that must appear in the resume UI needs to follow the display-friendly shape closely.

## General Rules

- Prefer Markdown that is comfortable for a person to maintain.
- Use headings as the main structure.
- Treat detailed fields as optional.
- Skip missing fields instead of writing empty placeholders.
- Do not make AI invent missing facts.
- Keep custom research notes, project writeups, and AI-generated drafts as normal Markdown; they do not need to match the resume parser.
- Use `pnpm check:content` before publishing to see whether the site is still using example/demo content.

## Resume Display vs AI Knowledge

The resume parser is deliberately conservative. It should only structure the content that the UI is ready to display.

- Root-level `profile.md` provides identity, contact, and bio for the resume UI.
- Root-level display files can use `##` headings for visible sections and `###` headings for visible items.
- Nested files such as `content/projects/*.md` are recommended for flexible project notes and chatbot context.
- `.example.md` files are committed templates. They can power the demo resume, but production sites should run the content check and decide whether to remove or replace them.

## profile.md

```md
---
name: "Your Name"
title: "Frontend / Full-stack Developer"
email: "you@example.com"
location: "City, Country"
social:
  github: "https://github.com/..."
  linkedin: "https://linkedin.com/in/..."
  website: "https://..."
---

## About

A short natural-language bio.
```

## projects.md

Use this for hand-written projects or AI output from `prompts/codebase-to-project-profile.md`.

This is a recommended authoring shape for humans and AI, not a strict parser contract. For larger sites, prefer one file per project under `content/projects/` so the chatbot can use the details without forcing every project into the resume UI.

For codebase-derived project notes, use the helper instructions in:

```txt
tools/project-analysis/
```

That helper is designed to produce evidence-based source material for `content/projects.md` or `content/projects/*.md`.

```md
## Project Name

Tech: React, TypeScript, Node.js

### Summary

What the project does or appears to do.

### Features

- Observable capability.

### Technical Details

- Concrete implementation detail.

### Evidence

- Source that supports the description.

### Unknowns

- Missing or uncertain facts.
```

## skills.md

```md
## Frontend

React, TypeScript, CSS, Tailwind CSS

## Backend

Node.js, PostgreSQL, REST APIs

## Tools

Git, Vite, Vitest, Playwright
```

## experience.md

```md
## Company or Role Name

Title: Software Engineer
Period: 2024 - Present

### Summary

Short description of the role.

### Highlights

- Work or result that can be supported by the user's materials.
```

## education.md

```md
## School or Program Name

Degree: B.S. Computer Science
Period: 2020 - 2024

Relevant coursework, awards, or notes if useful.
```
