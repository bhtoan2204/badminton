import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('family')
export class Family {
  @PrimaryGeneratedColumn()
  id_family: number;

  @Column('int')
  quantity: number;

  @Column('varchar', { nullable: true })
  description: string;
}
