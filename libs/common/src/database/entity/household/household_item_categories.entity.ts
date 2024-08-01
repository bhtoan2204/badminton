import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HouseholdItems } from './household_items.entity';

@Entity('household_item_categories')
export class HouseholdItemCategories {
  @PrimaryGeneratedColumn()
  id_household_item_category: number;

  @Column('varchar', { length: 255, nullable: false })
  category_name: string;

  @OneToMany(() => HouseholdItems, (householdItems) => householdItems.category)
  householdItems: HouseholdItems[];
}
