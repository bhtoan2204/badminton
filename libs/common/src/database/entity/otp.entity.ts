import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity'; // Giả sử bạn đã định nghĩa entity này

@Entity('otp')
export class OTP {
  @PrimaryGeneratedColumn()
  otp_id: number;

  @ManyToOne(() => User)
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

  @Column('bit', { nullable: true })
  active: boolean;
}
