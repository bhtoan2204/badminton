import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PackageExtra } from './package_extra.entity';

@Entity('package_combo')
export class PackageCombo {
  @PrimaryGeneratedColumn()
  id_combo_package: number;

  @Column('varchar', { nullable: false })
  name: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('money', { nullable: false })
  price: number;

  @ManyToMany(
    () => PackageExtra,
    (packageExtra) => packageExtra.packageCombos,
    { cascade: true },
  )
  @JoinTable({
    name: 'package_combo_package_extra',
    joinColumn: {
      name: 'package_combo_id',
      referencedColumnName: 'id_combo_package',
    },
    inverseJoinColumn: {
      name: 'package_extra_id',
      referencedColumnName: 'id_extra_package',
    },
  })
  id_package_extra: PackageExtra[];

  @Column('boolean', { nullable: false, default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
