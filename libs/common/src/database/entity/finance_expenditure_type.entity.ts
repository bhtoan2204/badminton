import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Family } from './family.entity';
import { FinanceExpenditure } from './finance_expenditure.entity';

@Entity('finance_expenditure_type')
export class FinanceExpenditureType {
  @PrimaryGeneratedColumn()
  id_expenditure_type: number;

  @Column({ type: 'varchar', length: 255 })
  expense_type_name: string;

  @Column({ type: 'varchar', length: 255 })
  expense_type_name_vn: string;

  @Column({ type: 'int' })
  id_family: number;

  @ManyToOne(() => Family, (family) => family.financeExpenditureTypes)
  @JoinColumn({ name: 'id_family' })
  family: Family;

  @OneToMany(
    () => FinanceExpenditure,
    (financeExpenditure) => financeExpenditure.financeExpenditureType,
    { cascade: true },
  )
  financeExpenditures: FinanceExpenditure[];
}
