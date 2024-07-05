import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Checklist } from './checklist.entity';

@Entity('checklist_type')
export class ChecklistType {
  @PrimaryGeneratedColumn()
  id_checklist_type: number;

  @Column('varchar', { length: 255, nullable: false, unique: true })
  name_en: string;

  @Column('varchar', { length: 255, nullable: false, unique: true })
  name_vn: string;

  @Column('text', { nullable: true })
  icon_url: string;

  @OneToMany(() => Checklist, (checklist) => checklist.checklistType)
  checklists: Checklist[];
}
