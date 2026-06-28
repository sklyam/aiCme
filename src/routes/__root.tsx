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
    <nav className="sticky top-0 z-50 backdrop-blur-sm bg-[var(--color-bg)]/70 border-b border-[var(--color-hairline)]">
      <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="font-light text-lg text-[var(--color-text)] tracking-tight hover:text-[var(--color-primary)] transition-colors"
          >
            aiCme
          </Link>
          <div className="flex gap-1 text-sm">
            <Link
              to="/"
              className="px-3 py-1.5 rounded-full text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors [&.active]:text-[var(--color-primary)] [&.active]:bg-[var(--color-primary)]/5"
            >
              Resume
            </Link>
            <Link
              to="/chatbot"
              className="px-3 py-1.5 rounded-full text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors [&.active]:text-[var(--color-primary)] [&.active]:bg-[var(--color-primary)]/5"
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
          <script dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()`
          }} />
        </head>
        <body className="bg-[var(--color-bg)] text-[var(--color-text)] min-h-screen antialiased">
          <Nav />
          <main className="px-4 py-12">
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
