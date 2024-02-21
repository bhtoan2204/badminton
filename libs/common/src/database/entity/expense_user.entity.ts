import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity'; // Giả sử bạn đã định nghĩa entity này
import { CategoryExpense } from './category_expense.entity';
import { WalletUser } from './wallet_user.entity'; // Giả sử bạn đã định nghĩa entity này

@Entity('expense_user')
export class ExpenseUser {
  @PrimaryGeneratedColumn()
  id_expense: number;

  @ManyToOne(() => User)
  @Column('uuid')
  id_user: string;

  @Column('varchar', { nullable: true })
  description: string;

  @ManyToOne(() => CategoryExpense)
  @Column({ type: 'integer', nullable: true })
  id_category: number;

  @Column('money')
  total: string;

  @ManyToOne(() => WalletUser)
  @Column({ type: 'integer' })
  wallet: number;
}
