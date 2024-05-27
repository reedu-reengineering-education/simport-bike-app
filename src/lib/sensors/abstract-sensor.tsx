export default abstract class AbstractSensor<T> {
  public static BLE_CHARACTERISTIC: string

  public static type: string
  public static attributes?: string[]

  parseData(_data: DataView): T {
    throw new Error('Method not implemented.')
  }
}
