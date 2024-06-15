import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('package_main')
export class PackageMain {
  @PrimaryGeneratedColumn()
  id_main_package: number;

  @Column('varchar', { nullable: false })
  name: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('money', { nullable: false })
  price: number;

  @Column('boolean', { default: true })
  is_active: boolean;

  @Column('int', { nullable: false })
  duration_months: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
