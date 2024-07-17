import { numberToUUID } from '@capacitor-community/bluetooth-le'
import AbstractSensor from './abstract-sensor'
import BaseSensor from './base-sensor'

export default class BatterySensor<T extends [number]>
  extends BaseSensor<T>
  implements AbstractSensor<T>
{
  public static BLE_CHARACTERISTIC: string = numberToUUID(0x2a19)
  public static BLE_SENSEBOX_SERVICE = numberToUUID(0x180f)

  public static type: string = 'battery'

  parseData(data: DataView): T {
    const [batteryCharge] = this.parsePackages(data)

    return [batteryCharge] as T
  }
}
