import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Entity('feedbacks')
export class Feedback {
  @PrimaryGeneratedColumn()
  id_feedback: number;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'int', width: 1 })
  rating: number;

  @Column()
  id_user: string;

  @ManyToOne(() => Users, (user) => user.feedbacks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_user' })
  user: Users;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
