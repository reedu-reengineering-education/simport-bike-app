import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl">Page not found</p>
      <Link href="/">
        <Button variant={'outline'}>
          <ArrowLeft className="mr-2 w-4" />
          Back Home
        </Button>
      </Link>
    </div>
  )
}
