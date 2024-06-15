import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('package_combo')
export class PackageCombo {
  @PrimaryGeneratedColumn()
  id_combo_package: number;

  @Column('varchar', { nullable: false })
  name: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('int', { nullable: false })
  id_package_extra: number[];

  @Column('boolean', { nullable: false })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
