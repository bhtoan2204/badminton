import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Users } from './users.entity'; // Giả sử bạn đã định nghĩa entity này
import { CategoryExpense } from './category_expense.entity';
import { WalletUser } from './wallet_user.entity'; // Giả sử bạn đã định nghĩa entity này

@Entity('expense_user')
export class ExpenseUser {
  @PrimaryGeneratedColumn()
  id_expense: number;

  @ManyToOne(() => Users)
  @Column('uuid')
  id_user: string;

  @Column('varchar', { nullable: true })
  description: string;

  @ManyToOne(() => CategoryExpense)
  @JoinColumn({ name: 'id_category' }) // Đặt tên cột khóa ngoại là id_category
  id_category: CategoryExpense;

  @ManyToOne(() => WalletUser)
  @JoinColumn({ name: 'id_wallet' }) // Đặt tên cột khóa ngoại là id_wallet
  wallet: WalletUser;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
