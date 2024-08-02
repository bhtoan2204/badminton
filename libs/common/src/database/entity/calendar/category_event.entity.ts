import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('category_event')
export class CategoryEvent {
  @PrimaryGeneratedColumn()
  id_category_event: number;

  @Column('int', { nullable: false })
  id_family: number;

  @Column('varchar', {
    length: 255,
    nullable: false,
    default: 'Default Title of Category Event',
  })
  title: string;

  @Column('varchar', { length: 255, nullable: false, default: '#000000' })
  color: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
