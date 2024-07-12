import accelerometer from './accelerometer'
import battery from './battery'
import finedust from './finedust'
import humidity from './humidity'
import overtaking from './overtaking'
import surfaceAnomaly from './surface-anomaly'
import temperature from './temperature'
import ultrasonic from './ultrasonic-distance-sensor'

export interface Sensor {
  uuid: string
  Component: React.ReactNode
}

// This is a list of all sensors that are available in the application.
const sensors = [
  temperature,
  humidity,
  ultrasonic,
  accelerometer,
  finedust,
  overtaking,
  battery,
  surfaceAnomaly,
]

export const sensorRegistry: Record<string, React.ReactNode> = sensors.reduce(
  (acc, sensor) => ({ ...acc, [sensor.uuid]: sensor.Component }),
  {},
)
