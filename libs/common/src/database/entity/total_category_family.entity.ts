import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Family } from './family.entity';
import { CategoryExpense } from './category_expense.entity';

@Entity('total_category_family')
export class TotalCategoryFamily {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Family)
  @JoinColumn({ name: 'id_family' })
  id_family: Family;

  @ManyToOne(() => CategoryExpense)
  @JoinColumn({ name: 'id_category' })
  id_category: CategoryExpense;

  @Column('money', { nullable: true })
  total: number;

  @Column('real', { nullable: true })
  percent: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
