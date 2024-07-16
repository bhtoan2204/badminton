import { RmqService } from '@app/common';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ELASTICSEARCH_SERVICE } from 'apps/gateway/src/utils';

@Injectable()
export class PackageComboService {
  constructor(
    @Inject(ELASTICSEARCH_SERVICE)
    private readonly elasticsearchClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {}

  async getPackagesCombo(
    page: number,
    itemsPerPage: number,
    search: string,
    sortBy: string,
    sortDesc: boolean,
  ): Promise<any> {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'elasticsearchClient/getPackagesCombo',
        { page, itemsPerPage, search, sortBy, sortDesc },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async createPackageCombo(dto: any): Promise<any> {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'elasticsearchClient/createPackageCombo',
        dto,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async updatePackageCombo(id_combo_package: number, dto: any): Promise<any> {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'elasticsearchClient/updatePackageCombo',
        { id_combo_package, dto },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async deletePackageCombo(id_combo_package: number): Promise<any> {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'elasticsearchClient/deletePackageCombo',
        { id_combo_package },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
