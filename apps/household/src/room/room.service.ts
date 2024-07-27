import { Room, UploadFileRequest } from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    private readonly storageService: StorageService,
  ) {}

  async getRooms(
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
      };
      if (dto.sortBy && dto.sortDirection) {
        option['order'] = {
          [dto.sortBy]: dto.sortDirection,
        };
      }
      const [data, total] = await this.roomRepository.findAndCount(option);
      return {
        data,
        total,
        message: 'Rooms retrieved successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createRoom(id_user: string, dto: any, file: any) {
    const { id_family, room_name } = dto;
    try {
      let fileUrl = null;
      if (file) {
        const fileName = 'room_' + id_user + '_' + Date.now();
        const params: UploadFileRequest = {
          fileName: fileName,
          file: new Uint8Array(file.buffer.data),
        };
        const uploadImageData =
          await this.storageService.uploadImageHousehold(params);
        fileUrl = uploadImageData.fileUrl;
      }
      const newRoom = await this.roomRepository.create({
        id_family,
        room_name,
        room_image: fileUrl,
      });

      return await this.roomRepository.save(newRoom);
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateRoom(id_user: string, dto: any, file: any) {
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
      let fileUrl = null;
      if (file) {
        const fileName = 'room_' + id_user + '_' + Date.now();
        const params: UploadFileRequest = {
          fileName: fileName,
          file: new Uint8Array(file.buffer.data),
        };
        const uploadImageData =
          await this.storageService.uploadImageHousehold(params);
        fileUrl = uploadImageData.fileUrl;
        room.room_image = fileUrl;
      }
      if (room_name) room.room_name = room_name;
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
