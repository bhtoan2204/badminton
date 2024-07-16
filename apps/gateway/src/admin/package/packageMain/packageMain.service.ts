import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ELASTICSEARCH_SERVICE } from '../../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Injectable()
export class PackageMainService {
  constructor(
    @Inject(ELASTICSEARCH_SERVICE)
    private readonly elasticsearchClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {}

  async getAllPackage(
    page: number,
    itemsPerPage: number,
    search: string,
    sortBy: string,
    sortDesc: boolean,
  ) {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'elasticsearchClient/getAllPackageMain',
        { page, itemsPerPage, search, sortBy, sortDesc },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async createPackage(dto: any) {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'elasticsearchClient/createPackageMain',
        dto,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async updatePackage(dto: any) {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'elasticsearchClient/updatePackageMain',
        dto,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async deletePackage(id_main_package: number) {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'elasticsearchClient/deletePackageMain',
        { id_main_package },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
