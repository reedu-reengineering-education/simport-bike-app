'use client'

import { useTracksStore } from '@/lib/store/useTracksStore'
import { cn } from '@/lib/utils'
import { format, formatDuration, intervalToDuration, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'
import { ClockIcon, GaugeIcon, RouteIcon, ThermometerIcon } from 'lucide-react'
import 'maplibre-gl/dist/maplibre-gl.css'
import Link from 'next/link'
import { Drawer } from 'vaul'
import LocationHistory from '../Map/LocationHistory'
import Map from '../Map/Map'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import DeleteTrackDialog from './DeleteTrackDialog'
import { getBBox, getDistance } from './track-lib'

export default function TrackWrapper() {
  const { tracks } = useTracksStore()

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
        return (
          <Drawer.Root key={track.id}>
            <Drawer.Trigger asChild>
              <Card className="flex overflow-hidden">
                <div className="default-attribution relative h-40 flex-1">
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
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 z-20 bg-black/60" />
              <Drawer.Content className="fixed bottom-0 left-0 right-0 z-30 mt-24 flex max-h-[85%] flex-col rounded-t-lg border-t bg-background pb-safe focus:outline-none">
                <div className="mx-auto my-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
                <div className="flex-1 overflow-auto rounded-t-[10px] p-4">
                  <div className="mx-auto flex max-w-md flex-col gap-2">
                    <div className="h-60 w-full overflow-hidden rounded-md">
                      <Map
                        interactive={false}
                        initialViewState={{
                          // @ts-ignore
                          bounds: getBBox(track),
                        }}
                      >
                        <LocationHistory values={track.measurements} />
                      </Map>
                    </div>
                    <div>
                      {track.start && track.end && (
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                              Dauer
                            </CardTitle>
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
                    <div className="grid grid-cols-2 gap-2">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Distanz
                          </CardTitle>
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
                          <CardTitle className="text-sm font-medium">
                            Ø Speed
                          </CardTitle>
                          <GaugeIcon className="h-6 w-6" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-bold">
                            {(
                              track.measurements.reduce(
                                (p, c) => p + c.gps_spd!,
                                0,
                              ) / track.measurements.length
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
                              track.measurements.reduce(
                                (p, c) => p + c.temperature!,
                                0,
                              ) / track.measurements.length
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
                          <GaugeIcon className="h-6 w-6" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-bold">
                            {(
                              track.measurements.reduce(
                                (p, c) => p + c.humidity!,
                                0,
                              ) / track.measurements.length
                            ).toFixed(2)}{' '}
                            <span className="text-base font-normal">%</span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Abstand
                          </CardTitle>
                          <RouteIcon className="h-6 w-6" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-bold">
                            {(
                              track.measurements.reduce(
                                (p, c) => p + c.distance_l!,
                                0,
                              ) / track.measurements.length
                            ).toFixed(2)}{' '}
                            <span className="text-base font-normal">cm</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <hr className="my-2" />
                    <DeleteTrackDialog track={track} />
                  </div>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        )
      })}
    </div>
  )
}
