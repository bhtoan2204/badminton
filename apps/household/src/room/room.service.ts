import { Room } from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
  ) {}

  async getRooms(
    id_user: string,
    id_family: number,
    page: number,
    itemsPerPages: number,
  ) {
    try {
      const [data, totalCount] = await this.roomRepository.findAndCount({
        where: { id_family },
        take: itemsPerPages,
        skip: (page - 1) * itemsPerPages,
      });
      return {
        data,
        totalCount,
        message: 'Rooms retrieved successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createRoom(id_user: string, dto: any) {
    const { id_family, room_name } = dto;
    try {
      const newRoom = await this.roomRepository.create({
        id_family,
        room_name,
      });

      return await this.roomRepository.save(newRoom);
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateRoom(id_user: string, dto: any) {
    const { id_family, id_room, room_name } = dto;
    try {
      const room = await this.roomRepository.findOne({
        where: { id_family, id_room },
      });
      if (!room) {
        throw new RpcException({
          message: 'Room not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      room.room_name = room_name;
      return await this.roomRepository.save(room);
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteRoom(id_user: string, id_family: number, id_room: number) {
    try {
      const room = await this.roomRepository.findOne({
        where: { id_family, id_room },
      });
      if (!room) {
        throw new RpcException({
          message: 'Room not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return await this.roomRepository.remove(room);
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
