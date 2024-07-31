import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './users.entity';
import { FinanceIncomeSource } from './finance_income_source.entity';

@Entity('finance_income')
export class FinanceIncome {
  @PrimaryGeneratedColumn()
  id_income: number;

  @Column('int', { nullable: false })
  id_family: number;

  @Column('int', { nullable: false })
  id_income_source: number;

  @Column('uuid', { nullable: false })
  id_created_by: string;

  @Column('int', { nullable: false, default: 0 })
  amount: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  income_date: Date;

  @Column('text', { nullable: true, default: '' })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(
    () => FinanceIncomeSource,
    (financeIncomeSource) => financeIncomeSource.financeIncomes,
  )
  @JoinColumn({ name: 'id_income_source' })
  financeIncomeSource: FinanceIncomeSource;

  @ManyToOne(() => Users, (user) => user.financeIncomes)
  @JoinColumn({ name: 'id_created_by' })
  users: Users;
}
