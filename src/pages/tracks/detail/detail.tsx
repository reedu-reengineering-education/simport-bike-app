import { trackDetailRoute } from '@/App'
import InteractiveMap from '@/components/Map/Map'
import TrajectoryLayer from '@/components/Map/layers/trajectory'
import { AnimateIn } from '@/components/animated/animate-in'
import { AreaChart } from '@/components/charts/area-chart'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { useMeasurements } from '@/lib/db/hooks/useMeasurements'
import { useTrack } from '@/lib/db/hooks/useTrack'
import { BaseExporter } from '@/lib/exporter/BaseExporter'
import { CSVExporter } from '@/lib/exporter/CSVExporter'
import { MultiFileExporter } from '@/lib/exporter/MultiFileExporter'
import { Link, useNavigate } from '@tanstack/react-router'
import { buffer, bbox, featureCollection, point } from '@turf/turf'
import { format } from 'date-fns'
import { FileDownIcon, HomeIcon, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MapRef } from 'react-map-gl'
import { Navbar } from '../navbar'

export default function TrackDetailPage() {
  const { trackId } = trackDetailRoute.useParams()

  const { track, loading, deleteTrack, measurementTypes } = useTrack(trackId)
  const { measurements } = useMeasurements(trackId)

  const [isExporting, setIsExporting] = useState(false)

  const navigate = useNavigate({ from: '/tracks/$trackId' })

  const mapRef = useRef<MapRef>(null)

  // const [selectedTimestamp, setSelectedTimestamp] = useState<Date>()

  const { t } = useTranslation('translation')

  useEffect(() => {
    if (!track?.geolocations) return
    if (!mapRef.current) return

    const bounds = bbox(
      buffer(
        featureCollection(
          track.geolocations?.map(value =>
            point([value.longitude, value.latitude]),
          ) ?? [],
        ),
        0.01,
      ),
    )

    mapRef.current?.fitBounds([bounds[0], bounds[1], bounds[2], bounds[3]], {
      animate: false,
      padding: 12,
      pitch: 30,
    })
  }, [track?.geolocations])

  const handleExport = async (exporter: typeof BaseExporter) => {
    try {
      setIsExporting(true)
      const Exporter = new exporter(trackId)
      await Exporter.export()
    } catch (error) {
      // @ts-ignore
      console.error(error?.message)
      toast({
        variant: 'destructive',
        title: t('tracks.download-failed'),
        // @ts-ignore
        description: error?.message,
      })
    } finally {
      setIsExporting(false)
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
                    <Link to="/tracks">{t('tracks.title')}</Link>
                  </BreadcrumbLink>
                </AnimateIn>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <AnimateIn delay={500}>
                  <BreadcrumbPage>
                    {track ? (
                      format(track!.start, 'PPpp')
                    ) : (
                      <p>{t('tracks.loading')}</p>
                    )}
                  </BreadcrumbPage>
                </AnimateIn>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Navbar>
      </header>
      <div className="overflow-scroll p-4 pb-safe-or-4 grid gap-8">
        <div className="h-80 rounded-md overflow-hidden">
          <InteractiveMap ref={mapRef}>
            {track?.geolocations && track.geolocations.length > 0 && (
              <TrajectoryLayer
                trajectory={track.geolocations}
                // selectedTimestamp={selectedTimestamp}
              />
            )}
          </InteractiveMap>
        </div>
        {loading && <Spinner />}
        {!track && !loading && (
          <div>
            {t('tracks.not-found')}
            <Link to="/tracks">{t('tracks.title')}</Link>
          </div>
        )}

        <div className="grid gap-8">
          {measurementTypes.map(({ type, attributes }) => (
            <div key={type} className="grid gap-2">
              <p className="font-semibold text-sm">{t(`phenomena.${type}`)}</p>
              <div className="bg-muted px-2 py-1 rounded-md w-full h-32">
                <AreaChart
                  data={measurements
                    .filter(e => e.type === type)
                    .map(e => {
                      if (!attributes) return { x: e.timestamp, y: e.value }
                      return {
                        x: e.timestamp,
                        [e.attribute!]: e.value,
                      }
                    })}
                  categories={[...(attributes ?? 'y')]}
                  index={'x'}
                  showXAxis={false}
                  showYAxis={false}
                  showLegend={!!attributes}
                  // valueFormatter={e => e.toFixed(2)}
                  showTooltip={false}
                  // tooltipCallback={e => {
                  //   const x = e?.payload[0]?.payload?.x
                  //   if (!x) {
                  //     setSelectedTimestamp(undefined)
                  //     return
                  //   }

                  //   setSelectedTimestamp(new Date(x))
                  // }}
                />
              </div>
            </div>
          ))}
        </div>

        <Separator />
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={isExporting} className="flex-1">
                {isExporting && (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('tracks.download-loading')}
                  </>
                )}
                {!isExporting && (
                  <>
                    {t('tracks.download')} <FileDownIcon className="h-4 ml-2" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top">
              <DropdownMenuItem onClick={() => handleExport(CSVExporter)}>
                CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport(MultiFileExporter)}>
                Multi File
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={'destructive'} className="w-full flex-1">
                {t('tracks.delete')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t('tracks.delete-confirmation')}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t('tracks.delete-confirmation-description')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('tracks.cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    await deleteTrack(trackId)
                    navigate({
                      to: '/tracks',
                    })
                  }}
                >
                  {t('tracks.delete')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}
