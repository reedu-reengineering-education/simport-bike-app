import TrackWrapper from '@/components/Tracks/track-wrapper'
import Spinner from '@/components/ui/Spinner'
import { useTrack } from '@/lib/db/hooks'
import { formatDuration, intervalToDuration } from 'date-fns'
import { Navbar } from './navbar'

export default function TracksPage() {
  const { tracks, loading } = useTrack()

  return (
    <div className="flex h-full w-full flex-col pt-safe">
      <header>
        <Navbar />
      </header>
      <div className="flex-1 overflow-scroll p-4 pb-safe">
        {loading && <Spinner />}
        {tracks.map(track => (
          <div key={track.id}>
            {formatDuration(
              intervalToDuration({
                start: track.start,
                end: track.end ?? new Date(),
              }),
            )}
            <div>{JSON.stringify(track.measurements, null, 2)}</div>
          </div>
        ))}
        <TrackWrapper />
      </div>
    </div>
  )
}
