import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { LoginType } from '../enum/login_type.enum';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id_user: string;

  @Column('varchar', { nullable: true })
  email: string;

  @Column('varchar', { nullable: true })
  phone: string;

  @Column('varchar', { nullable: true })
  password: string;

  @Column('varchar', { nullable: true })
  firstname: string;

  @Column('varchar', { nullable: true })
  lastname: string;

  @Column('varchar', { nullable: true })
  language: string;

  @Column('boolean', { default: false })
  twofa: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('boolean', { default: false })
  isphoneverified: boolean;

  @Column('boolean', { default: false })
  isadmin: boolean;

  @Column({
    type: 'enum',
    enum: LoginType,
    default: LoginType.LOCAL
  })
  login_type: LoginType;

  // @ManyToOne(() => Family)
  // @JoinColumn({ name: 'id_family' }) 
  // id_family: Family;

  @Column('varchar', { nullable: true })
  avatar: string;
}
