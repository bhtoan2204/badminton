import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Family } from './family.entity';
import { CategoryIncome } from './category_income.entity'; // Giả sử bạn đã sửa tên đúng
import { WalletFamily } from './wallet_family.entity'; // Giả sử bạn đã định nghĩa entity này

@Entity('income_family')
export class IncomeFamily {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Family)
  @Column({ type: 'integer' })
  id_family: number;

  @Column('varchar', { nullable: true })
  description: string;

  @ManyToOne(() => CategoryIncome)
  @Column({ type: 'integer' })
  id_category: number;

  @Column('money')
  total: string;

  @ManyToOne(() => WalletFamily)
  @Column({ type: 'integer' })
  id_wallet: number;
}
