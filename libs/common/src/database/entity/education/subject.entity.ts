import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EducationProgress } from './education_progress.entity';

export enum EducationStatus {
  in_progress = 'in_progress',
  completed = 'completed',
}

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
  component_scores: {
    component_name: string;
    score: number;
    target_score: number;
    maximum_score: number;
    created_at: Date;
    updated_at: Date;
  }[];

  @Column('enum', {
    nullable: true,
    default: EducationStatus.in_progress,
    enum: EducationStatus,
  })
  status: EducationStatus;

  @ManyToOne(
    () => EducationProgress,
    (educationProgress) => educationProgress.subjects,
  )
  @JoinColumn({ name: 'id_education_progress' })
  educationProgress: EducationProgress;
}
