import HumiditySensor from '@/lib/sensors/humidity'
import { Sensor } from '.'
import SensorView from './sensor-view'

const humidity: Sensor = {
  uuid: HumiditySensor.BLE_CHARACTERISTIC,
  Component: (
    <SensorView
      characteristic={HumiditySensor.BLE_CHARACTERISTIC}
      rawValueToValue={value => value.measurement[0]}
      rawHistoryValuesToData={values =>
        values.map(v => ({ x: v.timestamp, y: v.measurement[0] }))
      }
      name={'rel. Luftfeuchte'}
      unit={'%'}
      chartProps={{
        index: 'x',
        categories: ['y'],
      }}
    />
  ),
}

export default humidity
