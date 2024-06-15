import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Family } from './family.entity';

@Entity('checklist')
export class Checklist {
  @PrimaryGeneratedColumn()
  id_checklist: number;

  @Column()
  id_family: number;

  @Column('varchar', { length: 255, nullable: false })
  task_name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('boolean', { default: false })
  is_completed: boolean;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  due_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Family, (family) => family.checklists)
  @JoinColumn({ name: 'id_family' })
  family: Family;
}
