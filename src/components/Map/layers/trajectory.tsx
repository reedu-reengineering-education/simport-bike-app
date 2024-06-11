import { Geolocation } from '@/lib/db/entities'
import { useTheme } from 'next-themes'
import { Layer, Source } from 'react-map-gl'

export default function TrajectoryLayer({
  trajectory,
}: { trajectory: Geolocation[] }) {
  const { theme } = useTheme()

  return (
    <Source
      data={{
        type: 'LineString',
        coordinates: trajectory.map(t => [t.longitude, t.latitude]),
      }}
      type="geojson"
    >
      <Layer
        id="myTrajectory"
        type="line"
        layout={{
          'line-join': 'round',
          'line-cap': 'round',
        }}
        paint={{
          'line-color': theme === 'dark' ? 'white' : '#0000ff',
          'line-width': 4,
          'line-emissive-strength': 1,
        }}
      />
    </Source>
  )
}
