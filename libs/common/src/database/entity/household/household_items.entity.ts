import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HouseholdItemCategories } from './household_item_categories.entity';
import { Room } from './room.entity';
import { HouseholdDurableItems } from './household_durable_items.entity';
import { HouseholdConsumableItems } from './household_consumable_items.entity';

@Entity('household_items')
export class HouseholdItems {
  @PrimaryGeneratedColumn()
  id_household_item: number;

  @Column()
  id_family: number;

  @Column('varchar', { length: 255, nullable: false })
  item_name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { default: null })
  item_imageurl: string;

  @Column()
  id_category: number;

  @Column({ nullable: true })
  id_room: number | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(
    () => HouseholdItemCategories,
    (category) => category.householdItems,
  )
  @JoinColumn({ name: 'id_category' })
  category: HouseholdItemCategories;

  @ManyToOne(() => Room, (room) => room.householdItems, { nullable: true })
  @JoinColumn({ name: 'id_room' })
  room: Room | null;

  @OneToOne(
    () => HouseholdDurableItems,
    (durableItem) => durableItem.householdItem,
    { nullable: true },
  )
  durableItem: HouseholdDurableItems | null;

  @OneToOne(
    () => HouseholdConsumableItems,
    (consumableItem) => consumableItem.householdItem,
    { nullable: true },
  )
  consumableItem: HouseholdConsumableItems | null;
}
