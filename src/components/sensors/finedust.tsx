import FinedustSensor from '@/lib/sensors/finedust'
import { Sensor } from '.'
import SensorView from './sensor-view'

const finedust: Sensor = {
  uuid: FinedustSensor.BLE_CHARACTERISTIC,
  Component: (
    <SensorView
      characteristic={FinedustSensor.BLE_CHARACTERISTIC}
      rawValueToValue={({ measurement }) => [
        measurement[0] as number,
        measurement[1] as number,
        measurement[2] as number,
        measurement[3] as number,
      ]}
      rawHistoryValuesToData={values =>
        values.map(v => ({
          x: v.timestamp,
          pm1: v.measurement[0],
          pm2_5: v.measurement[1],
          pm4: v.measurement[2],
          pm10: v.measurement[3],
        }))
      }
      name={'finedust'}
      unit={'m/g³'}
      labels={['PM1', 'PM2.5', 'PM4', 'PM10']}
      chartProps={{
        index: 'x',
        categories: ['pm1', 'pm2_5', 'pm4', 'pm10'],
        colors: ['blue', 'cyan', 'amber', 'violet'],
      }}
    />
  ),
}

export default finedust
