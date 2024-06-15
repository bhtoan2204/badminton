import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ELASTICSEARCH_SERVICE } from '../../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class PackageMainService {
  constructor(
    @Inject(ELASTICSEARCH_SERVICE)
    private readonly elasticsearchClient: ClientProxy,
  ) {}

  async getAllPackage(page: number, itemsPerPage: number) {
    try {
      const response = this.elasticsearchClient
        .send('elasticsearchClient/getAllPackageMain', {
          page,
          itemsPerPage,
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

  async createPackage(dto: any) {
    try {
      const response = this.elasticsearchClient
        .send('elasticsearchClient/createPackageMain', dto)
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

  async updatePackage(dto: any) {
    try {
      const response = this.elasticsearchClient
        .send('elasticsearchClient/updatePackageMain', dto)
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

  async deletePackage(id_main_package: number) {
    try {
      const response = this.elasticsearchClient
        .send('elasticsearchClient/deletePackageMain', { id_main_package })
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
