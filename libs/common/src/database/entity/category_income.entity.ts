import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('category_income') // Sửa đổi tên bảng tại đây nếu cần
export class CategoryIncome {
  @PrimaryGeneratedColumn()
  id_income: number;

  @Column('varchar')
  name: string;

  @Column('varchar', { nullable: true })
  description: string;
}
