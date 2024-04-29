import AccelerometerSensor from './accelerometer'
import BaseSensor from './base-sensor'
import OvertakingPredictionSensor from './overtaking-prediction'
import UltrasonicDistanceSensor from './ultrasonic-distance'

export const characteristicRegistry: Record<
  string,
  typeof BaseSensor<number[]>
> = {
  [AccelerometerSensor.BLE_CHARACTERISTIC]: AccelerometerSensor,
  [UltrasonicDistanceSensor.BLE_CHARACTERISTIC]: UltrasonicDistanceSensor,
  [OvertakingPredictionSensor.BLE_CHARACTERISTIC]: OvertakingPredictionSensor,
}
