import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { CategoryExpense } from './category_expense.entity'; // Giả sử bạn đã định nghĩa entity này
import { WalletUser } from './wallet_user.entity'; // Giả sử bạn đã định nghĩa entity này

@Entity('total_category_user')
export class TotalCategoryUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @Column('uuid')
  id_user: string;

  @Column('varchar', { nullable: true })
  description: string;

  @ManyToOne(() => CategoryExpense)
  @Column({ type: 'integer' })
  id_cateory: number;

  @Column('money')
  total: string;

  @ManyToOne(() => WalletUser)
  @Column({ type: 'integer' })
  id_wallet: number;
}
