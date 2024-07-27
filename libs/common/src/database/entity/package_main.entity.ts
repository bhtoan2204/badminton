import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('package_main')
export class PackageMain {
  @PrimaryGeneratedColumn()
  id_main_package: number;

  @Column('varchar', { nullable: false })
  name: string;

  @Column('varchar', { nullable: false, default: '' })
  name_vn: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('int', { nullable: false, default: 500000 })
  price: number;

  @Column('boolean', { default: true })
  is_active: boolean;

  @Column('int', { nullable: false })
  duration_months: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Order, (order) => order.packageMain)
  orders: Order[];
}
