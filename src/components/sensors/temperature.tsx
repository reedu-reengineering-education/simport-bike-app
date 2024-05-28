import TemperatureSensor from '@/lib/sensors/temperature'
import { Sensor } from '.'
import SensorView from './sensor-view'

const temperature: Sensor = {
  uuid: TemperatureSensor.BLE_CHARACTERISTIC,
  Component: (
    <SensorView
      characteristic={TemperatureSensor.BLE_CHARACTERISTIC}
      rawValueToValue={value => value.measurement[0]}
      rawHistoryValuesToData={values =>
        values.map(v => ({ x: v.timestamp, y: v.measurement[0] }))
      }
      name={'Temperatur'}
      unit={'°C'}
      chartProps={{
        index: 'x',
        categories: ['y'],
      }}
    />
  ),
}

export default temperature
