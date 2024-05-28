import BaseSensor from './base-sensor'

export default class TemperatureSensor<
  T extends [number],
> extends BaseSensor<T> {
  public static BLE_CHARACTERISTIC: string =
    '2CDF2174-35BE-FDC4-4CA2-6FD173F8B3A8'

  public static type: string = 'temperature'

  parseData(data: DataView): T {
    const [temperature] = this.parsePackages(data)

    return [temperature] as T
  }
}
