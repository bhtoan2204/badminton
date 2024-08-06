import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
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

  @Column('boolean', { nullable: false, default: false })
  is_shared: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Subjects, (subject) => subject.educationProgress, {
    cascade: ['remove'],
  })
  subjects: Subjects[];
}
