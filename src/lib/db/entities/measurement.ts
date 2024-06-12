import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Track } from './track'

@Entity()
export class Measurement extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  type: string // Describes the type of sensor (e.g., "temperature", "finedust", "acceleration", "distance")

  @Column('varchar', { nullable: true })
  attribute: string | null // Describes the specific attribute being measured (e.g., "pm1", "pm2.5" for finedust, "x", "y", "z" for acceleration)

  @Column('real')
  value: number // The measured value, which can be of different types based on the sensor attribute

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date

  @ManyToOne(
    () => Track,
    track => track.measurements,
  )
  track: Track
}
