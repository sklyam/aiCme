import { MapPin, Mail, Globe, Github, Linkedin } from 'lucide-react'
import type { EnhancedResume } from '../../server/enhance-resume'

export function ResumeHeader({
  resume,
}: {
  resume: EnhancedResume
}) {
  const { name, title, headline, contact } = resume

  return (
    <header className="mb-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text)]">
            {name}
          </h1>
          <p className="mt-1 text-xl text-[var(--color-primary)] font-medium">
            {title}
          </p>
          {headline && (
            <p className="mt-2 text-lg text-[var(--color-text)]/70 italic">
              {headline}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--color-text)]/60">
        {contact.location && (
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {contact.location}
          </span>
        )}
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-1 hover:text-[var(--color-primary)] transition-colors"
          >
            <Mail size={14} />
            {contact.email}
          </a>
        )}
        {contact.social.website && (
          <a
            href={contact.social.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-[var(--color-primary)] transition-colors"
          >
            <Globe size={14} />
            Website
          </a>
        )}
        {contact.social.github && (
          <a
            href={`https://github.com/${contact.social.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-[var(--color-primary)] transition-colors"
          >
            <Github size={14} />
            {contact.social.github}
          </a>
        )}
        {contact.social.linkedin && (
          <a
            href={`https://linkedin.com/in/${contact.social.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-[var(--color-primary)] transition-colors"
          >
            <Linkedin size={14} />
            {contact.social.linkedin}
          </a>
        )}
      </div>
    </header>
  )
}
