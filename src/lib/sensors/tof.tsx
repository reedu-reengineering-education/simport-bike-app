import { BleClient } from '@capacitor-community/bluetooth-le'
import { useBLEStore } from '../store/useBLEStore'
import { BLE_SENSEBOX_SERVICE } from './base-sensor'

type ToFSensorData = [
  [number, number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number, number],
]

export default class ToFSensor {
  public static BLE_CHARACTERISTIC: string =
    '7973afc7-e447-492c-a237-6a08c594b301'
  public static BLE_CHARACTERISTIC02: string =
    '7973afc7-e447-492c-a237-6a08c594b302'
  public static BLE_CHARACTERISTIC03: string =
    '7973afc7-e447-492c-a237-6a08c594b303'
  public static BLE_CHARACTERISTIC04: string =
    '7973afc7-e447-492c-a237-6a08c594b304'
  public static BLE_CHARACTERISTIC05: string =
    '7973afc7-e447-492c-a237-6a08c594b305'
  public static BLE_CHARACTERISTIC06: string =
    '7973afc7-e447-492c-a237-6a08c594b306'
  public static BLE_CHARACTERISTIC07: string =
    '7973afc7-e447-492c-a237-6a08c594b307'
  public static BLE_CHARACTERISTIC08: string =
    '7973afc7-e447-492c-a237-6a08c594b308'
  public static BLE_CHARACTERISTIC09: string =
    '7973afc7-e447-492c-a237-6a08c594b309'
  public static BLE_CHARACTERISTIC10: string =
    '7973afc7-e447-492c-a237-6a08c594b310'
  public static BLE_CHARACTERISTIC11: string =
    '7973afc7-e447-492c-a237-6a08c594b311'
  public static BLE_CHARACTERISTIC12: string =
    '7973afc7-e447-492c-a237-6a08c594b312'
  public static BLE_CHARACTERISTIC13: string =
    '7973afc7-e447-492c-a237-6a08c594b313'
  public static BLE_CHARACTERISTIC14: string =
    '7973afc7-e447-492c-a237-6a08c594b314'
  public static BLE_CHARACTERISTIC15: string =
    '7973afc7-e447-492c-a237-6a08c594b315'
  public static BLE_CHARACTERISTIC16: string =
    '7973afc7-e447-492c-a237-6a08c594b316'

  private tempStore: ToFSensorData = [
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
  ]

  characteristics: string[] = [
    ToFSensor.BLE_CHARACTERISTIC,
    ToFSensor.BLE_CHARACTERISTIC02,
    ToFSensor.BLE_CHARACTERISTIC03,
    ToFSensor.BLE_CHARACTERISTIC04,
    ToFSensor.BLE_CHARACTERISTIC05,
    ToFSensor.BLE_CHARACTERISTIC06,
    ToFSensor.BLE_CHARACTERISTIC07,
    ToFSensor.BLE_CHARACTERISTIC08,
    ToFSensor.BLE_CHARACTERISTIC09,
    ToFSensor.BLE_CHARACTERISTIC10,
    ToFSensor.BLE_CHARACTERISTIC11,
    ToFSensor.BLE_CHARACTERISTIC12,
    ToFSensor.BLE_CHARACTERISTIC13,
    ToFSensor.BLE_CHARACTERISTIC14,
    ToFSensor.BLE_CHARACTERISTIC15,
    ToFSensor.BLE_CHARACTERISTIC16,
  ]

  subscribe(): void {
    const deviceId = useBLEStore.getState().device?.deviceId
    if (!deviceId) {
      throw new Error('No device connected')
    }

    this.characteristics.forEach(characteristic => {
      BleClient.startNotifications(
        deviceId,
        BLE_SENSEBOX_SERVICE,
        characteristic,
        value => {
          const rawData = this.parsePackages(value)
          const isLeft = this.characteristics.indexOf(characteristic) % 2 === 0
          const startIndex = isLeft ? 0 : 4
          const newData =
            this.tempStore[this.characteristics.indexOf(characteristic)]
          for (let i = 0; i < 4; i++) {
            newData[startIndex + i] = rawData[i]
          }
          this.tempStore[this.characteristics.indexOf(characteristic)] = newData
        },
      )
    })
  }

  /**
   * Parses the data received from the SenseBox and returns an array of values.
   * @param data - The data received from the SenseBox as a DataView.
   * @returns An array of values parsed from the data.
   */
  protected parsePackages(data: DataView) {
    const packages = data.byteLength / 4

    const valueRecords: number[] = []
    for (let i = 0; i < packages; i++) {
      valueRecords.push(data.getFloat32(i * 4, true))
    }

    return valueRecords
  }
}
