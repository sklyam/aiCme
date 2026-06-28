import { createFileRoute } from '@tanstack/react-router'
import { Resume } from '../components/resume/Resume'
import { fetchResumeData } from '../server/content-api'

export const Route = createFileRoute('/')({
  component: Home,
  loader: () => fetchResumeData(),
  pendingComponent: () => (
    <div className="max-w-3xl mx-auto py-20 text-center">
      <div className="animate-pulse space-y-3">
        <div className="h-6 bg-[var(--color-surface)] rounded w-1/3 mx-auto" />
        <div className="h-3 bg-[var(--color-surface)] rounded w-2/3 mx-auto" />
        <div className="h-24 bg-[var(--color-surface)] rounded" />
      </div>
    </div>
  ),
  errorComponent: () => (
    <div className="max-w-3xl mx-auto py-20 text-center text-[var(--color-muted)]">
      <p>Could not load resume.</p>
    </div>
  ),
})

function Home() {
  const resume = Route.useLoaderData()

  return <Resume resume={resume} />
}
