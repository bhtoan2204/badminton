import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { LoginType } from '../enum/login_type.enum';
import { Family } from './family.entity';
import { MemberFamily } from './member_family.entity';
import { Feedback } from './feedback.entity';
import { Order } from './order.entity';
import { FinanceExpenditure } from './finance_expenditure.entity';
import { FinanceIncome } from './finance_income.entity';
import { RefreshToken } from './refresh_token.entity';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id_user: string;

  @Column('varchar', { nullable: true })
  email: string;

  @Column('varchar', { nullable: true })
  phone: string;

  @Column('varchar', { nullable: true, select: false })
  password: string;

  @Column('varchar', { nullable: true })
  firstname: string;

  @Column('varchar', { nullable: true })
  lastname: string;

  @Column('varchar', { nullable: true, select: false })
  language: string;

  @Column('boolean', { default: false, select: false })
  twofa: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('boolean', { default: false })
  isemailverified: boolean;

  @Column('boolean', { default: false })
  isphoneverified: boolean;

  @Column('boolean', { default: false })
  isadmin: boolean;

  @Column({
    type: 'enum',
    enum: LoginType,
    default: LoginType.LOCAL,
  })
  login_type: LoginType;

  @Column('varchar', { nullable: true })
  avatar: string;

  @Column('varchar', { nullable: true })
  genre: string;

  @Column('date', { nullable: true })
  birthdate: Date;

  @Column('boolean', { nullable: false, default: false })
  is_banned: boolean;

  @Column('varchar', {
    nullable: false,
    select: false,
  })
  salt: string;

  @OneToMany(() => Family, (family) => family.owner_id)
  families: Family[];

  @OneToMany(() => MemberFamily, (memberFamily) => memberFamily.user)
  memberFamilies: MemberFamily[];

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];

  @OneToMany(() => Order, (order) => order.users)
  orders: Order[];

  @OneToMany(
    () => FinanceExpenditure,
    (finance_expenditure) => finance_expenditure.users,
  )
  financeExpenditures: FinanceExpenditure[];

  @OneToMany(() => FinanceIncome, (financeIncome) => financeIncome.users)
  financeIncomes: FinanceIncome[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];
}
