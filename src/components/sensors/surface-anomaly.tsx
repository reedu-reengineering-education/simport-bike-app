import SurfaceAnomalySensor from '@/lib/sensors/surface-anomaly'
import { Sensor } from '.'
import SensorView from './sensor-view'

const surfaceAnomaly: Sensor = {
  uuid: SurfaceAnomalySensor.BLE_CHARACTERISTIC,
  Component: (
    <SensorView
      characteristic={SurfaceAnomalySensor.BLE_CHARACTERISTIC}
      rawValueToValue={value => value.measurement[0]}
      rawHistoryValuesToData={values =>
        values.map(v => ({ x: v.timestamp, y: v.measurement[0] }))
      }
      name={'surface-anomaly'}
      unit={''}
      chartProps={{
        index: 'x',
        categories: ['y'],
      }}
    />
  ),
}

export default surfaceAnomaly
