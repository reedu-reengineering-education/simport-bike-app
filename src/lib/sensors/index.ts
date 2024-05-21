import AccelerometerSensor from './accelerometer'
import BaseSensor from './base-sensor'
import OvertakingPredictionSensor from './overtaking-prediction'
import ToFSensor from './tof'
import UltrasonicDistanceSensor from './ultrasonic-distance'

export const characteristicRegistry: Record<
  string,
  typeof BaseSensor<number[]> | typeof ToFSensor
> = {
  [AccelerometerSensor.BLE_CHARACTERISTIC]: AccelerometerSensor,
  [UltrasonicDistanceSensor.BLE_CHARACTERISTIC]: UltrasonicDistanceSensor,
  [OvertakingPredictionSensor.BLE_CHARACTERISTIC]: OvertakingPredictionSensor,
  [ToFSensor.BLE_CHARACTERISTIC]: ToFSensor,
}
