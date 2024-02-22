import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Users } from './users.entity';
import { Family } from './family.entity';
import { Role } from './role.entity';

@Entity('member_family')
export class MemberFamily {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'id_user' }) 
  id_user: string;

  @ManyToOne(() => Family)
  @JoinColumn({ name: 'id_family' }) 
  id_family: number;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'id_role' }) 
  role: number;



  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
