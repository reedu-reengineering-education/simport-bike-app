import AbstractSensor from './abstract-sensor'
import BaseSensor from './base-sensor'

export default class HumiditySensor<T extends [number]>
  extends BaseSensor<T>
  implements AbstractSensor<T>
{
  public static BLE_CHARACTERISTIC: string =
    '772DF7EC-8CDC-4EA9-86AF-410ABE0BA257'

  public static type: string = 'humidity'

  parseData(data: DataView): T {
    const [humidity] = this.parsePackages(data)

    return [humidity] as T
  }
}
