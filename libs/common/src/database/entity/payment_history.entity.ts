import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './users.entity';
import { Order } from './order.entity';

export enum PackageType {
  MAIN = 'main',
  EXTRA = 'extra',
  COMBO = 'combo',
}

@Entity('payment_history')
export class PaymentHistory {
  @PrimaryGeneratedColumn()
  id_payment_history: number;

  @Column('uuid')
  id_user: string;

  @Column('uuid')
  id_order: string;

  @Column('int', { nullable: false })
  amount: number;

  @Column('varchar', { nullable: false })
  type: PackageType;

  @Column('varchar', { nullable: false, default: 'vnpay' })
  payment_method: string;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'id_user' })
  users: Users;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'id_order' })
  orders: Order;

  @CreateDateColumn()
  created_at: Date;
}
