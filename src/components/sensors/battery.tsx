import BatterySensor from '@/lib/sensors/battery'
import { Sensor } from '.'
import SensorView from './sensor-view'

const battery: Sensor = {
  uuid: BatterySensor.BLE_CHARACTERISTIC,
  Component: (
    <SensorView
      characteristic={BatterySensor.BLE_CHARACTERISTIC}
      rawValueToValue={value => value.measurement[0]}
      rawHistoryValuesToData={values =>
        values.map(v => ({
          x: v.timestamp,
          y: v.measurement[0],
        }))
      }
      name={'battery'}
      unit={'%'}
      chartProps={{
        index: 'x',
        categories: ['y'],
      }}
    />
  ),
}

export default battery
