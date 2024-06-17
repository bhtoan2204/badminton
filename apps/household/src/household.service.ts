import {
  DeleteFileRequest,
  HouseholdConsumableItems,
  HouseholdDurableItems,
  HouseholdItemCategories,
  HouseholdItems,
  UploadFileRequest,
} from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { EntityManager, Repository } from 'typeorm';
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
      const [data, totalCount] =
        await this.householdItemCategoriesRepository.findAndCount();
      return {
        data,
        totalCount,
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
      const [data, totalCount] =
        await this.householdItemsRepository.findAndCount({
          where: { id_family },
          take: itemsPerPage,
          skip: (page - 1) * itemsPerPage,
          relations: ['category', 'room'],
        });
      return {
        data,
        totalCount,
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
      const query =
        'SELECT * FROM f_create_household_item($1, $2, $3, $4, $5, $6, $7, $8)';
      const params = [
        id_user,
        id_family,
        item_name,
        id_room,
        item_description,
        id_category,
        item_type,
        item_imageUrl,
      ];
      const data = await this.entityManager.query(query, params);

      return {
        data: data[0],
        message: 'Item created',
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
      const query =
        'SELECT * FROM f_update_household_item($1, $2, $3, $4, $5, $6, $7, $8)';
      const params = [
        id_user,
        id_family,
        id_item,
        id_room,
        item_name,
        item_description,
        id_category,
        item_imageUrl,
      ];
      const data = await this.entityManager.query(query, params);
      const oldImageUrl = data[0].old_imageurl;
      if (oldImageUrl) {
        const deleteParams: DeleteFileRequest = {
          fileName: oldImageUrl.split('/').pop(),
        };
        await this.storageService.deleteImageHousehold(deleteParams);
      }
      delete data[0].old_imageurl;
      return {
        message: 'Updated Successfully',
        data: data[0],
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
      const query =
        'SELECT * FROM f_update_household_durable_item($1, $2, $3, $4)';
      const params = [id_user, id_family, id_item, condition];
      const data = await this.entityManager.query(query, params);
      return {
        message:
          data[0].f_update_household_durable_item || 'Updated Successfully',
      };
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
      const query =
        'SELECT * FROM f_update_household_consumable_item($1, $2, $3, $4, $5, $6)';
      const params = [
        id_user,
        id_family,
        id_item,
        quantity,
        threshold,
        expired_date,
      ];
      const data = await this.entityManager.query(query, params);
      return {
        message:
          data[0].f_update_household_consumable_item || 'Updated Successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteItem(id_user: string, id_family: number, id_item: number) {
    try {
      const query = 'SELECT * FROM f_delete_household_item($1, $2, $3)';
      const params = [id_user, id_family, id_item];
      const data = await this.entityManager.query(query, params);
      const imageUrl = data[0].f_delete_household_item;
      if (imageUrl) {
        const deleteParams: DeleteFileRequest = {
          fileName: imageUrl.split('/').pop(),
        };
        await this.storageService.deleteImageHousehold(deleteParams);
      }
      return { message: 'Deleted Successfully' };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
