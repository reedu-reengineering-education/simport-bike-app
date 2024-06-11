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

  // protected async getMeasurementsPivotDynamic() {
  //   this.initializeConnection()
  //   const entityManager = this.connection

  //   // Fetch distinct types and attributes
  //   const distinctTypes = await entityManager.query(
  //     `SELECT DISTINCT type FROM measurement`,
  //   )
  //   const distinctAttributes = await entityManager.query(
  //     `SELECT DISTINCT attribute FROM measurement WHERE attribute IS NOT NULL`,
  //   )

  //   let selectClauses = distinctTypes.map(type => {
  //     return `MAX(CASE WHEN m.type = '${type.type}' THEN m.value ELSE NULL END) as ${type.type}`
  //   })

  //   distinctAttributes.forEach(attribute => {
  //     selectClauses = selectClauses.concat(
  //       distinctTypes
  //         .filter(type => type.type === 'acceleration') // Adjust this filter based on your needs
  //         .map(
  //           type =>
  //             `MAX(CASE WHEN m.type = '${type.type}' AND m.attribute = '${
  //               attribute.attribute
  //             }' THEN m.value ELSE NULL END) as ${
  //               type.type
  //             }_${attribute.attribute.replace('.', '_')}`,
  //         ),
  //     )
  //   })

  //   const query = `
  //     SELECT
  //       t.id as track_id,
  //       ${selectClauses.join(',\n')}
  //     FROM measurement m
  //     LEFT JOIN track t ON t.id = m.trackId
  //     GROUP BY t.id
  //   `

  //   const result = await entityManager.query(query, [this.trackId])

  //   return result
  // }

  // protected async fetchTrackMerge() {
  //   await this.initializeConnection()

  //   const rawData = await this.connection.query<
  //     {
  //       timestamp: Date
  //       latitude: number
  //       longitude: number
  //       speed: number
  //       type: string
  //       attribute: string
  //       value: number
  //     }[]
  //   >(
  //     `
  //         SELECT
  //           COALESCE(geolocation.timestamp, measurement.timestamp) AS timestamp,
  //           geolocation.latitude,
  //           geolocation.longitude,
  //           geolocation.speed,
  //           measurement.type,
  //           measurement.attribute,
  //           measurement.value
  //         FROM geolocation
  //         FULL OUTER JOIN measurement ON geolocation.timestamp = measurement.timestamp
  //         WHERE geolocation.trackId = $1 OR measurement.trackId = $1
  //         ORDER BY timestamp
  //       `,
  //     [this.trackId],
  //   )

  //   return rawData
  // }

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
