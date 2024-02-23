import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Users } from './users.entity';
import { CategoryIncome } from './category_income.entity'; // Giả sử bạn đã sửa tên đúng
import { WalletUser } from './wallet_user.entity'; // Giả sử bạn đã định nghĩa entity này

@Entity('income_user')
export class IncomeUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'id_user' }) 
  id_user: Users;

  @Column('varchar', { nullable: true })
  description: string;

  @ManyToOne(() => CategoryIncome)
  @JoinColumn({ name: 'id_category' }) 
  id_category: CategoryIncome;

  @Column('money')
  total: string;

  @ManyToOne(() => WalletUser)
  @JoinColumn({ name: 'id_wallet' }) 
  id_wallet: WalletUser;


  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

