import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Family } from './family.entity';
import { Users } from './users.entity';
import { Subjects } from './subject.entity';

@Entity('education_progress')
export class EducationProgress {
  @PrimaryGeneratedColumn()
  id_education_progress: number;

  @Column('int', { nullable: false })
  id_family: number;

  @Column('uuid', { nullable: false })
  id_user: string;

  @Column('varchar', { nullable: false })
  title: string;

  @Column('varchar', { nullable: false })
  progress_notes: string;

  @Column('varchar', { nullable: false })
  school_info: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Family, (family) => family.educationProgresses)
  @JoinColumn({ name: 'id_family' })
  family: Family;

  @ManyToOne(() => Users, (user) => user.educationProgresses)
  @JoinColumn({ name: 'id_user' })
  user: Users;

  @OneToMany(() => Subjects, (subject) => subject.educationProgress, {
    cascade: ['remove'],
  })
  subjects: Subjects[];
}
