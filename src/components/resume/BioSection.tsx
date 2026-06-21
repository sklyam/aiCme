export function BioSection({ bio }: { bio: string }) {
  if (!bio) return null

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3 uppercase tracking-wider text-sm text-[var(--color-primary)]">
        About
      </h2>
      <div className="text-[var(--color-text)]/80 leading-relaxed whitespace-pre-line">
        {bio}
      </div>
    </section>
  )
}
