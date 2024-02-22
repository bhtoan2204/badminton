import { Entity, Column, PrimaryGeneratedColumn, ManyToOne ,CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Family } from './family.entity';
import { CategoryIncome } from './category_income.entity'; 
import { WalletFamily } from './wallet_family.entity'; 

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
  total: number;

  @ManyToOne(() => WalletFamily)
  @JoinColumn({ name: 'id_wallet' }) 
  wallet: WalletFamily;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


