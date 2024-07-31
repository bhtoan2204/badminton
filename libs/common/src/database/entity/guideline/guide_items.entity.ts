import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('guide_items')
export class GuideItems {
  @PrimaryGeneratedColumn()
  id_guide_item: number;

  @Column()
  id_family: number;

  @Column('varchar', { length: 255, nullable: false })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('json', { nullable: true })
  steps: { name: string; description: string; imageUrl: string }[];

  @Column('boolean', { default: false })
  is_shared: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
