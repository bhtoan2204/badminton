import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Family } from './family.entity';

@Entity('family_invitation')
export class FamilyInvitation {
  @PrimaryGeneratedColumn()
  id_invitation: number;

  @Column('int')
  id_family: number;

  @Column('varchar', { length: 255, nullable: false })
  code: string;

  @OneToOne(() => Family, (family) => family.family_invitation)
  @JoinColumn({ name: 'id_family' })
  family: Family;
}
