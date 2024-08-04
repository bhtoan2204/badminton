import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryEvent } from './category_event.entity';

@Entity('calendar')
export class Calendar {
  @PrimaryGeneratedColumn()
  id_calendar: number;

  @Column('int', { nullable: false })
  id_family: number;

  @Column('int', { nullable: false })
  category: number;

  @Column('varchar', { length: 255, nullable: false, default: 'New Event' })
  title: string;

  @Column('text', { nullable: true, default: '' })
  description: string;

  @Column('timestamp', { nullable: false })
  time_start: Date;

  @Column('timestamp', { nullable: false })
  time_end: Date;

  @Column('boolean', { default: false })
  is_all_day: boolean;

  @Column('text', { nullable: true })
  location: string;

  @Column('text', { nullable: true })
  color: string;

  @Column('varchar', { length: 255, nullable: true })
  start_timezone: string;

  @Column('varchar', { length: 255, nullable: true })
  end_timezone: string;

  @Column('int', { nullable: true })
  recurrence_id: number;

  @Column('varchar', { length: 255, nullable: true })
  recurrence_exception: string;

  @Column('varchar', { length: 255, nullable: true })
  recurrence_rule: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(
    () => CategoryEvent,
    (categoryEvent) => categoryEvent.id_category_event,
  )
  @JoinColumn({ name: 'category' })
  categoryEvent: CategoryEvent;
}
