import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity('frequently_question')
export class FrequentlyQuestionMetaData {
  @Column({ type: 'int', primary: true, generated: true })
  id: number;

  @Column({ type: 'varchar' })
  question: string;

  @Column({ type: 'varchar' })
  answer: string;

  @Column({ type: 'varchar' })
  answer_vn: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
