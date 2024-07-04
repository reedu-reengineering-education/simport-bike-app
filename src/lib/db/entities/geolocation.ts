import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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

  @Column('uuid')
  trackId: string

  @ManyToOne(
    () => Track,
    track => track.geolocations,
  )
  @JoinColumn({ name: 'trackId' })
  track: Track
}
