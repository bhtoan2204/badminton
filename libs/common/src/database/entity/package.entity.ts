import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('package')
export class Package {
  @PrimaryGeneratedColumn()
  id_package: number;

  @Column('varchar')
  name: string;

  @Column('money')
  price: number;

  @Column('varchar', { nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
