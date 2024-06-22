import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn()
  id_feedback: number;

  @Column()
  id_user: string;

  @Column('text')
  feedbackText: string;

  @Column('int')
  rating: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
}
