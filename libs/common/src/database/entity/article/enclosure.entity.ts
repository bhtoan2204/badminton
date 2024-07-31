import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('enclosure')
export class Enclosure {
  @PrimaryGeneratedColumn()
  id_enclosure: number;

  @Column()
  type: string;

  @Column()
  length: string;

  @Column()
  url: string;
}
