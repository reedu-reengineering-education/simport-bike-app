import { GISCSVExporter } from '@/lib/export/GISCSVExporter'
import { ITrackExporter } from '@/lib/export/ITrackExporter'
import { OpenSenseMapCSVExporter } from '@/lib/export/OpenSenseMapCSVExporter'
import { OpenSenseMapDirectExporter } from '@/lib/export/OpenSenseMapDirectExporter'
import { Track } from '@/lib/store/useTracksStore'
import { cn } from '@/lib/utils'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { format, formatDuration, intervalToDuration, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'
import {
  ClockIcon,
  DownloadIcon,
  DropletsIcon,
  FileDownIcon,
  GaugeIcon,
  RouteIcon,
  RulerIcon,
  ThermometerIcon,
} from 'lucide-react'
import LocationHistory from '../Map/LocationHistory'
import Map from '../Map/Map'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Drawer, DrawerContent, DrawerTrigger } from '../ui/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { toast } from '../ui/use-toast'
import DeleteTrackDialog from './DeleteTrackDialog'
import { getBBox, getDistance } from './track-lib'

export default function TrackDetail({ track }: { track: Track }) {
  async function handleTrackDownload(exporter: ITrackExporter) {
    try {
      await exporter.exportTrack(track.id)
    } catch (error: any) {
      if (error.message === 'Share canceled') return

      toast({
        title: 'Fehler',
        description: 'Fehler beim Download des Tracks',
      })
    }
  }
  return (
    <Drawer key={track.id}>
      <DrawerTrigger>
        <Card className="flex h-fit overflow-hidden">
          <div className="relative h-40 flex-1">
            <Map
              interactive={false}
              initialViewState={{
                // @ts-ignore
                bounds: getBBox(track),
              }}
            >
              <LocationHistory values={track.measurements} />
            </Map>
            <div className="absolute left-0 top-0 w-fit rounded-br-md bg-background px-4 py-2">
              {format(parseISO(track.start), 'PPpp', {
                locale: de,
              })}
            </div>
          </div>
        </Card>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90%]">
        <div className="mx-auto mt-4 flex h-full max-w-md flex-col gap-2 overflow-scroll pb-safe">
          <div>
            {track.start && track.end && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Dauer</CardTitle>
                  <ClockIcon className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">
                    {formatDuration(
                      intervalToDuration({
                        start: parseISO(track.start),
                        end: parseISO(track.end),
                      }),
                      {
                        locale: de,
                      },
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Start:{' '}
                    {format(parseISO(track.start), 'PPpp', {
                      locale: de,
                    })}
                    <br />
                    Ende:{'   '}
                    {format(parseISO(track.end), 'PPpp', {
                      locale: de,
                    })}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
          <Card className={cn('h-40 w-full rounded-md transition-all')}>
            <Map
              interactive={false}
              initialViewState={{
                // @ts-ignore
                bounds: getBBox(track),
              }}
            >
              <LocationHistory values={track.measurements} />
            </Map>
          </Card>
          <div className="grid grid-cols-2 gap-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Distanz</CardTitle>
                <RouteIcon className="h-6 w-6" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  {getDistance(track).toFixed(2)}{' '}
                  <span className="text-base font-normal">km</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ø Speed</CardTitle>
                <GaugeIcon className="h-6 w-6" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  {(
                    track.measurements.reduce((p, c) => p + c.gps_spd!, 0) /
                    track.measurements.length
                  ).toFixed(2)}{' '}
                  <span className="text-base font-normal">km/h</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Temperatur
                </CardTitle>
                <ThermometerIcon className="h-6 w-6" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  {(
                    track.measurements.reduce((p, c) => p + c.temperature!, 0) /
                    track.measurements.length
                  ).toFixed(2)}{' '}
                  <span className="text-base font-normal">°C</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Luftfeuchte
                </CardTitle>
                <DropletsIcon className="h-6 w-6" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  {(
                    track.measurements.reduce((p, c) => p + c.humidity!, 0) /
                    track.measurements.length
                  ).toFixed(2)}{' '}
                  <span className="text-base font-normal">%</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Abstand</CardTitle>
                <RulerIcon className="h-6 w-6" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  {(
                    track.measurements.reduce((p, c) => p + c.distance_l!, 0) /
                    track.measurements.length
                  ).toFixed(2)}{' '}
                  <span className="text-base font-normal">cm</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <hr className="my-2" />
          <div className="flex w-full flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={'outline'} className="flex-1">
                  <DownloadIcon className="mr-2 h-5" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mx-2">
                <DropdownMenuItem
                  onClick={() =>
                    handleTrackDownload(new OpenSenseMapDirectExporter())
                  }
                >
                  <CloudArrowUpIcon className="mr-2 h-4 w-4" /> openSenseMap
                  Upload
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleTrackDownload(new GISCSVExporter())}
                >
                  <FileDownIcon className="mr-2 h-4 w-4" />
                  CSV Datei (GIS)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleTrackDownload(new OpenSenseMapCSVExporter())
                  }
                >
                  <FileDownIcon className="mr-2 h-4 w-4" />
                  CSV Datei (openSenseMap)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DeleteTrackDialog track={track} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
