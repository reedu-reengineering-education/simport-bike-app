import { MigrationInterface, QueryRunner } from 'typeorm'

export class UploadsTableMigration1719920282097 implements MigrationInterface {
  name = 'UploadsTableMigration1719920282097'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "uploads" (
        group_number INT NOT NULL PRIMARY KEY,
        uploaded BOOLEAN NOT NULL DEFAULT 0,
        uploaded_at datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP)
      );`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "uploads";`)
  }
}
