import { Geolocation } from '@/lib/db/entities'
import { useTheme } from 'next-themes'
import { Layer, Source } from 'react-map-gl'

export default function TrajectoryLayer({
  trajectory,
}: { trajectory: Geolocation[] }) {
  const { theme } = useTheme()

  if (!trajectory) return null

  return (
    <>
      <Source
        data={{
          type: 'Point',
          coordinates: [
            trajectory.at(-1)?.longitude ?? 0,
            trajectory.at(-1)?.latitude ?? 0,
          ],
        }}
        type="geojson"
      >
        <Layer
          type="circle"
          paint={{
            'circle-radius': 8,
            'circle-color': theme === 'dark' ? '#ff00ff' : '#0000ff',
            'circle-opacity': 1,
            'circle-emissive-strength': 1,
            'circle-stroke-color': 'white',
            'circle-stroke-width': 2,
            'circle-pitch-alignment': 'map',
          }}
        />
      </Source>
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
    </>
  )
}
