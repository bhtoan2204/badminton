import {
  ShoppingItems,
  ShoppingItemTypes,
  ShoppingLists,
  ShoppingListTypes,
} from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { SerperService } from './serper/serper.service';

@Injectable()
export class ShoppingService {
  constructor(
    @InjectRepository(ShoppingItems)
    private shoppingItemsRepository: Repository<ShoppingItems>,
    @InjectRepository(ShoppingItemTypes)
    private shoppingItemTypesRepository: Repository<ShoppingItemTypes>,
    @InjectRepository(ShoppingLists)
    private shoppingListsRepository: Repository<ShoppingLists>,
    @InjectRepository(ShoppingListTypes)
    private shoppingListTypesRepository: Repository<ShoppingListTypes>,
    private serperService: SerperService,
  ) {}

  async getShoppingItemType(search: string) {
    try {
      const option = {};
      if (search)
        option['where'] = [
          { item_type_name_en: Like(`%${search}%`) },
          { item_type_name_vn: Like(`%${search}%`) },
        ];
      const data = await this.shoppingItemTypesRepository.find(option);
      return {
        data: data,
        message: 'Get shopping item type',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getShoppingList(
    id_user: string,
    dto: {
      id_family: number;
      page: number;
      itemsPerPage: number;
      sortBy: string;
      sortDirection: 'ASC' | 'DESC';
    },
  ) {
    try {
      const option = {
        where: { id_family: dto.id_family },
        skip: (dto.page - 1) * dto.itemsPerPage,
        take: dto.itemsPerPage,
        relations: ['listType'],
      };
      if (dto.sortBy && dto.sortDirection)
        option['order'] = { [dto.sortBy]: dto.sortDirection };

      const [data, total] =
        await this.shoppingListsRepository.findAndCount(option);
      return {
        data: data,
        total: total,
        message: 'Get shopping list',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getShoppingItem(
    id_user: string,
    dto: {
      id_family: number;
      id_list: number;
      page: number;
      itemsPerPage: number;
      sortBy: string;
      sortDirection: 'ASC' | 'DESC';
    },
  ) {
    try {
      const shoppingList = await this.shoppingListsRepository.findOne({
        where: { id_list: dto.id_list, id_family: dto.id_family },
      });
      if (!shoppingList) {
        throw new RpcException({
          message: 'Shopping list not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      const option = {
        where: { id_list: dto.id_list },
        skip: (dto.page - 1) * dto.itemsPerPage,
        take: dto.itemsPerPage,
        relations: ['itemType'],
      };
      if (dto.sortBy && dto.sortDirection)
        option['order'] = { [dto.sortBy]: dto.sortDirection };

      const [data, total] =
        await this.shoppingItemsRepository.findAndCount(option);
      return {
        data: data,
        total: total,
        message: 'Get shopping item',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createShoppingList(id_user: string, dto: any) {
    try {
      const { id_family, id_shopping_list_type, title, description } = dto;
      const newShoppingList = new ShoppingLists();
      newShoppingList.id_family = id_family;
      newShoppingList.title = title;
      newShoppingList.description = description;
      newShoppingList.id_shopping_list_type = id_shopping_list_type;
      const data = await this.shoppingListsRepository.save(newShoppingList);
      return {
        data: data,
        message: 'Create shopping list',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createShoppingItem(id_user: string, dto: any) {
    try {
      const {
        id_list,
        item_name,
        quantity,
        id_item_type,
        priority_level,
        reminder_date,
        price,
        description,
      } = dto;
      const newShoppingItem = new ShoppingItems();
      newShoppingItem.id_list = id_list;
      newShoppingItem.item_name = item_name;
      newShoppingItem.quantity = quantity;
      newShoppingItem.id_item_type = id_item_type;
      newShoppingItem.priority_level = priority_level;
      newShoppingItem.reminder_date = reminder_date;
      newShoppingItem.price = price;
      newShoppingItem.description = description;
      const data = await this.shoppingItemsRepository.save(newShoppingItem);
      return {
        data: data,
        message: 'Create shopping item',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getShoppingListType(search: string) {
    try {
      const option = {};
      if (search)
        option['where'] = [
          { type_name_en: Like(`%${search}%`) },
          { type_name_vn: Like(`%${search}%`) },
        ];
      const [data, total] =
        await this.shoppingListTypesRepository.findAndCount(option);
      return {
        total: total,
        data: data,
        message: 'Get shopping list type',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateShoppingList(id_user: string, dto: any) {
    try {
      const { id_list, title, description, status, id_shopping_list_type } =
        dto;
      const shoppingList = await this.shoppingListsRepository.findOne({
        where: { id_list: id_list },
      });
      if (!shoppingList) {
        throw new RpcException({
          message: 'Shopping list not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      if (id_shopping_list_type) {
        const shoppingListType = await this.shoppingListTypesRepository.findOne(
          {
            where: { id_shopping_list_type: id_shopping_list_type },
          },
        );
        if (!shoppingListType) {
          throw new RpcException({
            message: 'Shopping list type not found',
            statusCode: HttpStatus.NOT_FOUND,
          });
        }
        shoppingList.id_shopping_list_type = id_shopping_list_type;
      }
      if (title) shoppingList.title = title;
      if (description) shoppingList.description = description;
      if (status) shoppingList.status = status;
      const data = await this.shoppingListsRepository.save(shoppingList);
      return {
        data: data,
        message: 'Update shopping list',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateShoppingItem(id_user: string, dto: any) {
    try {
      const {
        id_item,
        id_list,
        item_name,
        quantity,
        is_purchased,
        priority_level,
        reminder_date,
        price,
        description,
        id_item_type,
      } = dto;
      const shoppingItem = await this.shoppingItemsRepository.findOne({
        where: { id_item: id_item, id_list: id_list },
      });
      if (!shoppingItem) {
        throw new RpcException({
          message: 'Shopping item not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      if (id_list) shoppingItem.id_list = id_list;
      if (item_name) shoppingItem.item_name = item_name;
      if (quantity) shoppingItem.quantity = quantity;
      if (is_purchased) shoppingItem.is_purchased = is_purchased;
      if (priority_level) shoppingItem.priority_level = priority_level;
      if (reminder_date) shoppingItem.reminder_date = reminder_date;
      if (price) shoppingItem.price = price;
      if (description) shoppingItem.description = description;
      if (id_item_type) shoppingItem.id_item_type = id_item_type;
      const data = await this.shoppingItemsRepository.save(shoppingItem);
      return {
        data: data,
        message: 'Update shopping item',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteShoppingList(
    id_user: string,
    id_family: number,
    id_list: number,
  ) {
    try {
      const deletedShoppingItems = await this.shoppingItemsRepository.find({
        where: { id_list: id_list },
      });
      const deletedShoppingList = await this.shoppingListsRepository.findOne({
        where: { id_list: id_list },
      });
      if (!deletedShoppingList) {
        throw new RpcException({
          message: 'Shopping list not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      const shoppingItems =
        await this.shoppingItemsRepository.remove(deletedShoppingItems);
      const shoppingList =
        await this.shoppingListsRepository.remove(deletedShoppingList);
      return {
        message: 'Delete shopping list',
        data: { shoppingItems, shoppingList },
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteShoppingItem(
    id_user: number,
    id_family: number,
    id_list: number,
    id_item: number,
  ) {
    try {
      const deletedShoppingItem = await this.shoppingItemsRepository.findOne({
        where: { id_item: id_item, id_list: id_list },
      });
      if (!deletedShoppingItem) {
        throw new RpcException({
          message: 'Shopping item not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      const shoppingItem =
        await this.shoppingItemsRepository.remove(deletedShoppingItem);
      return {
        message: 'Delete shopping item',
        data: shoppingItem,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getSuggestions(
    id_user: number,
    id_family: number,
    id_list: number,
    id_item: number,
  ) {
    try {
      const item = await this.shoppingItemsRepository.findOne({
        where: { id_item: id_item, id_list: id_list },
      });
      if (!item) {
        throw new RpcException({
          message: 'Shopping item not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      const data = await this.serperService.getShoppingSuggestions(
        item.item_name,
      );
      return {
        data: data,
        message: 'Get suggestions',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
