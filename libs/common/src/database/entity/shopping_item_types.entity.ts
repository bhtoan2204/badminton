import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ShoppingItems } from './shopping_items.entity';

@Entity('shopping_item_types')
export class ShoppingItemTypes {
  @PrimaryGeneratedColumn()
  id_item_type: number;

  @Column('varchar', { length: 255, nullable: false, unique: true })
  item_type_name_en: string;

  @Column('varchar', { length: 255, nullable: false, unique: true })
  item_type_name_vn: string;

  @Column('text', { nullable: true })
  icon_url: string;

  @OneToMany(() => ShoppingItems, (shoppingItem) => shoppingItem.itemType)
  shoppingItems: ShoppingItems[];
}
