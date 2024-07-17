import { BleClient } from '@capacitor-community/bluetooth-le'
import { Measurement } from '../db/entities'
import senseBoxBikeDataSource from '../db/sources/senseBoxBikeDataSource'
import { useRawBLEDataStore } from '../store/use-raw-data-store'
import { useBLEStore } from '../store/useBLEStore'
import { useTrackRecordStore } from '../store/useTrackRecordStore'
import AbstractSensor from './abstract-sensor'

export const BLE_SENSEBOX_SERVICE = 'CF06A218-F68E-E0BE-AD04-8EBC1EB0BC84'

export default class BaseSensor<T extends number[]>
  implements AbstractSensor<T>
{
  measurementsBuffer: Measurement[] = []
  measurementsInterval: NodeJS.Timeout | undefined

  parseData(_data: DataView): T {
    throw new Error('Method not implemented.')
  }

  async subscribe() {
    const deviceId = useBLEStore.getState().device?.deviceId
    if (!deviceId) {
      throw new Error('No device connected')
    }

    const characteristic = (this.constructor as any).BLE_CHARACTERISTIC
    const type = (this.constructor as any).type
    const attributes = (this.constructor as any).attributes || [null]

    if (type == 'battery') {
      console.log('Battery sensor')
      console.log(characteristic)
      console.log(BLE_SENSEBOX_SERVICE)
    }

    // save measurements at a random interval between 5 and 15 seconds
    const saveInterval = Math.floor(Math.random() * 10000) + 5000
    this.measurementsInterval = setInterval(() => {
      this.saveMeasurements()
    }, saveInterval)

    await BleClient.startNotifications(
      deviceId,
      BLE_SENSEBOX_SERVICE,
      characteristic,
      async value => {
        const rawData = this.parseData(value)

        useRawBLEDataStore.getState().addRawBLESensorData(characteristic, {
          measurement: rawData,
          timestamp: new Date(),
        })

        const trackId = useTrackRecordStore.getState().currentTrackId

        if (!trackId) {
          // we are not recording a track, so we don't need to save the data
          return
        }

        if (rawData.length === attributes.length) {
          const values = rawData as number[]

          for (let i = 0; i < attributes.length; i++) {
            const measurement = new Measurement()
            measurement.timestamp = new Date()
            measurement.type = type
            measurement.value = values[i]
            measurement.attribute = attributes[i]
            measurement.trackId = trackId

            this.measurementsBuffer.push(measurement)
          }
        } else {
          throw new Error(
            `Data length (${rawData.length}) does not match attributes length (${attributes.length})`,
          )
        }
      },
    )
  }

  async unsubscribe() {
    if (this.measurementsInterval) {
      clearInterval(this.measurementsInterval)
    }
    this.saveMeasurements()
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

  private async saveMeasurements() {
    if (this.measurementsBuffer.length === 0) {
      return
    }

    await senseBoxBikeDataSource.dataSource.transaction(async manager => {
      for (const measurement of this.measurementsBuffer) {
        await manager.save(measurement)
      }
    })
    this.measurementsBuffer = []
  }
}
