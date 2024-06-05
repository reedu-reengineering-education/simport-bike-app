import { trackDetailRoute } from '@/App'
import InteractiveMap from '@/components/Map/Map'
import { AnimateIn } from '@/components/animated/animate-in'
import Spinner from '@/components/ui/Spinner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { useTrack } from '@/lib/db/hooks/useTrack'
import { Link, useNavigate } from '@tanstack/react-router'
import { format } from 'date-fns'
import { HomeIcon } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Layer, MapRef, Source } from 'react-map-gl'
import { Navbar } from '../navbar'

export default function TrackDetailPage() {
  const { trackId } = trackDetailRoute.useParams()

  const { track, loading, deleteTrack } = useTrack(trackId)

  const navigate = useNavigate({ from: '/tracks/$trackId' })

  const mapRef = useRef<MapRef>(null)

  useEffect(() => {
    if (!track) return
    if (!mapRef.current) return

    // const bounds = bbox(
    //   buffer(
    //     featureCollection(
    //       track?.geolocations?.map(value =>
    //         point([value.longitude, value.latitude]),
    //       ) ?? [],
    //     ),
    //     0.01,
    //   ),
    // )

    // mapRef.current?.fitBounds([bounds[0], bounds[1], bounds[2], bounds[3]])
  }, [track])

  return (
    <div className="flex h-full w-full flex-col pt-safe">
      <header>
        <Navbar>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">
                    <HomeIcon className="h-4" />
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <AnimateIn>
                  <BreadcrumbLink asChild>
                    <Link to="/tracks">Tracks</Link>
                  </BreadcrumbLink>
                </AnimateIn>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <AnimateIn delay={500}>
                  <BreadcrumbPage>
                    {track ? format(track!.start, 'PPpp') : <p>Loading...</p>}
                  </BreadcrumbPage>
                </AnimateIn>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Navbar>
      </header>
      <div className="flex-1 overflow-scroll p-4 pb-safe">
        <div className="h-80 rounded-md overflow-hidden">
          <InteractiveMap ref={mapRef}>
            {track?.geolocations && (
              <Source
                id="location-history"
                type="geojson"
                data={{
                  type: 'LineString',
                  coordinates:
                    track?.geolocations?.map(value => [
                      value.longitude,
                      value.latitude,
                    ]) ?? [],
                }}
              >
                <Layer
                  id="history"
                  type="line"
                  paint={{
                    'line-color': '#007cbf',
                    'line-width': 2,
                  }}
                />
              </Source>
            )}
          </InteractiveMap>
        </div>
        {!track && loading && <Spinner />}
        {!track && !loading && (
          <div>
            Track not found
            <Link to="/tracks">Tracks</Link>
          </div>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={'destructive'} className="w-full">
              Löschen
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  await deleteTrack(trackId)
                  navigate({
                    to: '/tracks',
                  })
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
