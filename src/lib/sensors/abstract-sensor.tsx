export default class AbstractSensor<T> {
  public static BLE_CHARACTERISTIC: string

  parseData(_data: DataView): T {
    throw new Error('Method not implemented.')
  }
}
