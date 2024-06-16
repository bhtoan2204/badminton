import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ELASTICSEARCH_SERVICE } from 'apps/gateway/src/utils';
import { lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class PackageComboService {
  constructor(
    @Inject(ELASTICSEARCH_SERVICE)
    private readonly elasticsearchClient: ClientProxy,
  ) {}

  async getPackagesCombo(page: number, itemsPerPage: number): Promise<any> {
    try {
      const response = this.elasticsearchClient
        .send('elasticsearchClient/getPackagesCombo', { page, itemsPerPage })
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

  async createPackageCombo(dto: any): Promise<any> {
    try {
      const response = this.elasticsearchClient
        .send('elasticsearchClient/createPackageCombo', dto)
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

  async updatePackageCombo(id_combo_package: number, dto: any): Promise<any> {
    try {
      const response = this.elasticsearchClient
        .send('elasticsearchClient/updatePackageCombo', {
          id_combo_package,
          dto,
        })
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

  async deletePackageCombo(id_combo_package: number): Promise<any> {
    try {
      const response = this.elasticsearchClient
        .send('elasticsearchClient/deletePackageCombo', { id_combo_package })
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
