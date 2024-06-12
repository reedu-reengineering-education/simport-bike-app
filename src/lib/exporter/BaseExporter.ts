import { DataSource, Repository } from 'typeorm'
import { Track } from '../db/entities'
import senseBoxBikeDataSource from '../db/sources/senseBoxBikeDataSource'
import { AbstractExporter } from './AbstractExporter'

export class BaseExporter implements AbstractExporter {
  private connection: DataSource
  protected trackRepository: Repository<Track>

  protected trackId: Track['id']

  constructor(trackId: Track['id']) {
    this.trackId = trackId
  }

  public export(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  protected async getTrackMetadata() {
    await this.initializeConnection()
    const track = await this.trackRepository.findOne({
      where: { id: this.trackId },
    })

    return track
  }

  protected async fetchTrackMerge() {
    await this.initializeConnection()

    const typeAttributePairs = await this.connection.query<
      {
        type: string
        attribute?: string
      }[]
    >(`SELECT DISTINCT type, attribute FROM measurement WHERE trackId = $1`, [
      this.trackId,
    ])

    const selectClauses = typeAttributePairs.map(({ type, attribute }) => {
      if (attribute) {
        return `MAX(CASE WHEN type = '${type}' AND attribute = '${attribute}' THEN value ELSE NULL END) as ${type}_${attribute.replace(
          '.',
          '_',
        )}`
      }
      return `MAX(CASE WHEN type = '${type}' THEN value ELSE NULL END) as ${type}`
    })

    return await this.connection.query(
      `
      SELECT * FROM (
        SELECT
          timestamp,
          MAX(latitude) AS latitude,
          MAX(longitude) AS longitude,
          MAX(speed) AS speed,
          ${selectClauses.join(',\n')}
        FROM (
          SELECT
            COALESCE(geolocation.timestamp, measurement.timestamp) AS timestamp,
            geolocation.latitude,
            geolocation.longitude,
            geolocation.speed,
            measurement.type,
            measurement.attribute,
            measurement.value
          FROM geolocation
          FULL OUTER JOIN measurement ON geolocation.timestamp = measurement.timestamp
          WHERE geolocation.trackId = $1 OR measurement.trackId = $1
          ORDER BY timestamp
        )
        GROUP BY timestamp
      )
      ORDER BY timestamp
    `,
      [this.trackId],
    )
  }

  protected async fetchTrack() {
    await this.initializeConnection()
    const track = await this.trackRepository.findOne({
      where: { id: this.trackId },
      relations: {
        geolocations: true,
        measurements: true,
      },
      relationLoadStrategy: 'query',
    })

    return track
  }

  protected async initializeConnection() {
    if (!this.connection) this.connection = senseBoxBikeDataSource.dataSource
    this.trackRepository = this.connection.getRepository(Track)
  }
}
