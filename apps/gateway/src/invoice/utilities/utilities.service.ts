import { HttpException, Inject, Injectable } from '@nestjs/common';
import { INVOICE_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class UtilitiesService {
  constructor(
    @Inject(INVOICE_SERVICE) private readonly utilitiesClient: ClientProxy,
  ) {}

  async getUtilityTypes() {
    try {
      const response = this.utilitiesClient
        .send('utilitiesClient/getUtilityTypes', {})
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getUtilities(
    id_user: string,
    id_family: number,
    page: number,
    itemsPerPage: number,
  ) {
    try {
      const response = this.utilitiesClient
        .send('utilitiesClient/getUtilities', {
          id_user,
          id_family,
          page,
          itemsPerPage,
        })
        .pipe(timeout(15000));

      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getUtility(id_user: string, id_family: number, id_utility: number) {
    try {
      console.log('id_user', id_user);
      console.log('id_family', id_family);
      console.log('id_utility', id_utility);
      const response = this.utilitiesClient
        .send('utilitiesClient/getUtility', {
          id_user,
          id_family,
          id_utility,
        })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async createUtility(id_user: string, dto: any, file) {
    try {
      const response = this.utilitiesClient
        .send('utilitiesClient/createUtility', { id_user, dto, file })
        .pipe(timeout(15000));
      return response;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateUtility(id_user: string, dto: any, file) {
    try {
      const response = this.utilitiesClient
        .send('utilitiesClient/updateUtility', { id_user, dto, file })
        .pipe(timeout(15000));
      return response;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async deleteUtility(id_user: string, id_family: number, id_utility: number) {
    try {
      const response = this.utilitiesClient
        .send('utilitiesClient/deleteUtility', {
          id_user,
          id_family,
          id_utility,
        })
        .pipe(timeout(15000));
      return response;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}
