import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ChecklistType } from './checklist_type.entity';

@Entity('checklist')
export class Checklist {
  @PrimaryGeneratedColumn()
  id_checklist: number;

  @Column({ nullable: false, default: 1 })
  id_checklist_type: number;

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

  @Column('boolean', { default: false })
  is_notified_3_days_before: boolean;

  @Column('boolean', { default: false })
  is_notified_1_day_before: boolean;

  @Column('boolean', { default: false })
  is_notified_on_due_date: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => ChecklistType, (checklistType) => checklistType.checklists)
  @JoinColumn({ name: 'id_checklist_type' })
  checklistType: ChecklistType;
}
