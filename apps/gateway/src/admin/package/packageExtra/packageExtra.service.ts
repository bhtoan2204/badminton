import { RmqService } from '@app/common';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ELASTICSEARCH_SERVICE } from 'apps/gateway/src/utils';

@Injectable()
export class PackageExtraService {
  constructor(
    @Inject(ELASTICSEARCH_SERVICE)
    private readonly elasticsearchClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {}
  async getPackagesExtra(
    search: string,
    sortBy: string,
    sortDesc: boolean,
  ): Promise<any> {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'elasticsearchClient/getExtraPackage',
        { search, sortBy, sortDesc },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async updatePackageExtra(dto: any): Promise<any> {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'elasticsearchClient/updateExtraPackage',
        dto,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
