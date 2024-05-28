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
    const existingTracks = useTracksStore.getState().tracks

    await queryRunner.query(
      `CREATE TABLE "track" ("id" varchar PRIMARY KEY NOT NULL, "start" datetime NOT NULL, "end" datetime)`,
    )

    await queryRunner.query(
      `CREATE TABLE "measurement" ("id" varchar PRIMARY KEY NOT NULL, "type" varchar NOT NULL, "attribute" varchar, "value" real NOT NULL, "timestamp" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "gps_lat" real NOT NULL, "gps_lng" real NOT NULL, "gps_spd" real NOT NULL, "trackId" varchar, FOREIGN KEY ("trackId") REFERENCES "track" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    )

    for (const track of existingTracks) {
      console.log('Inserting track', track.id)
      await queryRunner.query(
        `INSERT INTO "track" ("id", "start", "end") VALUES ('${
          track.id
        }', '${new Date(track.start).toISOString()}', '${new Date(
          track.end,
        ).toISOString()}')`,
      )
      for (const measurement of track.measurements) {
        const { timestamp, gps_lat, gps_lng, gps_spd } = measurement

        console.log('Looping measurement', measurement)

        console.log('Phenomena', phenomena)

        for (const phenomenon of phenomena) {
          const [type] = Object.entries(typeMapping).find(([_, value]) =>
            value.includes(phenomenon),
          )

          console.log(phenomenon, type)

          if (!type) {
            continue
          }

          const attribute =
            attributeMapping[phenomenon as keyof typeof attributeMapping]

          console.log('attribute', attribute)

          console.log(
            'Inserting measurement',
            measurement[phenomenon as keyof typeof measurement],
          )

          await queryRunner.query(
            `INSERT INTO "measurement" ("id", "type", "attribute", "value", "timestamp", "gps_lat", "gps_lng", "gps_spd", "trackId") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
              uuidv4(),
              type,
              attribute ?? null,
              measurement[phenomenon as keyof typeof measurement],
              new Date(timestamp).toISOString(),
              gps_lat,
              gps_lng,
              gps_spd,
              track.id,
            ],
          )
        }
      }
    }

    // if (existingTracks.length > 0) {
    //   await queryRunner.query(
    //     `INSERT INTO "track" ("id", "start", "end") VALUES ${existingTracks
    //       .map(
    //         track =>
    //           `('${track.id}', '${new Date(track.start).toISOString()}', '${new Date(track.end).toISOString()}')`,
    //       )
    //       .join(',')}`,
    //   )
    // }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "measurement"`)
    await queryRunner.query(`DROP TABLE "track"`)
  }
}
