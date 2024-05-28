import { trackDetailRoute } from '@/App'
// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import Map from '@/components/Map/Map'
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
import { buffer, bbox, featureCollection, point } from '@turf/turf'
import { format } from 'date-fns'
import { HomeIcon } from 'lucide-react'
import { useRef } from 'react'
import { Layer, Source } from 'react-map-gl'
import { Navbar } from '../navbar'

export default function TrackDetailPage() {
  const { trackId } = trackDetailRoute.useParams()

  const { track, loading } = useTrack(trackId)

  const mapRef = useRef(null)

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
                  <BreadcrumbLink>
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
        {!track && loading && <Spinner />}
        {!track && !loading && (
          <div>
            Track not found
            <Link to="/tracks">Tracks</Link>
          </div>
        )}

        {track && (
          <div className="h-80 rounded-md overflow-hidden">
            <Map
              ref={mapRef}
              initialViewState={{
                bounds: bbox(
                  buffer(
                    featureCollection(
                      track?.geolocations.map(value =>
                        point([value.longitude, value.latitude]),
                      ) ?? [],
                    ),
                    0.01,
                  ),
                ),
              }}
            >
              <Source
                id="location-history"
                type="geojson"
                data={{
                  type: 'LineString',
                  coordinates:
                    track?.geolocations.map(value => [
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
            </Map>
          </div>
        )}
      </div>
    </div>
  )
}
