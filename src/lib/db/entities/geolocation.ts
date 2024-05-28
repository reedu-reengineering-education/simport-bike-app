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
export class Geolocation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('real')
  latitude: number

  @Column('real')
  longitude: number

  @Column('real')
  speed: number

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date

  @ManyToOne(
    () => Track,
    track => track.geolocations,
  )
  track: Track
}
