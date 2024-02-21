import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Family } from './family.entity';
import { CategoryExpense } from './category_expense.entity'; // Giả sử bạn đã định nghĩa entity này

@Entity('total_category_family')
export class TotalCategoryFamily {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Family)
  @Column({ type: 'integer' })
  id_family: number;

  @ManyToOne(() => CategoryExpense)
  @Column({ type: 'integer' })
  id_category: number;

  @Column('money', { nullable: true })
  total: string;

  @Column('real', { nullable: true })
  percent: number;
}
