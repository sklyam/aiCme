import { MapPin, Mail, Globe, Github, Linkedin } from 'lucide-react'
import type { EnhancedResume } from '../../types'

export function ResumeHeader({
  resume,
}: {
  resume: EnhancedResume
}) {
  const { name, title, headline, contact } = resume

  return (
    <header className="mb-12">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-5xl font-light tracking-tight text-[var(--color-text)] leading-none">
            {name}
          </h1>
          <p className="mt-3 text-lg text-[var(--color-muted)] font-light">
            {title}
          </p>
          {headline && (
            <p className="mt-3 text-base text-[var(--color-muted)] leading-relaxed max-w-2xl">
              {headline}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 text-sm text-[var(--color-muted)]">
        {contact.location && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--color-hairline)]">
            <MapPin size={12} />
            {contact.location}
          </span>
        )}
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--color-hairline)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
          >
            <Mail size={12} />
            {contact.email}
          </a>
        )}
        {contact.social.website && (
          <a
            href={contact.social.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--color-hairline)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
          >
            <Globe size={12} />
            Website
          </a>
        )}
        {contact.social.github && (
          <a
            href={`https://github.com/${contact.social.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--color-hairline)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
          >
            <Github size={12} />
            {contact.social.github}
          </a>
        )}
        {contact.social.linkedin && (
          <a
            href={`https://linkedin.com/in/${contact.social.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--color-hairline)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
          >
            <Linkedin size={12} />
            {contact.social.linkedin}
          </a>
        )}
      </div>
    </header>
  )
}
