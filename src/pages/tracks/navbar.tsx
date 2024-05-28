import { Link } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'

const Navbar = () => {
  return (
    <div className="pointer-events-auto sticky top-0 z-10 flex w-full items-center justify-between border-b border-muted px-4 pb-4 pt-2 landscape:px-safe-or-4">
      <div className="flex items-center gap-2">
        <Link to="/">
          <ArrowLeftIcon className="h-7 w-7" />
        </Link>
      </div>
    </div>
  )
}

export { Navbar }
