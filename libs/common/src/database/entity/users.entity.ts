import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { LoginType } from '../enum/login_type.enum';
import { Family } from './family.entity';
import { EducationProgress } from './education_progress.entity';
import { MemberFamily } from './member_family.entity';
import { Feedback } from './feedback.entity';

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
  isemailverified: boolean;

  @Column('boolean', { default: false })
  isphoneverified: boolean;

  @Column('boolean', { default: false })
  isadmin: boolean;

  @Column({
    type: 'enum',
    enum: LoginType,
    default: LoginType.LOCAL,
  })
  login_type: LoginType;

  @Column('varchar', { nullable: true })
  avatar: string;

  @Column('varchar', { nullable: true })
  genre: string;

  @Column('date', { nullable: true })
  birthdate: Date;

  @OneToMany(() => Family, (family) => family.owner_id)
  families: Family[];

  @OneToMany(
    () => EducationProgress,
    (educationProgress) => educationProgress.user,
  )
  educationProgresses: EducationProgress[];

  @OneToMany(() => MemberFamily, (memberFamily) => memberFamily.user)
  memberFamilies: MemberFamily[];

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];
}
