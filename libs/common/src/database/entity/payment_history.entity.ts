import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Entity('payment_history')
export class PaymentHistory {
  @PrimaryGeneratedColumn()
  id_payment_history: number;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'id_user' })
  id_user: Users;

  @Column('money', { nullable: false })
  amount: number;

  @Column('varchar', { nullable: false })
  payment_method: string;

  @CreateDateColumn()
  created_at: Date;
}
