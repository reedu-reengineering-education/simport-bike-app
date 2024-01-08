import { TopBar } from '@/components/ui/TopBar'
import '@/styles/globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative h-full w-full">
      <main className="h-full w-full overflow-auto landscape:pl-safe">
        {children}
      </main>
      <div className="absolute top-0 w-screen backdrop-blur pt-safe" />
      <header className="absolute right-0 top-0 w-fit mt-safe">
        <TopBar />
      </header>
    </div>
  )
}
