import AbstractSensor from './abstract-sensor'
import BaseSensor from './base-sensor'

export default class SurfaceAnomalySensor<T extends [number]>
  extends BaseSensor<T>
  implements AbstractSensor<T>
{
  public static BLE_CHARACTERISTIC: string =
    'B944AF10-F495-4560-968F-2F0D18CAB523'

  public static type: string = 'surface-anomaly'

  parseData(data: DataView): T {
    const [surfaceAnomaly] = this.parsePackages(data)

    return [surfaceAnomaly] as T
  }
}
