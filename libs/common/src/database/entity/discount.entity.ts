import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('discount')
export class Discount {
  @PrimaryColumn('varchar', { length: 255, nullable: false })
  code: string;

  @Column('integer', { nullable: false })
  percentage: number;

  @Column('timestamptz', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  expired_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
