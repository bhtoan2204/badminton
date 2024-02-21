import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { CategoryIncome } from './category_income.entity'; // Giả sử bạn đã sửa tên đúng
import { WalletUser } from './wallet_user.entity'; // Giả sử bạn đã định nghĩa entity này

@Entity('income_user')
export class IncomeUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @Column('uuid')
  id_user: string;

  @Column('varchar', { nullable: true })
  description: string;

  @ManyToOne(() => CategoryIncome)
  @Column({ type: 'integer' })
  id_category: number;

  @Column('money')
  total: string;

  @ManyToOne(() => WalletUser)
  @Column({ type: 'integer' })
  id_wallet: number;
}
