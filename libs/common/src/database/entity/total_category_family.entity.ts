import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn , UpdateDateColumn} from 'typeorm';
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
  total: number;

  @Column('real', { nullable: true })
  percent: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
