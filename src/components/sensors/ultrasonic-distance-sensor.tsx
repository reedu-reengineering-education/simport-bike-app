import UltrasonicDistanceSensor from '@/lib/sensors/ultrasonic-distance'
import { Sensor } from '.'
import SensorView from './sensor-view'

const ultrasonic: Sensor = {
  uuid: UltrasonicDistanceSensor.BLE_CHARACTERISTIC,
  Component: (
    <SensorView
      characteristic={UltrasonicDistanceSensor.BLE_CHARACTERISTIC}
      rawValueToValue={value => value.measurement[0]}
      rawHistoryValuesToData={values =>
        values.map(v => ({ x: v.timestamp, y: v.measurement[0] }))
      }
      name={'distance'}
      unit={'cm'}
      chartProps={{
        index: 'x',
        categories: ['y'],
      }}
    />
  ),
}

export default ultrasonic
