import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Family } from './family.entity';
import { CategoryExpense } from './category_expense.entity';
import { WalletFamily } from './wallet_family.entity';

@Entity('expense_family')
export class ExpenseFamily {
  @PrimaryGeneratedColumn()
  id_expense: number;

  @ManyToOne(() => Family)
  @JoinColumn({ name: 'id_family' }) // Đặt tên cột khóa ngoại là id_family
  id_family: Family;

  @Column('varchar', { nullable: true })
  description: string;

  @ManyToOne(() => CategoryExpense)
  @JoinColumn({ name: 'id_category' }) // Đặt tên cột khóa ngoại là id_category
  id_category: CategoryExpense;

  @ManyToOne(() => WalletFamily)
  @JoinColumn({ name: 'id_wallet' }) // Đặt tên cột khóa ngoại là id_wallet
  wallet: WalletFamily;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
