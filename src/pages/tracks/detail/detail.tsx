import { trackDetailRoute } from '@/App'
import InteractiveMap from '@/components/Map/Map'
import TrajectoryLayer from '@/components/Map/layers/trajectory'
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
import { BaseExporter } from '@/lib/exporter/BaseExporter'
import { CSVExporter } from '@/lib/exporter/CSVExporter'
import { MultiFileExporter } from '@/lib/exporter/MultiFileExporter'
import { Link, useNavigate } from '@tanstack/react-router'
import { buffer, bbox, featureCollection, point } from '@turf/turf'
import { format } from 'date-fns'
import { HomeIcon } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { MapRef } from 'react-map-gl'
import { Navbar } from '../navbar'

export default function TrackDetailPage() {
  const { trackId } = trackDetailRoute.useParams()

  const { track, trajectory, loading, deleteTrack } = useTrack(trackId)

  const navigate = useNavigate({ from: '/tracks/$trackId' })

  const mapRef = useRef<MapRef>(null)

  useEffect(() => {
    if (!trajectory) return
    if (!mapRef.current) return

    const bounds = bbox(
      buffer(
        featureCollection(
          trajectory?.map(value => point([value.longitude, value.latitude])) ??
            [],
        ),
        0.01,
      ),
    )

    mapRef.current?.fitBounds([bounds[0], bounds[1], bounds[2], bounds[3]], {
      animate: false,
      padding: 12,
      pitch: 30,
    })
  }, [trajectory])

  const handleExport = async (exporter: typeof BaseExporter) => {
    try {
      const Exporter = new exporter(trackId)
      await Exporter.export()
    } catch (error) {
      console.error(error)
    }
  }

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
      <div className="overflow-scroll p-4 pb-safe grid gap-2">
        <div className="h-80 rounded-md overflow-hidden">
          <InteractiveMap ref={mapRef}>
            {trajectory && trajectory.length > 0 && (
              <TrajectoryLayer trajectory={trajectory} />
            )}
          </InteractiveMap>
        </div>
        {loading && <Spinner />}
        {!track && !loading && (
          <div>
            Track not found
            <Link to="/tracks">Tracks</Link>
          </div>
        )}
        <Button
          onClick={() => {
            handleExport(CSVExporter)
          }}
        >
          Export (CSV)
        </Button>
        <Button
          onClick={() => {
            handleExport(MultiFileExporter)
          }}
        >
          Export (MultiFile)
        </Button>
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
