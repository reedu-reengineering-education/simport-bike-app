import AccelerometerSensor from './accelerometer'
import BaseSensor from './base-sensor'
import BatterySensor from './battery'
import FinedustSensor from './finedust'
import HumiditySensor from './humidity'
import OvertakingPredictionSensor from './overtaking-prediction'
import TemperatureSensor from './temperature'
import ToFSensor from './tof'
import UltrasonicDistanceSensor from './ultrasonic-distance'

// This is a list of all sensors that are available in the application.
const sensors = [
  TemperatureSensor,
  HumiditySensor,
  AccelerometerSensor,
  UltrasonicDistanceSensor,
  OvertakingPredictionSensor,
  ToFSensor,
  FinedustSensor,
  BatterySensor,
]

export const characteristicRegistry: Record<
  string,
  typeof BaseSensor<number[]> | typeof ToFSensor
> = sensors.reduce(
  (acc, sensor) => ({ ...acc, [sensor.BLE_CHARACTERISTIC]: sensor }),
  {},
)
