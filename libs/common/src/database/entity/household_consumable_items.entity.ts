import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { HouseholdItems } from './household_items.entity';

@Entity('household_consumable_items')
export class HouseholdConsumableItems {
  @PrimaryColumn()
  id_household_item: number;

  @Column('int', { nullable: false })
  quantity: number;

  @Column('int', { nullable: false })
  threshold: number;

  @Column('date', { nullable: true })
  expired_date: Date;

  @OneToOne(() => HouseholdItems, (householdItem) => householdItem.durableItem)
  @JoinColumn({ name: 'id_household_item' })
  householdItem: HouseholdItems;
}
