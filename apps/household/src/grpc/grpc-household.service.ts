import {
  FindOneHouseholdByIdRequest,
  HouseholdItemCategories,
  HouseholdItemCategoryRpc,
  HouseholdItemRpc,
  HouseholdItems,
  HouseholdResponse,
  Room,
  RoomRpc,
} from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
}
