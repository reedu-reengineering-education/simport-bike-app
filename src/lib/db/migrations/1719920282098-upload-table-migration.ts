import { MigrationInterface, QueryRunner } from 'typeorm'

export class UploadTableMigration1719920282098 implements MigrationInterface {
  name = 'UploadTableMigration1719920282098'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "upload" (
        group_number INT NOT NULL PRIMARY KEY,
        uploaded BOOLEAN NOT NULL DEFAULT 0,
        uploaded_at datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP)
      );`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "upload";`)
  }
}
