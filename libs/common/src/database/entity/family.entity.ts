import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Users } from './users.entity';
import { FamilyExtraPackages } from './family_package_extra.entity';
import { ShoppingLists } from './shopping_lists.entity';
import { MemberFamily } from './member_family.entity';
import { Order } from './order.entity';
import { Utilities } from './utilities.entity';
import { FinanceAssets } from './finance_assets.entity';
import { FamilyInvitation } from './family_invitation.entity';

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

  @OneToOne(
    () => FamilyInvitation,
    (family_invitation) => family_invitation.family,
  )
  family_invitation: FamilyInvitation;

  @OneToMany(
    () => FamilyExtraPackages,
    (familyExtraPackage) => familyExtraPackage.family,
  )
  familyExtraPackages: FamilyExtraPackages[];

  @OneToMany(() => ShoppingLists, (shoppingList) => shoppingList.family)
  shoppingLists: ShoppingLists[];

  @OneToMany(() => MemberFamily, (memberFamily) => memberFamily.family)
  memberFamilies: MemberFamily[];

  @OneToMany(() => Order, (order) => order.family)
  orders: Order[];

  @OneToMany(() => Utilities, (utilities) => utilities.family)
  utilities: Utilities[];

  @OneToMany(() => FinanceAssets, (financeAssets) => financeAssets.family)
  financeAssets: FinanceAssets[];
}
