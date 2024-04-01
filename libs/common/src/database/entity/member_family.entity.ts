import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Users } from './users.entity';
import { Family } from './family.entity';
import { Role } from './role.entity';

@Entity('member_family')
export class MemberFamily {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'id_user' })
  id_user: Users;

  @ManyToOne(() => Family)
  @JoinColumn({ name: 'id_family' })
  id_family: Family;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'id_role' })
  role: Role;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
