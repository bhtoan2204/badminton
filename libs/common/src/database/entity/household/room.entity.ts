import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
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

  @OneToMany(() => HouseholdItems, (householdItems) => householdItems.room)
  householdItems: HouseholdItems[];
}
