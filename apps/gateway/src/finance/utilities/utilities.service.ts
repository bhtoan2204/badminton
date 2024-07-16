import { HttpException, Inject, Injectable } from '@nestjs/common';
import { FINANCE_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Injectable()
export class UtilitiesService {
  constructor(
    @Inject(FINANCE_SERVICE) private readonly financeClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {}

  async getUtilityTypes() {
    try {
      return await this.rmqService.send(
        this.financeClient,
        'financeClient/getUtilityTypes',
        {},
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getUtilities(
    id_user: string,
    id_family: number,
    page: number,
    itemsPerPage: number,
  ) {
    try {
      return await this.rmqService.send(
        this.financeClient,
        'financeClient/getUtilities',
        { id_user, id_family, page, itemsPerPage },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getUtility(id_user: string, id_family: number, id_utility: number) {
    try {
      return await this.rmqService.send(
        this.financeClient,
        'financeClient/getUtility',
        { id_user, id_family, id_utility },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async createUtility(id_user: string, dto: any, file) {
    try {
      return await this.rmqService.send(
        this.financeClient,
        'financeClient/createUtility',
        { id_user, dto, file },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async updateUtility(id_user: string, dto: any, file) {
    try {
      return await this.rmqService.send(
        this.financeClient,
        'financeClient/updateUtility',
        { id_user, dto, file },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async deleteUtility(id_user: string, id_family: number, id_utility: number) {
    try {
      return await this.rmqService.send(
        this.financeClient,
        'financeClient/deleteUtility',
        { id_user, id_family, id_utility },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
