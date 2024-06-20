import SoundSensor from '@/lib/sensors/sound'
import { Sensor } from '.'
import SensorView from './sensor-view'

const sound: Sensor = {
  uuid: SoundSensor.BLE_CHARACTERISTIC,
  Component: (
    <SensorView
      characteristic={SoundSensor.BLE_CHARACTERISTIC}
      rawValueToValue={value => value.measurement[0]}
      rawHistoryValuesToData={values =>
        values.map(v => ({
          x: v.timestamp,
          y: v.measurement[0],
        }))
      }
      name={'Loudness'}
      unit={''}
      chartProps={{
        index: 'x',
        categories: ['y'],
      }}
    />
  ),
}

export default sound
