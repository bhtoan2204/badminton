import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { EntityManager } from 'typeorm';

@Injectable()
export class RoomService {
  constructor(private readonly entityManager: EntityManager) {}

  async getRooms(id_user: string, id_family: number) {
    try {
      const query = 'SELECT * FROM f_get_rooms($1, $2)';
      const params = [id_user, id_family];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
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
      const query = 'SELECT * FROM f_create_room($1, $2, $3)';
      const params = [id_user, id_family, room_name];
      const data = await this.entityManager.query(query, params);
      return {
        data: data[0],
        message: 'Room created successfully',
      };
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
      const query = 'SELECT * FROM f_update_room($1, $2, $3, $4)';
      const params = [id_user, id_family, id_room, room_name];
      const data = await this.entityManager.query(query, params);
      return data;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteRoom(id_user: string, id_family: number, id_room: number) {
    try {
      const query = 'SELECT * FROM f_delete_room($1, $2, $3)';
      const params = [id_user, id_family, id_room];
      const data = await this.entityManager.query(query, params);
      return {
        data: data[0].f_delete_room,
        message: 'Room deleted successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
