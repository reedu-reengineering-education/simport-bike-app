import accelerometer from './accelerometer'
import battery from './battery'
import finedust from './finedust'
import heartRate from './heart-rate'
import humidity from './humidity'
import overtaking from './overtaking'
import sound from './sound'
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
  heartRate,
  sound,
]

export const sensorRegistry: Record<string, React.ReactNode> = sensors.reduce(
  (acc, sensor) => ({ ...acc, [sensor.uuid]: sensor.Component }),
  {},
)
