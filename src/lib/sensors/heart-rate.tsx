import AbstractSensor from './abstract-sensor'
import BaseSensor from './base-sensor'

export default class HeartRateSensor<T extends [number]>
  extends BaseSensor<T>
  implements AbstractSensor<T>
{
  public static BLE_CHARACTERISTIC: string =
    'E7110FE4-21A4-49E8-9B9A-BAEBD3427E81'

  public static type: string = 'heart-rate'

  parseData(data: DataView): T {
    const [heartRate] = this.parsePackages(data)

    return [heartRate] as T
  }
}
