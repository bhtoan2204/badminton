import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Users } from './users.entity';
import { CategoryIncome } from './category_income.entity'; 
import { WalletUser } from './wallet_user.entity'; 

@Entity('income_user')
export class IncomeUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users)
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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

