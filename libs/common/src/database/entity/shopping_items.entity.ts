import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ShoppingItemTypes } from './shopping_item_types.entity';
import { ShoppingLists } from './shopping_lists.entity';

@Entity('shopping_items')
export class ShoppingItems {
  @PrimaryGeneratedColumn()
  id_item: number;

  @Column()
  id_list: number;

  @Column()
  id_item_type: number;

  @Column('varchar', { length: 255, nullable: false })
  item_name: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column({ nullable: false, default: 1 })
  quantity: number;

  @Column({ nullable: false, default: false })
  is_purchased: boolean;

  @Column({ nullable: false, default: 1 })
  priority_level: number;

  @Column({ nullable: true, default: new Date() })
  reminder_date: Date;

  @Column('money', { default: 0 })
  price: number;

  @ManyToOne(
    () => ShoppingItemTypes,
    (shopping_items) => shopping_items.shoppingItems,
  )
  @JoinColumn({ name: 'id_item_type' })
  itemType: ShoppingItemTypes;

  @ManyToOne(() => ShoppingLists, (shoppingItem) => shoppingItem.shoppingItems)
  @JoinColumn({ name: 'id_list' })
  shoppingList: ShoppingLists;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
