import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Family } from './family.entity';

@Entity('finance_assets')
export class FinanceAssets {
  @PrimaryGeneratedColumn()
  id_asset: number;

  @Column({ type: 'int' })
  id_family: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column('text', { default: '', nullable: true })
  description: string;

  @Column({ type: 'bigint' })
  value: number;

  @Column('date', { default: () => 'CURRENT_DATE' })
  purchase_date: Date;

  @Column('text', { nullable: true, default: null })
  image_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Family, (family) => family.financeAssets)
  @JoinColumn({ name: 'id_family' })
  family: Family;
}
