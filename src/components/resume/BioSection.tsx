export function BioSection({ bio }: { bio: string }) {
  if (!bio) return null

  return (
    <section className="mb-10">
      <h2 className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-widest mb-4">
        About
      </h2>
      <div className="text-[var(--color-text)]/70 leading-relaxed whitespace-pre-line">
        {bio}
      </div>
    </section>
  )
}
