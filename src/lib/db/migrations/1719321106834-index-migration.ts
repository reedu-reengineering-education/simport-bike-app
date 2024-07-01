import { MigrationInterface, QueryRunner } from 'typeorm'

export class IndexMigration1719321106834 implements MigrationInterface {
  name = 'IndexMigration1719321106834'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_measurement_trackId ON measurement(trackId);`,
    )
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS  idx_geolocation_trackId ON geolocation(trackId);`,
    )

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_measurement_timestamp ON measurement(timestamp);`,
    )
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_geolocation_timestamp ON geolocation(timestamp);`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX idx_measurement_trackId;`)
    await queryRunner.query(`DROP INDEX idx_geolocation_trackId;`)

    await queryRunner.query(`DROP INDEX idx_measurement_timestamp;`)
    await queryRunner.query(`DROP INDEX idx_geolocation_timestamp;`)
  }
}
