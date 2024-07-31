import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @OneToMany(
    () => FinanceIncome,
    (financeIncome) => financeIncome.financeIncomeSource,
    { cascade: true },
  )
  financeIncomes: FinanceIncome[];
}
