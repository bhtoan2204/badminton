import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { HOUSEHOLD_SERVICE } from "../../utils";
import { ClientProxy } from "@nestjs/microservices";
import { TimeoutError, lastValueFrom, timeout } from "rxjs";

@Injectable()
export class RoomService {
  constructor(
    @Inject(HOUSEHOLD_SERVICE) private householdClient: ClientProxy
  ) { }

  async getRooms(id_user: string, id_family: number) {
    try {
      const response = this.householdClient.send('householdClient/getRooms', { id_user, id_family })
        .pipe(
          timeout(15000),
        );
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async createRoom(id_user: string, dto: any) {
    try {
      const response = this.householdClient.send('householdClient/createRoom', { id_user, dto })
        .pipe(
          timeout(15000),
        );
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateRoom(id_user: string, dto: any) {
    try {
      const response = this.householdClient.send('householdClient/updateRoom', { id_user, dto })
        .pipe(
          timeout(15000),
        );
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async deleteRoom(id_user: string, id_family: number, id_room: number) {
    try {
      const response = this.householdClient.send('householdClient/deleteRoom', { id_user, id_family, id_room })
        .pipe(
          timeout(15000),
        );
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}