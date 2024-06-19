import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EducationProgress } from './education_progress.dto';

@Entity('subject')
export class Subjects {
  @PrimaryGeneratedColumn()
  id_subject: number;

  @Column('int', { nullable: false })
  id_education_progress: number;

  @Column('varchar', { nullable: false })
  subject_name: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('json', { nullable: true })
  component_scores: { component_name: string; score: number }[];

  @Column('int', { nullable: true, default: null })
  midterm_score: number;

  @Column('int', { nullable: true, default: null })
  final_score: number;

  @Column('int', { nullable: true, default: null })
  bonus_score: number;

  @Column('varchar', { nullable: true, default: 'in_progress' })
  status: string;

  @ManyToOne(
    () => EducationProgress,
    (educationProgress) => educationProgress.subjects,
  )
  @JoinColumn({ name: 'id_education_progress' })
  educationProgress: EducationProgress;
}
