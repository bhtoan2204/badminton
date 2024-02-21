import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('package')
export class Package {
  @PrimaryGeneratedColumn()
  id_package: number;

  @Column('varchar')
  name: string;

  @Column('money')
  price: string;

  @Column('varchar', { nullable: true })
  description: string;
}
