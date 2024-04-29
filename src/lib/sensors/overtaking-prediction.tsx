import BaseSensor from './base-sensor'

export default class OvertakingPredictionSensor<
  T extends [number],
> extends BaseSensor<T> {
  public static BLE_CHARACTERISTIC: string =
    'FC01C688-2C44-4965-AE18-373AF9FED18D'

  parseData(data: DataView): T {
    const [prediction] = this.parsePackages(data)

    return [prediction] as T
  }
}
