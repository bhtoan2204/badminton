import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('key')
export class Key {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  key: string;
}
