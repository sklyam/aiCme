import type { EnhancedResume } from '../../server/enhance-resume'

const sectionIcons: Record<string, string> = {
  experience: '💼',
  education: '🎓',
  projects: '🚀',
  skills: '🛠️',
}

export function SectionsList({
  sections,
}: {
  sections: EnhancedResume['sections']
}) {
  if (sections.length === 0) return null

  return (
    <>
      {sections.map((section) => (
        <section key={section.type} className="mb-8">
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4 uppercase tracking-wider text-sm text-[var(--color-primary)] flex items-center gap-2">
            <span>{sectionIcons[section.type] ?? '📄'}</span>
            {section.title}
          </h2>

          <div className="space-y-6">
            {section.items.map((item, i) => (
              <div key={i}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)]">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-sm text-[var(--color-primary)]">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                  {item.date && (
                    <span className="text-sm text-[var(--color-text)]/50 whitespace-nowrap shrink-0">
                      {item.date}
                    </span>
                  )}
                </div>

                {item.description && (
                  <p className="mt-2 text-sm text-[var(--color-text)]/70 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {item.highlights.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {item.highlights.map((h, j) => (
                      <li
                        key={j}
                        className="text-sm text-[var(--color-text)]/70 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[var(--color-primary)]"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                )}

                {item.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.tags.map((tag, j) => (
                      <span
                        key={j}
                        className="px-2 py-0.5 text-xs rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {item.links.length > 0 && (
                  <div className="mt-2 flex gap-3">
                    {item.links.map((link, j) => (
                      <a
                        key={j}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--color-accent)] hover:underline"
                      >
                        {link.label} →
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}
