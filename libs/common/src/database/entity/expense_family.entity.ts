import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Family } from './family.entity';
import { CategoryExpense } from './category_expense.entity';
import { WalletFamily } from './wallet_family.entity'; // Giả sử bạn đã định nghĩa entity này

@Entity('expense_family')
export class ExpenseFamily {
  @PrimaryGeneratedColumn()
  id_expense: number;

  @ManyToOne(() => Family)
  @Column({ type: 'integer', nullable: true })
  id_family: number;

  @Column('varchar', { nullable: true })
  description: string;

  @ManyToOne(() => CategoryExpense)
  @Column({ type: 'integer', nullable: true })
  id_category: number;

  @ManyToOne(() => WalletFamily)
  @Column({ type: 'integer' })
  wallet: number;
}
