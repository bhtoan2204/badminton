import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PackageExtra } from './package_extra.entity';
import { Family } from './family.entity';

@Entity('family_extra_packages')
export class FamilyExtraPackages {
  @PrimaryGeneratedColumn()
  id_family_extra_package: number;

  @ManyToOne(() => Family, (family) => family.id_family)
  @JoinColumn({ name: 'id_family' })
  family: Family;

  @ManyToOne(
    () => PackageExtra,
    (extraPackage) => extraPackage.id_extra_package,
  )
  @JoinColumn({ name: 'id_extra_package' })
  extra_package: PackageExtra;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
