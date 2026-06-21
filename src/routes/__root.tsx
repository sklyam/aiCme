import { HeadContent, Link, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ThemeProvider } from '../components/ThemeProvider'
import { ThemeToggle } from '../components/ThemeToggle'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'aiCme - AI Resume' },
      { name: 'description', content: 'AI-powered resume and profile chatbot' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootLayout,
})

function Nav() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-sm bg-[var(--color-surface)]/80 border-b border-[var(--color-primary)]/10">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="font-bold text-lg text-[var(--color-primary)] hover:opacity-80 transition-opacity"
          >
            aiCme
          </Link>
          <div className="flex gap-4 text-sm">
            <Link
              to="/"
              className="text-[var(--color-text)]/60 hover:text-[var(--color-primary)] transition-colors [&.active]:text-[var(--color-primary)] [&.active]:font-medium"
            >
              Resume
            </Link>
            <Link
              to="/chatbot"
              className="text-[var(--color-text)]/60 hover:text-[var(--color-primary)] transition-colors [&.active]:text-[var(--color-primary)] [&.active]:font-medium"
            >
              Chat
            </Link>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  )
}

function RootLayout() {
  return (
    <ThemeProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <HeadContent />
        </head>
        <body className="bg-[var(--color-bg)] text-[var(--color-text)] min-h-screen">
          <Nav />
          <main className="px-4 py-8">
            <Outlet />
          </main>
          <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
          <Scripts />
        </body>
      </html>
    </ThemeProvider>
  )
}
