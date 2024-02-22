import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Users } from './users.entity';
import { CategoryExpense } from './category_expense.entity'; // Giả sử bạn đã định nghĩa entity này

@Entity('total_category_user')
export class TotalCategoryUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users)
  @Column('uuid')
  id_user: string;

  @Column('varchar', { nullable: true })
  description: string;

  @ManyToOne(() => CategoryExpense)
  @Column({ type: 'integer' })
  id_cateory: number;

  @Column('money')
  total: number;

  @Column('real', { nullable: true })
  percent: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
