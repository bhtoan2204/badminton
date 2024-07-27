import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { PackageCombo } from './package_combo.entity';
import { FamilyExtraPackages } from './family_package_extra.entity';
import { Order } from './order.entity';

@Entity('package_extra')
export class PackageExtra {
  @PrimaryGeneratedColumn()
  id_extra_package: number;

  @Column('varchar')
  name: string;

  @Column('varchar', { nullable: false, default: '' })
  name_vn: string;

  @Column('int', { nullable: false, default: 500000 })
  price: number;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('boolean', { default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => PackageCombo, (packageCombo) => packageCombo.packageExtras)
  packageCombos: PackageCombo[];

  @OneToMany(
    () => FamilyExtraPackages,
    (familyExtraPackage) => familyExtraPackage.extra_package,
  )
  familyExtraPackages: FamilyExtraPackages[];

  @OneToMany(() => Order, (order) => order.packageExtra)
  orders: Order[];
}
