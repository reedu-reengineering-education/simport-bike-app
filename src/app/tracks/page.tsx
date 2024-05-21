'use client'

import TrackWrapper from '@/components/Tracks/track-wrapper'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { ExternalLinkIcon } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from './navbar'

export default function TracksPage() {
  const selectedBox = useAuthStore(state => state.selectedBox)

  return (
    <main className="flex h-full w-full flex-col pt-safe">
      <header>
        <Navbar />
      </header>
      {selectedBox && (
        <div className="px-4 pt-4">
          <Link href={`https://opensensemap.org/explore/${selectedBox?._id}`}>
            <Button className="w-full" variant={'secondary'}>
              senseBox auf der openSenseMap{' '}
              <ExternalLinkIcon className="ml-2 h-4" />
            </Button>
          </Link>
        </div>
      )}
      <div className="flex-1 overflow-scroll p-4 pb-safe">
        <TrackWrapper />
      </div>
    </main>
  )
}
