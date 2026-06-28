import fs from 'node:fs'
import path from 'node:path'

const contentDir = path.resolve(process.cwd(), 'content')

function listMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return []

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return listMarkdownFiles(fullPath)
    return entry.isFile() && entry.name.endsWith('.md') ? [fullPath] : []
  })
}

function slugFromFile(file) {
  return path
    .relative(contentDir, file)
    .replace(/\.example\.md$/, '')
    .replace(/\.md$/, '')
    .replace(/\\/g, '/')
}

const files = listMarkdownFiles(contentDir)
const exampleFiles = files.filter((file) => file.endsWith('.example.md'))
const realFiles = files.filter((file) => !file.endsWith('.example.md'))
const realSlugs = realFiles.map(slugFromFile)
const rootExampleFiles = exampleFiles.filter((file) => path.dirname(file) === contentDir)
const rootExampleSlugs = rootExampleFiles.map(slugFromFile)
const rootExampleBasenames = new Set(
  rootExampleFiles.map((file) => path.basename(file).replace('.example.md', '')),
)
const rootRealFiles = realFiles.filter((file) => path.dirname(file) === contentDir)
const fallbackRealSlugs = rootRealFiles
  .filter((file) => !rootExampleBasenames.has(path.basename(file).replace('.md', '')))
  .map(slugFromFile)
const selectedExampleSlugs = rootExampleSlugs.filter((slug) => !fallbackRealSlugs.includes(slug))
const warnings = []

if (realFiles.length === 0 && exampleFiles.length > 0) {
  warnings.push('Using example content only. This is demo mode, not production content.')
}

if (!realSlugs.includes('profile')) {
  warnings.push('Missing content/profile.md. Chatbot profile identity will fall back to "the user".')
}

if (selectedExampleSlugs.length > 0 && realFiles.length > 0) {
  warnings.push(`Resume display still uses example content for: ${selectedExampleSlugs.join(', ')}.`)
}

console.log('Content check')
console.log(`- Real markdown files: ${realFiles.length}`)
console.log(`- Example markdown files: ${exampleFiles.length}`)
console.log(`- Mode: ${realFiles.length === 0 && exampleFiles.length > 0 ? 'demo' : 'custom'}`)

if (warnings.length === 0) {
  console.log('- Warnings: none')
} else {
  console.log('- Warnings:')
  for (const warning of warnings) {
    console.log(`  - ${warning}`)
  }
}

if (process.argv.includes('--strict') && warnings.length > 0) {
  process.exitCode = 1
}
