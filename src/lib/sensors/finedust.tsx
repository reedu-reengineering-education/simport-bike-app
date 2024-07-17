import AbstractSensor from './abstract-sensor'
import BaseSensor from './base-sensor'

export default class FinedustSensor<T extends [number, number, number, number]>
  extends BaseSensor<T>
  implements AbstractSensor<T>
{
  public static BLE_CHARACTERISTIC: string =
    '7E14E070-84EA-489F-B45A-E1317364B979'

  public static type: string = 'finedust'
  public static attributes: string[] = ['pm1', 'pm2.5', 'pm4', 'pm10']

  parseData(data: DataView): T {
    const [pm1, pm2_5, pm4, pm10] = this.parsePackages(data)

    return [pm1, pm2_5, pm4, pm10] as T
  }
}
