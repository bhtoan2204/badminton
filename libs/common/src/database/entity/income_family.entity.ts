import { Entity, Column, PrimaryGeneratedColumn, ManyToOne ,CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Family } from './family.entity';
import { CategoryIncome } from './category_income.entity'; 
import { WalletFamily } from './wallet_family.entity'; 

@Entity('income_family')
export class IncomeFamily {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Family)
  @JoinColumn({ name: 'id_family' }) 
  id_family: Family;

  @Column('varchar', { nullable: true })
  description: string;

  @ManyToOne(() => CategoryIncome)
  @JoinColumn({ name: 'id_category' }) 
  id_category: CategoryIncome;

  @Column('money')
  total: number;

  @ManyToOne(() => WalletFamily)
  @JoinColumn({ name: 'id_wallet' }) 
  id_wallet: WalletFamily;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


