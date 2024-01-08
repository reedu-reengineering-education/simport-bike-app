'use client'

import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const titles: Record<string, string> = {
  '/': '',
  '/tracks': 'Tracks',
}

const Navbar = () => {
  const pathname = usePathname()

  const isHome = pathname === '/'

  return (
    <div className="pointer-events-auto sticky top-0 z-10 flex w-full items-center justify-between border-b border-muted px-4 pb-4 pt-2 landscape:px-safe-or-4">
      <div className="flex items-center gap-2">
        {!isHome && (
          <Link href="/">
            <ArrowLeftIcon className="h-7 w-7" />
          </Link>
        )}
        <h1 className="text-xl">{titles[pathname]}</h1>
      </div>
    </div>
  )
}

export { Navbar }
