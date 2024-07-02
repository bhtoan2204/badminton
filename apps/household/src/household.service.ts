import {
  HouseholdConsumableItems,
  HouseholdDurableItems,
  HouseholdItemCategories,
  HouseholdItems,
  UploadFileRequest,
} from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { EntityManager, Repository, Brackets } from 'typeorm';
import { StorageService } from './storage/storage.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class HouseholdService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly storageService: StorageService,
    @InjectRepository(HouseholdItems)
    private readonly householdItemsRepository: Repository<HouseholdItems>,
    @InjectRepository(HouseholdItemCategories)
    private readonly householdItemCategoriesRepository: Repository<HouseholdItemCategories>,
    @InjectRepository(HouseholdDurableItems)
    private readonly householdDurableItemsRepository: Repository<HouseholdDurableItems>,
    @InjectRepository(HouseholdConsumableItems)
    private readonly householdConsumableItemsRepository: Repository<HouseholdConsumableItems>,
  ) {}

  async getCategory() {
    try {
      const [data, total] =
        await this.householdItemCategoriesRepository.findAndCount();
      return {
        data,
        total,
        message: 'Categories retrieved successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getItem(
    id_user: string,
    id_family: number,
    page: number,
    itemsPerPage: number,
  ) {
    try {
      const [data, total] = await this.householdItemsRepository.findAndCount({
        where: { id_family },
        take: itemsPerPage,
        skip: (page - 1) * itemsPerPage,
        relations: ['category', 'room'],
      });
      return {
        data,
        total,
        message: 'Items retrieved successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getItemDetail(id_user: string, id_family: number, id_item: number) {
    try {
      const data = await this.householdItemsRepository.findOne({
        where: { id_family, id_household_item: id_item },
        relations: ['category', 'room', 'durableItem', 'consumableItem'],
      });

      return data;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createItem(id_user: string, dto: any, file: any) {
    const {
      id_family,
      item_name,
      id_category,
      item_description,
      item_type,
      id_room,
    } = dto;
    let item_imageUrl = null;
    if (file) {
      const fileName = 'household_' + id_user + '_' + Date.now();
      const params: UploadFileRequest = {
        fileName: fileName,
        file: new Uint8Array(file.buffer.data),
      };
      const uploadImageData =
        await this.storageService.uploadImageHousehold(params);
      item_imageUrl = uploadImageData.fileUrl;
    }
    try {
      const newHouseHoldItem = this.householdItemsRepository.create({
        id_family: id_family,
        item_name: item_name,
        description: item_description,
        item_imageurl: item_imageUrl,
        id_category: id_category,
        id_room: id_room,
      });
      const data = await this.householdItemsRepository.save(newHouseHoldItem);
      if (item_type === 'durable') {
        const durableItem = this.householdDurableItemsRepository.create({
          id_household_item: data.id_household_item,
          condition: 'good',
        });
        await this.householdDurableItemsRepository.save(durableItem);
      } else {
        const consumableItem = this.householdConsumableItemsRepository.create({
          id_household_item: data.id_household_item,
          quantity: 0,
          threshold: 0,
          expired_date: null,
        });
        await this.householdConsumableItemsRepository.save(consumableItem);
      }
      return {
        message: 'Item created successfully',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateItem(id_user: string, dto: any, file: any) {
    try {
      const {
        id_family,
        id_item,
        item_name,
        id_category,
        item_description,
        id_room,
      } = dto;
      const item = await this.householdItemsRepository.findOne({
        where: { id_family, id_household_item: id_item },
      });
      if (!item) {
        throw new RpcException({
          message: 'Item not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      let item_imageUrl = null;
      if (file) {
        const fileName = 'household_' + id_user + '_' + Date.now();
        const params: UploadFileRequest = {
          fileName: fileName,
          file: new Uint8Array(file.buffer.data),
        };
        const uploadImageData =
          await this.storageService.uploadImageHousehold(params);
        item_imageUrl = uploadImageData.fileUrl;
      }
      if (item_name) {
        item.item_name = item_name;
      }
      if (id_category) {
        item.id_category = id_category;
      }
      if (item_description) {
        item.description = item_description;
      }
      if (id_room) {
        item.id_room = id_room;
      }
      if (item_imageUrl) {
        item.item_imageurl = item_imageUrl;
      }
      const data = await this.householdItemsRepository.save(item);
      return {
        message: 'Item updated successfully',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async inputDurableItem(id_user: string, dto: any) {
    try {
      const { id_family, id_item, condition } = dto;

      // Verify the existence of the household item
      const householdItem = await this.householdItemsRepository.findOne({
        where: { id_family, id_household_item: id_item },
      });

      if (!householdItem) {
        throw new RpcException({
          message: 'Household item not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      let durableItem = await this.householdDurableItemsRepository.findOne({
        where: { id_household_item: id_item },
      });

      if (durableItem) {
        durableItem.condition = condition;
      } else {
        durableItem = this.householdDurableItemsRepository.create({
          id_household_item: id_item,
          condition: condition,
        });
      }

      await this.householdDurableItemsRepository.save(durableItem);

      return { message: 'Durable item saved successfully', data: durableItem };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async inputConsumableItem(id_user: string, dto: any) {
    try {
      const { id_family, id_item, quantity, threshold, expired_date } = dto;
      const householdItem = await this.householdItemsRepository.findOne({
        where: { id_family, id_household_item: id_item },
      });

      if (!householdItem) {
        throw new RpcException({
          message: 'Household item not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      let consumableItem =
        await this.householdConsumableItemsRepository.findOne({
          where: { id_household_item: id_item },
        });

      if (consumableItem) {
        consumableItem.quantity = quantity;
        consumableItem.threshold = threshold;
        consumableItem.expired_date = expired_date;
      } else {
        consumableItem = this.householdConsumableItemsRepository.create({
          id_household_item: id_item,
          quantity: quantity,
          threshold: threshold,
          expired_date: expired_date,
        });
      }

      await this.householdConsumableItemsRepository.save(consumableItem);

      return { message: 'Consumable item saved successfully', consumableItem };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteItem(id_user: string, id_family: number, id_item: number) {
    try {
      const item = await this.householdItemsRepository.findOne({
        where: { id_family, id_household_item: id_item },
        relations: ['durableItem', 'consumableItem'],
      });

      if (!item) {
        throw new RpcException({
          message: 'Item not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      if (item.durableItem) {
        await this.householdDurableItemsRepository.delete({
          id_household_item: id_item,
        });
      }
      if (item.consumableItem) {
        await this.householdConsumableItemsRepository.delete({
          id_household_item: id_item,
        });
      }
      await this.householdItemsRepository.delete({
        id_family,
        id_household_item: id_item,
      });

      return { message: 'Item deleted successfully' };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getLowConditionItem(id_user: string, id_family: number) {
    try {
      const queryBuilder = this.householdItemsRepository
        .createQueryBuilder('household_items')
        .leftJoinAndSelect('household_items.durableItem', 'durableItem')
        .leftJoinAndSelect('household_items.consumableItem', 'consumableItem')
        .where('household_items.id_family = :id_family', { id_family })
        .andWhere(
          new Brackets((qb) => {
            qb.where('durableItem.condition IN (:...conditions)', {
              conditions: ['worn', 'refurbished', 'poor'],
            }).orWhere(
              'consumableItem.threshold * 5 <= consumableItem.quantity',
            );
          }),
        );

      const items = await queryBuilder.getMany();
      return items;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
