import { Entity, Column, PrimaryGeneratedColumn , CreateDateColumn, UpdateDateColumn} from 'typeorm';

@Entity('category_income') // Sửa đổi tên bảng tại đây nếu cần
export class CategoryIncome {
  @PrimaryGeneratedColumn()
  id_income: number;

  @Column('varchar')
  name: string;

  @Column('varchar', { nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
