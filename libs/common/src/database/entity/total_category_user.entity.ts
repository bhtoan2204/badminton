import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Users } from './users.entity';
import { CategoryExpense } from './category_expense.entity'; // Giả sử bạn đã định nghĩa entity này

@Entity('total_category_user')
export class TotalCategoryUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'id_user' })
  id_user: Users;

  @Column('varchar', { nullable: true })
  description: string;

  @ManyToOne(() => CategoryExpense)
  @JoinColumn({ name: 'id_category' })
  id_cateory: CategoryExpense;

  @Column('money')
  total: number;

  @Column('real', { nullable: true })
  percent: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
