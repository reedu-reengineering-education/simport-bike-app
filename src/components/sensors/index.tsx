import accelerometer from './accelerometer'
import finedust from './finedust'
import humidity from './humidity'
import temperature from './temperature'
import ultrasonic from './ultrasonic-distance-sensor'

export interface Sensor {
  uuid: string
  Component: React.ReactNode
}

// This is a list of all sensors that are available in the application.
const sensors = [temperature, humidity, ultrasonic, accelerometer, finedust]

export const sensorRegistry: Record<string, React.ReactNode> = sensors.reduce(
  (acc, sensor) => ({ ...acc, [sensor.uuid]: sensor.Component }),
  {},
)