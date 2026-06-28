import type { EnhancedResume } from '../../types'
import { ResumeHeader } from './ResumeHeader'
import { BioSection } from './BioSection'
import { SectionsList } from './SectionsList'

export function Resume({ resume }: { resume: EnhancedResume }) {
  return (
    <div className="max-w-3xl mx-auto">
      <ResumeHeader resume={resume} />
      <BioSection bio={resume.bio} />
      <SectionsList sections={resume.sections} />
    </div>
  )
}
