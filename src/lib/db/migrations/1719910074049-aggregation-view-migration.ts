import { MigrationInterface, QueryRunner } from 'typeorm'

export class AggregationViewMigration1719910074049
  implements MigrationInterface
{
  name = 'AggregationViewMigration1719910074049'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const typeAttributePairs: {
      type: string
      attribute?: string
    }[] = await queryRunner.query(
      `SELECT DISTINCT type, attribute FROM measurement`,
    )

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

    await queryRunner.query('DROP VIEW IF EXISTS v_aggregated_data;')

    await queryRunner.query(
      `CREATE VIEW v_aggregated_data AS
      WITH geolocation_changes AS (
          SELECT
              id,
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
                  geolocation.id,
                  COALESCE(geolocation.timestamp, measurement.timestamp) AS timestamp,
                  geolocation.latitude,
                  geolocation.longitude,
                  geolocation.speed,
                  measurement.type,
                  measurement.attribute,
                  measurement.value
              FROM geolocation
              FULL OUTER JOIN measurement ON geolocation.timestamp = measurement.timestamp
              ORDER BY timestamp
          )
      ),
      grouped_geolocation AS (
          SELECT
              id,
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
              grouped_geolocation.id AS id,
              measurement.trackId AS trackId,
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
      ORDER BY timestamp;`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW v_aggregated_data;`)
  }
}
