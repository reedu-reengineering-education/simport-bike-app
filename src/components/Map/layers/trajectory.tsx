import { Geolocation } from '@/lib/db/entities'
import { useTheme } from 'next-themes'
import { Layer, Source } from 'react-map-gl'

export default function TrajectoryLayer({
  trajectory,
  selectedTimestamp,
}: { trajectory: Geolocation[]; selectedTimestamp?: Date }) {
  const { theme } = useTheme()

  if (!trajectory) return null

  let pointPosition = [
    trajectory.at(-1)?.longitude ?? 0,
    trajectory.at(-1)?.latitude ?? 0,
  ]

  if (selectedTimestamp) {
    const selectedPoint = trajectory.find(
      t => t.timestamp.getTime() === selectedTimestamp.getTime(),
    )

    if (selectedPoint) {
      pointPosition = [selectedPoint.longitude, selectedPoint.latitude]
    }
  }

  return (
    <>
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
      <Source
        data={{
          type: 'Point',
          coordinates: pointPosition,
        }}
        type="geojson"
      >
        <Layer
          type="circle"
          paint={{
            'circle-radius': 8,
            'circle-color': theme === 'dark' ? '#14b8a6' : '#0000ff',
            'circle-opacity': 1,
            'circle-emissive-strength': 1,
            'circle-stroke-color': 'white',
            'circle-stroke-width': 2,
            'circle-pitch-alignment': 'map',
          }}
        />
      </Source>
    </>
  )
}
