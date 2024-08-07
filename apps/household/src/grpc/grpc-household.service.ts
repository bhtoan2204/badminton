import {
  FindHouseholdByIdsRequest,
  FindOneHouseholdByIdRequest,
  HouseholdItemCategories,
  HouseholdItemCategoryRpc,
  HouseholdItemRpc,
  HouseholdItems,
  HouseholdResponse,
  HouseholdsResponse,
  Room,
  RoomRpc,
  UpdateOneByIdRequest,
} from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class GrpcHouseholdService {
  constructor(
    @InjectRepository(HouseholdItems)
    private householdItemsRepository: Repository<HouseholdItems>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(HouseholdItemCategories)
    private householdItemCategoriesRepository: Repository<HouseholdItemCategories>,
  ) {}

  async findOneById(
    request: FindOneHouseholdByIdRequest,
  ): Promise<HouseholdResponse> {
    try {
      const { idHousehold, idFamily } = request;
      const householdItems = await this.householdItemsRepository.findOne({
        where: { id_household_item: idHousehold, id_family: idFamily },
        relations: ['room', 'category'],
      });
      if (!householdItems) {
        throw new RpcException({
          message: 'Household item not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      const room: Room = householdItems.room;
      const category: HouseholdItemCategories = householdItems.category;
      const householdResult: HouseholdItemRpc = {
        idHouseholdItem: householdItems.id_household_item,
        idGuideItem: householdItems.id_guide_item,
        idFamily: householdItems.id_family,
        itemName: householdItems.item_name,
        description: householdItems.description,
        itemImageurl: householdItems.item_imageurl,
        idCategory: householdItems.id_category,
        idRoom: householdItems.id_room,
        createdAt: householdItems.created_at.toISOString(),
        updatedAt: householdItems.updated_at.toISOString(),
      };
      const roomResult: RoomRpc = {
        idRoom: room.id_room,
        idFamily: room.id_family,
        roomName: room.room_name,
        roomImage: room.room_image,
        createdAt: room.created_at.toISOString(),
        updatedAt: room.updated_at.toISOString(),
      };
      const categoryResult: HouseholdItemCategoryRpc = {
        idHouseholdItemCategory: category.id_household_item_category,
        categoryName: category.category_name,
      };
      return {
        householdItem: householdResult,
        room: roomResult,
        category: categoryResult,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateOneById(req: UpdateOneByIdRequest): Promise<HouseholdResponse> {
    try {
      const { idGuideItem, idFamily, idHouseholdItem } = req;

      const householdItems = await this.householdItemsRepository.findOne({
        where: { id_household_item: idHouseholdItem, id_family: idFamily },
        relations: ['room', 'category'],
      });
      if (!householdItems) {
        throw new RpcException({
          message: 'Household item not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      if (householdItems.id_guide_item !== null) {
        throw new RpcException({
          message: 'Household item already exists',
          statusCode: HttpStatus.CONFLICT,
        });
      }

      householdItems.id_guide_item = idGuideItem;

      const savedHouseholdItems =
        await this.householdItemsRepository.save(householdItems);

      const room: Room = savedHouseholdItems.room;
      const category: HouseholdItemCategories = savedHouseholdItems.category;
      const householdResult: HouseholdItemRpc = {
        idHouseholdItem: savedHouseholdItems.id_household_item,
        idGuideItem: savedHouseholdItems.id_guide_item,
        idFamily: savedHouseholdItems.id_family,
        itemName: savedHouseholdItems.item_name,
        description: savedHouseholdItems.description,
        itemImageurl: savedHouseholdItems.item_imageurl,
        idCategory: savedHouseholdItems.id_category,
        idRoom: savedHouseholdItems.id_room,
        createdAt: savedHouseholdItems.created_at.toISOString(),
        updatedAt: savedHouseholdItems.updated_at.toISOString(),
      };
      const roomResult: RoomRpc = {
        idRoom: room.id_room,
        idFamily: room.id_family,
        roomName: room.room_name,
        roomImage: room.room_image,
        createdAt: room.created_at.toISOString(),
        updatedAt: room.updated_at.toISOString(),
      };
      const categoryResult: HouseholdItemCategoryRpc = {
        idHouseholdItemCategory: category.id_household_item_category,
        categoryName: category.category_name,
      };
      return {
        householdItem: householdResult,
        room: roomResult,
        category: categoryResult,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findByIds(req: FindHouseholdByIdsRequest): Promise<HouseholdsResponse> {
    try {
      const { idFamily, idHousehold } = req;
      const householdItems = await this.householdItemsRepository.find({
        where: { id_family: idFamily, id_household_item: In(idHousehold) },
        relations: ['room', 'category'],
      });
      const householdItemsResult: HouseholdResponse[] = householdItems.map(
        (householdItem) => {
          const room: Room = householdItem.room;
          const category: HouseholdItemCategories = householdItem.category;
          const householdResult: HouseholdItemRpc = {
            idHouseholdItem: householdItem.id_household_item,
            idGuideItem: householdItem.id_guide_item,
            idFamily: householdItem.id_family,
            itemName: householdItem.item_name,
            description: householdItem.description,
            itemImageurl: householdItem.item_imageurl,
            idCategory: householdItem.id_category,
            idRoom: householdItem.id_room,
            createdAt: householdItem.created_at.toISOString(),
            updatedAt: householdItem.updated_at.toISOString(),
          };
          const roomResult: RoomRpc = {
            idRoom: room.id_room,
            idFamily: room.id_family,
            roomName: room.room_name,
            roomImage: room.room_image,
            createdAt: room.created_at.toISOString(),
            updatedAt: room.updated_at.toISOString(),
          };
          const categoryResult: HouseholdItemCategoryRpc = {
            idHouseholdItemCategory: category.id_household_item_category,
            categoryName: category.category_name,
          };
          return {
            householdItem: householdResult,
            room: roomResult,
            category: categoryResult,
          };
        },
      );
      return { households: householdItemsResult };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
