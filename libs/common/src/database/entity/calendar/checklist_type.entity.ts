import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Checklist } from './checklist.entity';

@Entity('checklist_type')
@Unique(['name_en', 'id_family'])
@Unique(['name_vn', 'id_family'])
export class ChecklistType {
  @PrimaryGeneratedColumn()
  id_checklist_type: number;

  @Column('varchar', { length: 255, nullable: false })
  name_en: string;

  @Column('varchar', { length: 255, nullable: false })
  name_vn: string;

  @Column('int', { nullable: false })
  id_family: number;

  @Column('text', { nullable: true })
  icon_url: string;

  @OneToMany(() => Checklist, (checklist) => checklist.checklistType)
  checklists: Checklist[];
}
