import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FinanceExpenditureType } from './finance_expenditure_type.entity';
import { Users } from './users.entity';
import { Utilities } from './utilities.entity';
import { ShoppingLists } from './shopping_lists.entity';

@Entity('finance_expenditure')
export class FinanceExpenditure {
  @PrimaryGeneratedColumn()
  id_expenditure: number;

  @Column('int', { nullable: false })
  id_family: number;

  @Column('int', { nullable: true })
  id_expenditure_type: number;

  @Column('uuid', { nullable: true })
  id_created_by: string;

  @Column('int', { nullable: false, default: 0 })
  amount: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  expenditure_date: Date;

  @Column('text', { nullable: true, default: '' })
  description: string;

  @Column('text', { nullable: true, default: null })
  image_url: string;

  @Column('int', { nullable: true, default: null })
  id_utility: number;

  @Column('int', { nullable: true, default: null })
  id_shopping_list: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(
    () => FinanceExpenditureType,
    (financeExpenditureType) => financeExpenditureType.financeExpenditures,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'id_expenditure_type' })
  financeExpenditureType: FinanceExpenditureType;

  @ManyToOne(() => Users, (user) => user.financeExpenditures)
  @JoinColumn({ name: 'id_created_by' })
  users: Users;

  @OneToOne(() => Utilities, (utilities) => utilities.expenditure, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'id_utility' })
  utilities: Utilities;

  @OneToOne(() => ShoppingLists, (shoppingLists) => shoppingLists.expenditure, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'id_shopping_list' })
  shoppingLists: ShoppingLists;
}
