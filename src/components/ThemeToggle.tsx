import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <button
      onClick={toggle}
      className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--color-hairline)] hover:border-[var(--color-primary)] transition-colors text-[var(--color-muted)] hover:text-[var(--color-primary)]"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {mounted ? (theme === 'light' ? <Moon size={18} /> : <Sun size={18} />) : <div className="w-[18px] h-[18px]" />}
    </button>
  )
}
