import TrackWrapper from '@/components/Tracks/track-wrapper'
import { AnimateIn } from '@/components/animated/animate-in'
import Spinner from '@/components/ui/Spinner'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useTrack } from '@/lib/db/hooks'
import { Link } from '@tanstack/react-router'
import { formatDuration, intervalToDuration } from 'date-fns'
import { HomeIcon } from 'lucide-react'
import { Navbar } from './navbar'

export default function TracksPage() {
  const { tracks, loading } = useTrack()

  return (
    <div className="flex h-full w-full flex-col pt-safe">
      <header>
        <Navbar>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>
                  <Link to="/">
                    <HomeIcon className="h-4" />
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <AnimateIn>
                  <BreadcrumbPage>Tracks</BreadcrumbPage>
                </AnimateIn>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Navbar>
      </header>
      <div className="flex-1 overflow-scroll p-4 pb-safe">
        {loading && <Spinner />}
        {tracks.length === 0 && (
          <div>
            No tracks found. Start tracking by clicking on the button below
          </div>
        )}
        {tracks.map(track => (
          <div key={track.id}>
            {formatDuration(
              intervalToDuration({
                start: track.start,
                end: track.end ?? new Date(),
              }),
            )}
            <div>
              Measurements: {track.measurements.length} (
              {Array.from(new Set(track.measurements.map(m => m.type))).join(
                ', ',
              )}
              )
            </div>
            <div>Geolocations: {track.geolocations.length}</div>
            <Link
              to="/tracks/$trackId"
              params={{
                trackId: track.id,
              }}
            >
              Visit Track
            </Link>
            <p>---</p>
          </div>
        ))}
        <TrackWrapper />
      </div>
    </div>
  )
}
