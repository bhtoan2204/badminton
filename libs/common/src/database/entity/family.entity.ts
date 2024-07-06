import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Users } from './users.entity';
import { Checklist } from './checklist.entity';
import { FamilyExtraPackages } from './family_package_extra.entity';
import { Room } from './room.entity';
import { HouseholdItems } from './household_items.entity';
import { GuideItems } from './guide_items.entity';
import { EducationProgress } from './education_progress.entity';
import { ShoppingLists } from './shopping_lists.entity';
import { MemberFamily } from './member_family.entity';
import { Order } from './order.entity';
import { Calendar } from './calendar.entity';
import { Utilities } from './utilities.entity';
import { FinanceExpenditureType } from './finance_expenditure_type.entity';
import { FinanceExpenditure } from './finance_expenditure.entity';
import { FinanceIncomeSource } from './finance_income_source.entity';
import { FinanceIncome } from './finance_income.entity';
import { FinanceAssets } from './finance_assets.entity';

@Entity('family')
export class Family {
  @PrimaryGeneratedColumn()
  id_family: number;

  @Column('int')
  quantity: number;

  @Column('varchar', { nullable: false, default: 'New Family' })
  name: string;

  @Column('varchar', { nullable: true, default: '' })
  description: string;

  @Column('uuid', { nullable: false })
  owner_id: string;

  @ManyToOne(() => Users, (user) => user.families, { nullable: false })
  @JoinColumn({ name: 'owner_id' })
  users: Users;

  @Column('timestamptz', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  expired_at: Date;

  @Column('varchar', { nullable: true })
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Checklist, (checklist) => checklist.family)
  checklists: Checklist[];

  @OneToMany(
    () => FamilyExtraPackages,
    (familyExtraPackage) => familyExtraPackage.family,
  )
  familyExtraPackages: FamilyExtraPackages[];

  @OneToMany(() => Room, (room) => room.family)
  rooms: Room[];

  @OneToMany(() => HouseholdItems, (household_item) => household_item.family)
  householdItems: HouseholdItems[];

  @OneToMany(() => GuideItems, (guide_item) => guide_item.family)
  guideItems: GuideItems[];

  @OneToMany(
    () => EducationProgress,
    (education_progress) => education_progress.family,
  )
  educationProgresses: EducationProgress[];

  @OneToMany(() => ShoppingLists, (shoppingList) => shoppingList.family)
  shoppingLists: ShoppingLists[];

  @OneToMany(() => MemberFamily, (memberFamily) => memberFamily.family)
  memberFamilies: MemberFamily[];

  @OneToMany(() => Order, (order) => order.family)
  orders: Order[];

  @OneToMany(() => Calendar, (calendar) => calendar.family)
  calendars: Calendar[];

  @OneToMany(() => Utilities, (utilities) => utilities.family)
  utilities: Utilities[];

  @OneToMany(
    () => FinanceExpenditureType,
    (financeExpenditureType) => financeExpenditureType.family,
  )
  financeExpenditureTypes: FinanceExpenditureType[];

  @OneToMany(
    () => FinanceExpenditure,
    (financeExpenditure) => financeExpenditure.family,
  )
  financeExpenditures: FinanceExpenditure[];

  @OneToMany(
    () => FinanceIncomeSource,
    (financeIncomeSource) => financeIncomeSource.family,
  )
  financeIncomeSources: FinanceIncomeSource[];

  @OneToMany(() => FinanceIncome, (financeIncome) => financeIncome.family)
  financeIncomes: FinanceIncome[];

  @OneToMany(() => FinanceAssets, (financeAssets) => financeAssets.family)
  financeAssets: FinanceAssets[];
}
