import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ELASTICSEARCH_SERVICE } from 'apps/gateway/src/utils';
import { lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class PackageExtraService {
  constructor(
    @Inject(ELASTICSEARCH_SERVICE)
    private readonly elasticsearchClient: ClientProxy,
  ) {}
  async getPackagesExtra(): Promise<any> {
    try {
      const response = this.elasticsearchClient
        .send('elasticsearchClient/getExtraPackage', {})
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async updatePackageExtra(dto: any): Promise<any> {
    try {
      const response = this.elasticsearchClient
        .send('elasticsearchClient/updateExtraPackage', dto)
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}
