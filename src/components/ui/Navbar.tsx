'use client'

import {
  CpuChipIcon,
  GlobeEuropeAfricaIcon,
  HomeIcon,
} from '@heroicons/react/24/outline'
import { cx } from 'class-variance-authority'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const pages = [
  {
    href: '/',
    icon: HomeIcon,
  },
  {
    href: '/device',
    icon: CpuChipIcon,
  },
]

const Navbar = () => {
  const pathName = usePathname()

  return (
    <div className="sticky bottom-0 flex w-full justify-evenly gap-2 border-t pb-2 pt-3">
      {pages.map(({ href, icon: Icon }) => (
        <Link
          href={href}
          key={href}
          className={cx(
            pathName === href ? 'bg-muted' : '',
            'rounded-xl px-6 py-1',
          )}
        >
          <Icon
            className={cx(
              'h-6 w-6',
              pathName === href ? 'text-primary' : 'text-primary/50',
            )}
          />
        </Link>
      ))}
    </div>
  )
}

export { Navbar }
