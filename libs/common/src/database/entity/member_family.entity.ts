import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Column,
} from 'typeorm';
import { Users } from './users.entity';
import { Family } from './family.entity';

export enum FamilyRole {
  MEMBER = 'Member',
  OWNER = 'Owner',
}

@Entity('member_family')
export class MemberFamily {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_user: string;

  @Column()
  id_family: number;

  @Column({ nullable: true, default: 'Member', type: 'enum', enum: FamilyRole })
  role: FamilyRole;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Users, (user) => user.id_user)
  @JoinColumn({ name: 'id_user' })
  user: Users;

  @ManyToOne(() => Family, (family) => family.id_family)
  @JoinColumn({ name: 'id_family' })
  family: Family;
}
