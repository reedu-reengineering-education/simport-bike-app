import HeartRateSensor from '@/lib/sensors/heart-rate'
import { Sensor } from '.'
import SensorView from './sensor-view'

const heartRate: Sensor = {
  uuid: HeartRateSensor.BLE_CHARACTERISTIC,
  Component: (
    <SensorView
      characteristic={HeartRateSensor.BLE_CHARACTERISTIC}
      rawValueToValue={value => value.measurement[0]}
      rawHistoryValuesToData={values =>
        values.map(v => ({
          x: v.timestamp,
          y: v.measurement[0],
        }))
      }
      name={'Heart Rate'}
      unit={'bpm'}
      chartProps={{
        index: 'x',
        categories: ['y'],
      }}
    />
  ),
}

export default heartRate
