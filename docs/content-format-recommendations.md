# Content Format Recommendations

These files describe recommended shapes for user-provided profile data. They are examples, not strict schemas. The real `content/` files can be replaced by a user's own data.

## General Rules

- Prefer Markdown that is comfortable for a person to maintain.
- Use headings as the main structure.
- Treat detailed fields as optional.
- Skip missing fields instead of writing empty placeholders.
- Do not make AI invent missing facts.

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
