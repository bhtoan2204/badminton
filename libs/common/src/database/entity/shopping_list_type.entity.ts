import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ShoppingLists } from './shopping_lists.entity';

@Entity('shopping_list_types')
export class ShoppingListTypes {
  @PrimaryGeneratedColumn()
  id_shopping_list_type: number;

  @Column('varchar', { length: 255, nullable: false, unique: true })
  type_name_en: string;

  @Column('varchar', { length: 255, nullable: false, unique: true })
  type_name_vn: string;

  @Column('text', { nullable: true })
  icon_url: string;

  @OneToMany(() => ShoppingLists, (shoppingList) => shoppingList.listType)
  shoppingLists: ShoppingLists[];
}
