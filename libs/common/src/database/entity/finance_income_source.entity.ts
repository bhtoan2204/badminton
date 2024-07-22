import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Family } from './family.entity';
import { FinanceIncome } from './finance_income.entity';

@Entity('finance_income_source')
export class FinanceIncomeSource {
  @PrimaryGeneratedColumn()
  id_income_source: number;

  @Column({ type: 'int', nullable: false })
  id_family: number;

  @Column({ type: 'varchar', length: 255 })
  income_source_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  income_source_name_vn: string;

  @ManyToOne(() => Family, (family) => family.financeIncomeSources)
  @JoinColumn({ name: 'id_family' })
  family: Family;

  @OneToMany(
    () => FinanceIncome,
    (financeIncome) => financeIncome.financeIncomeSource,
    { cascade: true },
  )
  financeIncomes: FinanceIncome[];
}
