import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OTPType {
  RESET_PASSWORD = 'reset_password',
  VALIDATE_EMAIL = 'validate_email',
}

@Entity('otp')
export class OTP {
  @PrimaryGeneratedColumn()
  id_otp: number;

  @Column('uuid')
  id_user: string;

  @Column('varchar')
  code: string;

  @Column('varchar', { nullable: true })
  email: string;

  @Column('varchar', { nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: OTPType,
    nullable: true,
  })
  type: OTPType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('timestamp', { nullable: true })
  expired_at: Date;
}
