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

    const aggOperationsPerType = (type: string) => {
      switch (type) {
        case 'temperature':
        case 'humidity':
        case 'accelerometer':
        case 'finedust':
          return 'AVG'
        case 'distance':
          return 'MIN'
        case 'overtaking':
          return 'MAX'
        default:
          return 'AVG'
      }
    }

    const useAbsoluteValue = (type: string) => {
      switch (type) {
        case 'accelerometer':
          return true
        default:
          return false
      }
    }

    const selectClauses = typeAttributePairs.map(({ type, attribute }) => {
      const aggOperation = aggOperationsPerType(type)
      const valueQuery = useAbsoluteValue(type) ? 'ABS(value)' : 'value'
      if (attribute) {
        return `${aggOperation}(CASE WHEN type = '${type}' AND attribute = '${attribute}' THEN ${valueQuery} ELSE NULL END) as ${type}_${attribute.replace(
          '.',
          '_',
        )}`
      }
      return `MAX(CASE WHEN type = '${type}' THEN value ELSE NULL END) as ${type}`
    })

    return await this.connection.query(
      `
      WITH geolocation_changes AS (
        SELECT
          timestamp,
          latitude,
          longitude,
          speed,
          CASE
            WHEN latitude IS NOT NULL AND longitude IS NOT NULL THEN 1
            ELSE 0
          END AS is_geolocation_change,
          MAX(latitude) OVER (ORDER BY timestamp ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS last_latitude,
          MAX(longitude) OVER (ORDER BY timestamp ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS last_longitude
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
      ),
      grouped_geolocation AS (
        SELECT
          timestamp,
          latitude,
          longitude,
          speed,
          is_geolocation_change,
          last_latitude,
          last_longitude,
          SUM(is_geolocation_change) OVER (ORDER BY timestamp) AS group_number
        FROM geolocation_changes
      ),
      aggregated_data AS (
        SELECT
          group_number,
          MAX(grouped_geolocation.timestamp) AS timestamp,
          MAX(latitude) AS latitude,
          MAX(longitude) AS longitude,
          MAX(speed) AS speed,
          ${selectClauses.join(',\n')}
        FROM grouped_geolocation
        LEFT JOIN measurement ON grouped_geolocation.timestamp = measurement.timestamp
        GROUP BY group_number
      )
      SELECT *
      FROM aggregated_data
      ORDER BY timestamp;
    `,
      [this.trackId],
    )

    // return await this.connection.query(
    //   `
    //   SELECT * FROM (
    //     SELECT
    //       timestamp,
    //       MAX(latitude) AS latitude,
    //       MAX(longitude) AS longitude,
    //       MAX(speed) AS speed,
    //       ${selectClauses.join(',\n')}
    //     FROM (
    //       SELECT
    //         COALESCE(geolocation.timestamp, measurement.timestamp) AS timestamp,
    //         geolocation.latitude,
    //         geolocation.longitude,
    //         geolocation.speed,
    //         measurement.type,
    //         measurement.attribute,
    //         measurement.value
    //       FROM geolocation
    //       FULL OUTER JOIN measurement ON geolocation.timestamp = measurement.timestamp
    //       WHERE geolocation.trackId = $1 OR measurement.trackId = $1
    //       ORDER BY timestamp
    //     )
    //     GROUP BY timestamp
    //   )
    //   ORDER BY timestamp
    // `,
    //   [this.trackId],
    // )
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
