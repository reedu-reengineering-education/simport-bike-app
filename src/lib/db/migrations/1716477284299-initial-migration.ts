import { useTracksStore } from '@/lib/store/useTracksStore'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

// all old phenomena
const phenomena = [
  'temperature',
  'humidity',
  'pm1',
  'pm2_5',
  'pm4',
  'pm10',
  'acceleration_x',
  'acceleration_y',
  'acceleration_z',
  'distance_l',
]

const typeMapping = {
  temperature: ['temperature'],
  humidity: ['humidity'],
  finedust: ['pm1', 'pm2_5', 'pm4', 'pm10'],
  acceleration: ['acceleration_x', 'acceleration_y', 'acceleration_z'],
  distance: ['distance_l'],
}

// from old values to new attribute values
const attributeMapping = {
  pm1: 'pm1',
  pm2_5: 'pm2.5',
  pm4: 'pm4',
  pm10: 'pm10',
  acceleration_x: 'x',
  acceleration_y: 'y',
  acceleration_z: 'z',
}

export class InitialMigration1716477284299 implements MigrationInterface {
  name = 'InitialMigration1716477284299'

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('🐠 Starting migration')

    // create track table
    await queryRunner.query(
      `CREATE TABLE "track" ("id" varchar PRIMARY KEY NOT NULL, "start" datetime NOT NULL, "end" datetime)`,
    )

    // create measurement table
    await queryRunner.query(
      `CREATE TABLE "measurement" ("id" varchar PRIMARY KEY NOT NULL, "type" varchar NOT NULL, "attribute" varchar, "value" real NOT NULL, "timestamp" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "trackId" varchar, FOREIGN KEY ("trackId") REFERENCES "track" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    )

    // create geolocation table
    await queryRunner.query(
      `CREATE TABLE "geolocation" ("id" varchar PRIMARY KEY NOT NULL, "timestamp" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "latitude" real NOT NULL, "longitude" real NOT NULL, "speed" real NOT NULL, "trackId" varchar, FOREIGN KEY ("trackId") REFERENCES "track" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    )

    console.log('🐠 Migrating old data to new tables...')

    const existingTracks = useTracksStore.getState().tracks

    console.log('🐠 Found tracks:', existingTracks.length)

    for (const track of existingTracks) {
      await queryRunner.query(
        `INSERT INTO "track" ("id", "start", "end") VALUES ('${
          track.id
        }', '${new Date(track.start).toISOString()}', '${new Date(
          track.end,
        ).toISOString()}')`,
      )

      for (const measurement of track.measurements) {
        const { timestamp, gps_lat, gps_lng, gps_spd } = measurement

        console.log('🐠 Migrating measurement:', measurement)
        console.log('🐠 GPS:', gps_lat, gps_lng, gps_spd)
        if (gps_lat != null && gps_lng != null && gps_spd != null) {
          await queryRunner.query(
            `INSERT INTO "geolocation" ("id", "latitude", "longitude", "speed", "timestamp", "trackId") VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              uuidv4(),
              gps_lat,
              gps_lng,
              gps_spd,
              new Date(timestamp).toISOString(),
              track.id,
            ],
          )
        }

        for (const phenomenon of phenomena) {
          const [type] =
            Object.entries(typeMapping).find(([_, value]) =>
              value.includes(phenomenon),
            ) || []

          if (!type) {
            continue
          }

          const attribute =
            attributeMapping[phenomenon as keyof typeof attributeMapping]

          await queryRunner.query(
            `INSERT INTO "measurement" ("id", "type", "attribute", "value", "timestamp", "trackId") VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              uuidv4(),
              type,
              attribute ?? null,
              measurement[phenomenon as keyof typeof measurement],
              new Date(timestamp).toISOString(),
              track.id,
            ],
          )
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "measurement"`)
    await queryRunner.query(`DROP TABLE "track"`)
    await queryRunner.query(`DROP TABLE "geolocation"`)
  }
}
