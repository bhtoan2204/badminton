import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Family } from './family.entity';
import { ShoppingItems } from './shopping_items.entity';
import { ShoppingListTypes } from './shopping_list_type.entity';

@Entity('shopping_lists')
export class ShoppingLists {
  @PrimaryGeneratedColumn()
  id_list: number;

  @Column()
  id_family: number;

  @Column()
  id_shopping_list_type: number;

  @Column('varchar', { length: 255, nullable: false })
  title: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('varchar', { length: 255, nullable: true })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Family, (family) => family.shoppingLists)
  @JoinColumn({ name: 'id_family' })
  family: Family;

  @ManyToOne(
    () => ShoppingListTypes,
    (shopping_list) => shopping_list.shoppingLists,
  )
  @JoinColumn({ name: 'id_shopping_list_type' })
  listType: ShoppingListTypes;

  @OneToMany(() => ShoppingItems, (shoppingItem) => shoppingItem.shoppingList)
  shoppingItems: ShoppingItems[];
}
