import {
  senseBoxDataRecord,
  useSenseBoxValuesStore,
} from './store/useSenseBoxValuesStore'
import { useTrackRecordStore } from './store/useTrackRecordStore'
import { useUploadStore } from './store/useUploadStore'

export class SenseBoxDataParser {
  private static instance: SenseBoxDataParser

  private dataBuffer: senseBoxDataRecord[] = []
  private timestampInterval: number

  constructor(interval: number) {
    this.timestampInterval = interval
  }

  // Singleton
  static getInstance(interval: number) {
    if (!SenseBoxDataParser.instance) {
      SenseBoxDataParser.instance = new SenseBoxDataParser(interval)
    }

    const instance = SenseBoxDataParser.instance
    instance.setTimestampInterval(interval)
    return instance
  }

  getTimestampInterval() {
    return this.timestampInterval
  }

  setTimestampInterval(interval: number) {
    this.timestampInterval = interval
  }

  async checkCompleteData() {
    if (this.dataBuffer.length < 5) return

    // merge the data by timestamp
    const buckets = this.dataBuffer
      .reduce((acc, record) => {
        const { timestamp, ...data } = record

        // check if there is already a record with similar timestamp
        const existingTimestamp = acc.find(
          e =>
            Math.abs(new Date(e.timestamp).getTime() - timestamp.getTime()) <
            this.timestampInterval,
        ) // 5 seconds

        // add new record or update existing one
        if (!existingTimestamp) {
          acc.push({ timestamp, ...data })
        } else {
          const existingIndex = acc.indexOf(existingTimestamp)
          acc[existingIndex] = {
            ...existingTimestamp,
            ...data,
          }
        }

        return acc
      }, [] as senseBoxDataRecord[])
      .filter(
        b =>
          b.temperature !== undefined &&
          b.humidity !== undefined &&
          b.pm1 !== undefined &&
          b.pm2_5 !== undefined &&
          b.pm4 !== undefined &&
          b.pm10 !== undefined &&
          b.acceleration_x !== undefined &&
          b.acceleration_y !== undefined &&
          b.acceleration_z !== undefined &&
          b.gps_lat !== undefined &&
          b.gps_lng !== undefined &&
          b.gps_spd !== undefined &&
          b.distance_l !== undefined,
      )

    useSenseBoxValuesStore.getState().addValues(buckets)
    if (useUploadStore.getState().isRecording) {
      useTrackRecordStore.getState().addMeasurements(buckets)
    }

    const completeTimestamps = buckets.map(b => b.timestamp)

    // remove all data that is already complete
    this.dataBuffer = this.dataBuffer.filter(
      d =>
        !completeTimestamps.some(
          t =>
            Math.abs(t.getTime() - d.timestamp.getTime()) <
            this.timestampInterval,
        ),
    )
  }

  pushData(data: Omit<senseBoxDataRecord, 'timestamp'>) {
    this.dataBuffer.push({
      ...data,
      timestamp: new Date(),
    })

    this.checkCompleteData()
  }
}
