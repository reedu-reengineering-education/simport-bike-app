import AccelerometerSensor from './accelerometer'
import BaseSensor from './base-sensor'
import BatterySensor from './battery'
import FinedustSensor from './finedust'
import GPSSensor from './gps'
import HumiditySensor from './humidity'
import OvertakingPredictionSensor from './overtaking-prediction'
import SurfaceAnomalySensor from './surface-anomaly'
import TemperatureSensor from './temperature'
import UltrasonicDistanceSensor from './ultrasonic-distance'

// This is a list of all sensors that are available in the application.
const sensors = [
  TemperatureSensor,
  HumiditySensor,
  AccelerometerSensor,
  UltrasonicDistanceSensor,
  OvertakingPredictionSensor,
  FinedustSensor,
  BatterySensor,
  SurfaceAnomalySensor,
  GPSSensor,
]

export const characteristicRegistry: Record<
  string,
  typeof BaseSensor<number[]>
> = sensors.reduce(
  (acc, sensor) => ({ ...acc, [sensor.BLE_CHARACTERISTIC]: sensor }),
  {},
)
