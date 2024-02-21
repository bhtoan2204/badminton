import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('category_expense')
export class CategoryExpense {
  @PrimaryGeneratedColumn()
  id_expense: number;

  @Column('varchar')
  name: string;

  @Column('varchar', { nullable: true })
  description: string;
}
