# Codebase To Project Profile Prompt

Analyze the provided codebase as evidence for a personal resume/project profile.

Output Markdown only.

Do not invent missing facts. Only include fields that can be reasonably inferred from files, code, package metadata, docs, configuration, tests, or commit messages if available. If a field is unknown, omit it or list it under `Unknowns`.

Prefer concrete technical facts over marketing language. The output should be suitable for `content/projects.md`.

Every field is optional. Do not force `Role`, `Impact`, `Period`, deployment status, scale, or ownership unless the codebase or documentation clearly supports it.

For each project, use this flexible shape:

```md
## Project Name

Tech: detected technologies, frameworks, tools, and services

### Summary

What the project appears to do.

### Features

- Observable feature or capability.

### Technical Details

- Architecture, data flow, integrations, storage, build setup, or notable implementation choices.

### Evidence

- File, directory, package, config, README, or test evidence supporting the description.

### Unknowns

- Important facts that are not clear from the source material.
```

When analyzing a folder containing many projects, output one `## Project Name` section per project. Short or toy projects may have short sections. Do not merge unrelated projects.
