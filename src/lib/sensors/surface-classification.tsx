import AbstractSensor from './abstract-sensor'
import BaseSensor from './base-sensor'

export default class SurfaceClassificationSensor<
    T extends [number, number, number, number, number],
  >
  extends BaseSensor<T>
  implements AbstractSensor<T>
{
  public static BLE_CHARACTERISTIC: string =
    'B944AF10-F495-4560-968F-2F0D18CAB521'

  public static type: string = 'surface_classification'
  public static attributes: string[] = [
    'asphalt',
    'compacted',
    'paving',
    'sett',
    'standing',
  ]

  parseData(data: DataView): T {
    const [asphalt, compacted, paving, sett, standing] =
      this.parsePackages(data)

    return [asphalt, compacted, paving, sett, standing] as T
  }
}
