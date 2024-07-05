import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UtilitiesType } from './utilities_type.entity';
import { Family } from './family.entity';

@Entity('utilities')
export class Utilities {
  @PrimaryGeneratedColumn()
  id_utility: number;

  @Column()
  id_family: number;

  @Column()
  id_utilities_type: number;

  @Column({ nullable: true, default: '' })
  description: string;

  @Column('text', { nullable: true })
  image_url: string;

  @Column({ nullable: false, default: 0 })
  value: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => UtilitiesType, (utilitiesType) => utilitiesType.utilities)
  @JoinColumn({ name: 'id_utilities_type' })
  utilitiesType: UtilitiesType;

  @ManyToOne(() => Family, (family) => family.utilities)
  @JoinColumn({ name: 'id_family' })
  family: Family;
}
