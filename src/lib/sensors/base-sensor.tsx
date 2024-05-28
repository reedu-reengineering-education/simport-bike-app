import { BleClient } from '@capacitor-community/bluetooth-le'
import { Measurement } from '../db/entities'
import { useRawBLEDataStore } from '../store/use-raw-data-store'
import { useBLEStore } from '../store/useBLEStore'
import { useTrackRecordStore } from '../store/useTrackRecordStore'
import AbstractSensor from './abstract-sensor'

export const BLE_SENSEBOX_SERVICE = 'CF06A218-F68E-E0BE-AD04-8EBC1EB0BC84'

export default class BaseSensor<T extends number[]> extends AbstractSensor<T> {
  protected BLE_CHARACTERISTIC!: string

  subscribe() {
    console.log((this.constructor as any).BLE_CHARACTERISTIC)
    const deviceId = useBLEStore.getState().device?.deviceId
    if (!deviceId) {
      throw new Error('No device connected')
    }

    BleClient.startNotifications(
      deviceId,
      BLE_SENSEBOX_SERVICE,
      (this.constructor as any).BLE_CHARACTERISTIC,
      value => {
        const rawData = this.parseData(value)

        const trackId = useTrackRecordStore.getState().currentTrackId

        if (!trackId) {
          throw new Error('No track ID')
        }

        if (!BaseSensor.attributes && rawData.length === 1) {
          const [value] = rawData

          const measurement = new Measurement()
          measurement.timestamp = new Date()
          measurement.type = BaseSensor.type
          measurement.value = value
          measurement.track.id = trackId
          measurement.save()
        }

        useRawBLEDataStore
          .getState()
          .addRawBLESensorData((this.constructor as any).BLE_CHARACTERISTIC, {
            measurement: rawData,
            timestamp: new Date(),
          })
      },
    )
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
