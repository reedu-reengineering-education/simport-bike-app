import AccelerometerSensor from '@/lib/sensors/accelerometer'
import { Sensor } from '.'
import SensorView from './sensor-view'

const accelerometer: Sensor = {
  uuid: AccelerometerSensor.BLE_CHARACTERISTIC,
  Component: (
    <SensorView
      characteristic={AccelerometerSensor.BLE_CHARACTERISTIC}
      rawValueToValue={({ measurement }) => [
        measurement[0] as number,
        measurement[1] as number,
        measurement[2] as number,
      ]}
      rawHistoryValuesToData={values =>
        values.map(v => ({
          x: v.timestamp,
          acceleration_x: v.measurement[0],
          acceleration_y: v.measurement[1],
          acceleration_z: v.measurement[2],
        }))
      }
      name={'accelerometer'}
      unit={'m/s²'}
      labels={['X', 'Y', 'Z']}
      chartProps={{
        index: 'x',
        categories: ['acceleration_x', 'acceleration_y', 'acceleration_z'],
        colors: ['blue', 'cyan', 'amber', 'violet'],
      }}
    />
  ),
}

export default accelerometer
