import AbstractSensor from './abstract-sensor'
import BaseSensor from './base-sensor'

export default class GPSSensor<T extends [number, number, number]>
  extends BaseSensor<T>
  implements AbstractSensor<T>
{
  public static BLE_CHARACTERISTIC: string =
    '8EDF8EBB-1246-4329-928D-EE0C91DB2389'

  public static type: string = 'gps'
  public static attributes: string[] = ['latitude', 'longitude', 'speed']

  parseData(data: DataView): T {
    const [latitude, longitude, speed] = this.parsePackages(data)

    return [latitude, longitude, speed] as T
  }
}
