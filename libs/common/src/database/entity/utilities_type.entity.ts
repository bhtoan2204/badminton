import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Utilities } from './utilities.entity';

@Entity('utilities_type')
export class UtilitiesType {
  @PrimaryGeneratedColumn()
  id_utilities_type: number;

  @Column('varchar', { length: 255, nullable: false, unique: true })
  name_en: string;

  @Column('varchar', { length: 255, nullable: false, unique: true })
  name_vn: string;

  @OneToMany(() => Utilities, (utilities) => utilities.utilitiesType)
  utilities: Utilities[];
}
