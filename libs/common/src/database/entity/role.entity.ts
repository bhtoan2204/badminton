import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id_role: number;

  @Column('varchar')
  name: string;

  @Column('varchar', { nullable: true })
  description: string;
}
