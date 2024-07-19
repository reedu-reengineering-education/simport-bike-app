import AbstractSensor from './abstract-sensor'
import BaseSensor from './base-sensor'
export default class AccelerometerSensor<T extends [number, number, number]>
  extends BaseSensor<T>
  implements AbstractSensor<T>
{
  public static BLE_CHARACTERISTIC: string =
    'B944AF10-F495-4560-968F-2F0D18CAB522'

  public static type: string = 'accelerometer'
  public static attributes: string[] = ['x', 'y', 'z']

  parseData(data: DataView): T {
    const [acceleration_x, acceleration_y, acceleration_z] =
      this.parsePackages(data)
    return [acceleration_x, acceleration_y, acceleration_z] as T
  }
}
