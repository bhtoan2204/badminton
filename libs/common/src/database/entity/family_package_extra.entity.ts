import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { PackageExtra } from './package_extra.entity';
import { Family } from './family.entity';

@Entity('family_extra_packages')
@Unique(['family', 'extra_package'])
export class FamilyExtraPackages {
  @PrimaryGeneratedColumn()
  id_family_extra_package: number;

  @ManyToOne(() => Family, (family) => family.familyExtraPackages)
  @JoinColumn({ name: 'id_family' })
  family: Family;

  @ManyToOne(
    () => PackageExtra,
    (extraPackage) => extraPackage.familyExtraPackages,
  )
  @JoinColumn({ name: 'id_extra_package' })
  extra_package: PackageExtra;
}
