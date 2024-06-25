import { useTrack } from '@/lib/db/hooks/useTrack'
import polyline from '@mapbox/polyline'
import { Link } from '@tanstack/react-router'
import { format, formatDuration, intervalToDuration } from 'date-fns'
import { useTheme } from 'next-themes'

export default function TrackPreview({ trackId }: { trackId: string }) {
  const { track, measurementTypes } = useTrack(trackId)
  const { theme } = useTheme()

  if (!track) return null

  const encodedPolyline = encodeURIComponent(
    polyline.encode(track?.geolocations.map(g => [g.latitude, g.longitude])),
  )

  const mapStyle = theme === 'dark' ? 'dark-v11' : 'streets-v12'
  const lineColor = theme === 'dark' ? 'fff' : '00f'

  return (
    <Link to={`/tracks/${track.id}`}>
      <div className="grid gap-2">
        <h1 className="font-bold text-xl">{format(track.start, 'PPp')}</h1>
        <p className="text-sm">
          {formatDuration(
            intervalToDuration({
              start: track.start,
              end: track.end ?? new Date(),
            }),
            {
              format: ['hours', 'minutes', 'seconds'],
            },
          )}
        </p>
        <div className="flex gap-2 overflow-x-scroll">
          {measurementTypes.map(({ type }) => (
            <span key={type} className="text-xs bg-muted px-2 py-1 rounded-md">
              {type}
            </span>
          ))}
        </div>
        <div className="w-full aspect-video rounded-md overflow-hidden">
          <img
            src={`https://api.mapbox.com/styles/v1/mapbox/${mapStyle}/static/path-5+${lineColor}-0.7(${encodedPolyline})/auto/800x450?access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`}
          />
        </div>
      </div>
    </Link>
  )
}
