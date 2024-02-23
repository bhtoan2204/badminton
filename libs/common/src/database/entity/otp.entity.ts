import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Users } from './users.entity';

@Entity('otp')
export class OTP {
  @PrimaryGeneratedColumn()
  otp_id: number;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'id_user' }) 
  owner_id: Users;

  @Column('varchar')
  code: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('timestamp', { nullable: true })
  expired_at: Date;
}
