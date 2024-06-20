import AbstractSensor from './abstract-sensor'
import BaseSensor from './base-sensor'

export default class SoundSensor<T extends [number]>
  extends BaseSensor<T>
  implements AbstractSensor<T>
{
  public static BLE_CHARACTERISTIC: string =
    'B0221EB3-60F9-4842-9086-62EBBFFD3C6E'

  public static type: string = 'sound'

  parseData(data: DataView): T {
    const [sound] = this.parsePackages(data)

    return [sound] as T
  }
}
