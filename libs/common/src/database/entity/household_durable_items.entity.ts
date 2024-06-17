import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { HouseholdItems } from './household_items.entity';

@Entity('household_durable_items')
export class HouseholdDurableItems {
  @PrimaryColumn()
  id_household_item: number;

  @Column('varchar', { length: 255, nullable: false })
  condition: string;

  @OneToOne(() => HouseholdItems, (householdItem) => householdItem.durableItem)
  @JoinColumn({ name: 'id_household_item' })
  householdItem: HouseholdItems;
}
