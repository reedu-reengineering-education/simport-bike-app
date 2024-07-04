import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm'

@Entity()
export class Upload extends BaseEntity {
  @PrimaryColumn('int')
  group_number: number

  @Column('boolean', { default: false })
  uploaded: boolean

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  uploaded_at: Date
}
