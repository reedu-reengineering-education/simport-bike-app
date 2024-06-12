import OvertakingPredictionSensor from '@/lib/sensors/overtaking-prediction'
import { Sensor } from '.'
import SensorView from './sensor-view'

const overtaking: Sensor = {
  uuid: OvertakingPredictionSensor.BLE_CHARACTERISTIC,
  Component: (
    <SensorView
      characteristic={OvertakingPredictionSensor.BLE_CHARACTERISTIC}
      rawValueToValue={value => (value.measurement[0] as number) * 100}
      rawHistoryValuesToData={values =>
        values.map(v => ({
          x: v.timestamp,
          y: (v.measurement[0] as number) * 100,
        }))
      }
      name={'Überholvorgang'}
      unit={'%'}
      chartProps={{
        index: 'x',
        categories: ['y'],
        maxValue: 100,
        minValue: 0,
      }}
    />
  ),
}

export default overtaking
