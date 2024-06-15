import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('package_extra')
export class PackageExtra {
  @PrimaryGeneratedColumn()
  id_extra_package: number;

  @Column('varchar')
  name: string;

  @Column('money')
  price: number;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('boolean', { default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
