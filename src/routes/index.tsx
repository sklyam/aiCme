import { createFileRoute } from '@tanstack/react-router'
import { Resume } from '../components/resume/Resume'
import { parseResumeFromMd } from '../lib/resume-parser'

export const Route = createFileRoute('/')({
  component: Home,
  loader: () => parseResumeFromMd(),
  pendingComponent: () => (
    <div className="max-w-3xl mx-auto py-20 text-center text-[var(--color-text)]/40">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-[var(--color-primary)]/10 rounded w-1/3 mx-auto" />
        <div className="h-4 bg-[var(--color-primary)]/10 rounded w-2/3 mx-auto" />
        <div className="h-32 bg-[var(--color-primary)]/5 rounded" />
      </div>
    </div>
  ),
  errorComponent: () => (
    <div className="max-w-3xl mx-auto py-20 text-center text-[var(--color-text)]/60">
      <p>Could not load resume. Make sure your content files are valid.</p>
    </div>
  ),
})

function Home() {
  const resume = Route.useLoaderData()

  return <Resume resume={resume} />
}
