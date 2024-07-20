import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('discount')
export class Discount {
  @PrimaryGeneratedColumn()
  id_discount: number;

  @Column('varchar', { length: 255, nullable: false })
  code: string;

  @Column('integer', { nullable: false })
  percentage: number;
}
