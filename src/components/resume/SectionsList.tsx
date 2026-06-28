import type { EnhancedResume } from '../../types'

export function SectionsList({
  sections,
}: {
  sections: EnhancedResume['sections']
}) {
  if (sections.length === 0) return null

  return (
    <>
      {sections.map((section) => (
        <section key={section.type} className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-[var(--color-hairline)]" />
            <h2 className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-widest shrink-0">
              {section.title}
            </h2>
            <div className="h-px flex-1 bg-[var(--color-hairline)]" />
          </div>

          <div className="space-y-6">
            {section.items.map((item, i) => (
              <div key={i}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    {item.title !== section.title && (
                      <h3 className="font-medium text-[var(--color-text)]">
                        {item.title}
                      </h3>
                    )}
                    {item.subtitle && (
                      <p className="text-sm text-[var(--color-muted)] mt-0.5">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                  {item.date && (
                    <span className="text-sm text-[var(--color-muted)] whitespace-nowrap shrink-0">
                      {item.date}
                    </span>
                  )}
                </div>

                {item.description && (
                  <p className="mt-2 text-sm text-[var(--color-text)]/60 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {item.highlights.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {item.highlights.map((h, j) => (
                      <li
                        key={j}
                        className="text-sm text-[var(--color-text)]/60 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-1 before:h-px before:bg-[var(--color-muted)]"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                )}

                {item.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.tags.map((tag, j) => (
                      <span
                        key={j}
                        className="px-2 py-0.5 text-xs rounded-full border border-[var(--color-hairline)] text-[var(--color-muted)]"
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
                        className="text-xs text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
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
