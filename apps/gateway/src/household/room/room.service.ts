import { HttpException, Inject, Injectable } from '@nestjs/common';
import { HOUSEHOLD_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { GetRoomDto } from './dto/getRoom.dto';

@Injectable()
export class RoomService {
  constructor(
    @Inject(HOUSEHOLD_SERVICE) private householdClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {}

  async getRooms(id_user: string, dto: GetRoomDto) {
    try {
      return await this.rmqService.send(
        this.householdClient,
        'householdClient/getRooms',
        { id_user, dto },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async createRoom(id_user: string, dto: any, file: any) {
    try {
      return await this.rmqService.send(
        this.householdClient,
        'householdClient/createRoom',
        { id_user, dto, file },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async updateRoom(id_user: string, dto: any, file: any) {
    try {
      return await this.rmqService.send(
        this.householdClient,
        'householdClient/updateRoom',
        { id_user, dto, file },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async deleteRoom(id_user: string, id_family: number, id_room: number) {
    try {
      return await this.rmqService.send(
        this.householdClient,
        'householdClient/deleteRoom',
        { id_user, id_family, id_room },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
