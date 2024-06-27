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
import { Users } from './users.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id_order: string;

  @Column('uuid')
  id_user: string;

  @Column('int')
  id_family: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ type: 'int', nullable: true })
  id_package_main: number;

  @Column({ type: 'int', nullable: true })
  id_package_extra: number;

  @Column({ type: 'int', nullable: true })
  id_package_combo: number;

  @Column({ nullable: false, default: 'VNPAY' })
  method: string;

  @Column({ nullable: true, type: 'varchar' })
  bank_code: string;

  @Column({ nullable: false, type: 'decimal' })
  price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Family, (family) => family.orders)
  @JoinColumn({ name: 'id_family' })
  family: Family;

  @ManyToOne(() => Users, (user) => user.orders)
  @JoinColumn({ name: 'id_user' })
  users: Users;
}
