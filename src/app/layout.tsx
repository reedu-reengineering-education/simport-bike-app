import { TopBar } from '@/components/ui/TopBar'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import type { Metadata, Viewport } from 'next'
import '../styles/globals.css'
import AuthChecker from './AuthChecker'
import { ThemeProvider } from './ThemeProvider'

import { GeistMono } from 'geist/font/mono'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'senseBox:bike',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full w-full" suppressHydrationWarning>
      <body className={cn(GeistMono.className, '!h-full w-full antialiased')}>
        <AuthChecker />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div
            className="flex h-full max-h-full w-full flex-col bg-background px-safe pt-safe landscape:px-0"
            vaul-drawer-wrapper=""
          >
            <header>
              <TopBar />
            </header>
            <main className="flex-1 overflow-auto landscape:pl-safe">
              {children}
            </main>
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
