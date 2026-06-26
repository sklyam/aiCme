# Project Profile From Codebase

Use this skill when you need to analyze one codebase, many small projects, or a folder of repositories and turn the findings into project-profile Markdown suitable for `content/projects.md`.

## Goal

Create conservative, evidence-based project notes for a personal resume/profile knowledge base.

The output is not a marketing page and not a strict form. It is source material that can later be used by resume generation and chatbot prompts.

## Rules

- Output Markdown only.
- Do not invent missing facts.
- Only include information that can be reasonably inferred from code, README files, package metadata, docs, configuration, tests, or commit messages if available.
- Treat every field as optional.
- Omit fields that cannot be inferred.
- Put uncertain or missing facts under `Unknowns` instead of guessing.
- Prefer concrete technical facts over polished claims.
- Do not claim production usage, user counts, business impact, employment role, dates, or ownership unless the source material clearly supports it.
- When analyzing many projects, produce one `## Project Name` section per project.
- It is acceptable for small projects to have short sections.

## Recommended Output Shape

```md
## Project Name

Tech: React, TypeScript, Tailwind CSS

### Summary

A short description of what the project appears to do.

### Features

- Feature visible from code or docs.
- Another supported capability.

### Technical Details

- Uses file-based routing.
- Integrates an LLM API.
- Stores content as Markdown.

### Evidence

- `package.json` shows React and TypeScript.
- `src/routes` contains resume and chatbot routes.
- `README.md` describes the project as an AI resume framework.

### Unknowns

- Deployment status is not clear from the repository.
- User role cannot be confirmed from code alone.
```

## Field Guidance

- `Tech`: include languages, frameworks, libraries, databases, infrastructure, or tooling that appear in source files or dependency metadata.
- `Summary`: describe what the project appears to do, using cautious language when there is no README.
- `Features`: include user-facing or developer-facing behavior visible in routes, components, APIs, CLIs, tests, or docs.
- `Technical Details`: include architecture, data flow, integrations, storage, build tools, or notable implementation choices.
- `Evidence`: cite filenames, directories, package metadata, docs, or tests that support the summary.
- `Unknowns`: record missing role, impact, deployment status, dates, scale, ownership, or other facts that cannot be verified.

## Multi-Project Folder Workflow

1. Identify likely project roots by looking for package manifests, README files, lockfiles, framework configs, app entrypoints, or repository boundaries.
2. Analyze each project independently.
3. Use the folder or repository name as the project name if no better name exists.
4. Keep duplicated dependency evidence concise.
5. Do not merge unrelated projects into one section unless the folder clearly represents a single monorepo product.

## Final Check

Before returning, remove unsupported claims and make sure the Markdown can be pasted directly into `content/projects.md`.
