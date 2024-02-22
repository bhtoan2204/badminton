import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('otp')
export class OTP {
  @PrimaryGeneratedColumn()
  otp_id: number;

  @Column('uuid', { nullable: true })
  owner_id: string;

  @Column('varchar')
  code: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('timestamp', { nullable: true })
  expired_at: Date;
}
