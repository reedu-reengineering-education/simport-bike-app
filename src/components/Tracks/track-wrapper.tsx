'use client'

import { useTracksStore } from '@/lib/store/useTracksStore'
import { cn } from '@/lib/utils'
import 'maplibre-gl/dist/maplibre-gl.css'
import Link from 'next/link'
import { Button } from '../ui/button'
import TrackDetail from './TrackDetail'

export default function TrackWrapper() {
  const tracks = useTracksStore(state => state.tracks)

  return (
    <div className="flex h-full w-full flex-col gap-2">
      {tracks.length === 0 && (
        <div
          className={cn(
            'rounded-mdp-8 flex min-h-[200px] flex-col items-center justify-center rounded-md bg-muted/50 text-center',
          )}
        >
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center p-2 text-center">
            <h2 className={cn('text-xl font-semibold')}>Keine Tracks</h2>
            <p
              className={cn(
                'mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground',
              )}
            >
              Verbinde dich mit deiner senseBox und Tracke deine nächste Fahrt
            </p>
            <Link href="/">
              <Button variant={'outline'}>Neuen Track erstellen</Button>
            </Link>
          </div>
        </div>
      )}
      {tracks.map(track => {
        return <TrackDetail key={track.id} track={track} />
      })}
    </div>
  )
}
