import { UploadData } from './api/openSenseMapClient'
import { BoxEntity } from './store/useAuthStore'
import { senseBoxDataRecord } from './store/useSenseBoxValuesStore'

function getSensorKeyFromTitle(
  title: string,
):
  | keyof Pick<
      senseBoxDataRecord,
      | 'temperature'
      | 'humidity'
      | 'pm10'
      | 'pm4'
      | 'pm2_5'
      | 'pm1'
      | 'acceleration_x'
      | 'acceleration_y'
      | 'acceleration_z'
      | 'gps_spd'
      | 'distance_l'
    >
  | undefined {
  const lowerCaseTitle = title.toLowerCase()

  if (lowerCaseTitle.includes('temp')) return 'temperature'
  if (lowerCaseTitle.includes('luftfe')) return 'humidity'
  if (lowerCaseTitle.includes('pm10')) return 'pm10'
  if (lowerCaseTitle.includes('pm4')) return 'pm4'
  if (lowerCaseTitle.includes('pm2')) return 'pm2_5'
  if (lowerCaseTitle.includes('pm1')) return 'pm1'
  if (lowerCaseTitle.includes('distan')) return 'distance_l'
  if (lowerCaseTitle.includes('x')) return 'acceleration_x'
  if (lowerCaseTitle.includes('y')) return 'acceleration_y'
  if (lowerCaseTitle.includes('z')) return 'acceleration_z'
  if (lowerCaseTitle.includes('geschwin')) return 'gps_spd'
}

export default function match(senseBox: BoxEntity, data: senseBoxDataRecord) {
  return senseBox.sensors.reduce<
    {
      sensor: string
      value: number
      createdAt: string
      location: { lng: number; lat: number }
    }[]
  >((acc, sensor) => {
    const key = getSensorKeyFromTitle(sensor.title)
    if (key && data.gps_lat && data.gps_lng) {
      acc.push({
        sensor: sensor._id,
        value: data[key] ?? -1,
        createdAt: data.timestamp.toISOString(),
        location: { lng: data.gps_lng, lat: data.gps_lat },
      })
    }
    return acc
  }, [])

  //   return senseBox.sensors.reduce((acc, sensor) => {
  //     const key = getSensorKeyFromTitle(sensor.title)
  //     if (key && data.gps_lat && data.gps_lng) {
  //       acc[sensor._id] = [
  //         data[key] ?? -1,
  //         data.timestamp.toISOString(),
  //         [data.gps_lng, data.gps_lat],
  //       ]
  //     }
  //     return acc
  //   }, {} as UploadData)
}
