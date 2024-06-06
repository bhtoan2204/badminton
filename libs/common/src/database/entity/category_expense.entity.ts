import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('category_expense')
export class CategoryExpense {
  @PrimaryGeneratedColumn()
  id_expense: number;

  @Column('varchar')
  name: string;

  @Column('varchar', { nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
