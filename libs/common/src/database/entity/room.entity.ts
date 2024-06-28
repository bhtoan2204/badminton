import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Family } from './family.entity';
import { HouseholdItems } from './household_items.entity';

@Entity('room')
@Unique(['id_room', 'room_name'])
export class Room {
  @PrimaryGeneratedColumn()
  id_room: number;

  @Column()
  id_family: number;

  @Column('varchar', { length: 255, nullable: false })
  room_name: string;

  @Column('varchar', { nullable: true, default: null })
  room_image: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Family, (family) => family.rooms)
  @JoinColumn({ name: 'id_family' })
  family: Family;

  @OneToMany(() => HouseholdItems, (householdItems) => householdItems.room)
  householdItems: HouseholdItems[];
}
