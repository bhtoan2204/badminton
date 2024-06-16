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

@Entity('family')
export class Family {
  @PrimaryGeneratedColumn()
  id_family: number;

  @Column('int')
  quantity: number;

  @Column('varchar', { nullable: false })
  name: string;

  @Column('varchar', { nullable: true })
  description: string;

  @ManyToOne(() => Users, (user) => user.families)
  @JoinColumn({ name: 'owner_id' })
  owner_id: Users;

  @Column('date', { nullable: true })
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
}
