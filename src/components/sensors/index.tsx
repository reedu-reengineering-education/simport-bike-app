import AccelerometerSensor from '@/lib/sensors/accelerometer'
import OvertakingPredictionSensor from '@/lib/sensors/overtaking-prediction'
import UltrasonicDistanceSensor from '@/lib/sensors/ultrasonic-distance'
import SensorView from './sensor-view'

export const sensorRegistry: Record<string, React.ReactNode> = {
  [UltrasonicDistanceSensor.BLE_CHARACTERISTIC]: (
    <SensorView
      characteristic={UltrasonicDistanceSensor.BLE_CHARACTERISTIC}
      rawValueToValue={value => value.measurement[0]}
      rawHistoryValuesToData={values =>
        values.map(v => ({ x: v.timestamp, y: v.measurement[0] }))
      }
      name={'Distanz'}
      unit={'cm'}
      chartProps={{
        index: 'x',
        categories: ['y'],
      }}
    />
  ),
  [AccelerometerSensor.BLE_CHARACTERISTIC]: (
    <SensorView
      characteristic={AccelerometerSensor.BLE_CHARACTERISTIC}
      rawValueToValue={({ measurement }) => [
        measurement[0],
        measurement[1],
        measurement[2],
      ]}
      rawHistoryValuesToData={values =>
        values.map(v => ({
          x: v.timestamp,
          acceleration_x: v.measurement[0],
          acceleration_y: v.measurement[1],
          acceleration_z: v.measurement[2],
        }))
      }
      name={'Beschleunigung'}
      unit={'m/s²'}
      labels={['X', 'Y', 'Z']}
      chartProps={{
        index: 'x',
        categories: ['acceleration_x', 'acceleration_y', 'acceleration_z'],
        colors: ['indigo', 'cyan', 'amber'],
      }}
    />
  ),
  [OvertakingPredictionSensor.BLE_CHARACTERISTIC]: (
    <SensorView
      characteristic={OvertakingPredictionSensor.BLE_CHARACTERISTIC}
      rawValueToValue={value => value.measurement[0]*100}
      rawHistoryValuesToData={values =>
        values.map(v => ({ x: v.timestamp, y: v.measurement[0]*100, y25: 25, y50: 50, y75: 75, y100: 100  }))
      }
      name={'Overtake Prediction'}
      unit={'%'}
      decimals={0}
      chartProps={{
        index: 'x',
        categories: ['y25', 'y50', 'y75', 'y100', 'y'],
        colors: ['cyan', 'cyan', 'cyan', 'cyan', 'red']
      }}
    />
  ),
}
