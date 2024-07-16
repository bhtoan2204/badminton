import { HttpException, Inject, Injectable } from '@nestjs/common';
import { FINANCE_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UtilitiesService {
  constructor(
    @Inject(FINANCE_SERVICE) private readonly financeClient: ClientProxy,
  ) {}

  async getUtilityTypes() {
    try {
      const response = this.financeClient
        .send('financeClient/getUtilityTypes', {})
        .pipe(timeout(15000));
      return await lastValueFrom(response);
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
      const response = this.financeClient
        .send('financeClient/getUtilities', {
          id_user,
          id_family,
          page,
          itemsPerPage,
        })
        .pipe(timeout(15000));

      return await lastValueFrom(response);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getUtility(id_user: string, id_family: number, id_utility: number) {
    try {
      console.log('id_user', id_user);
      console.log('id_family', id_family);
      console.log('id_utility', id_utility);
      const response = this.financeClient
        .send('financeClient/getUtility', {
          id_user,
          id_family,
          id_utility,
        })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async createUtility(id_user: string, dto: any, file) {
    try {
      const response = this.financeClient
        .send('financeClient/createUtility', { id_user, dto, file })
        .pipe(timeout(15000));
      return response;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async updateUtility(id_user: string, dto: any, file) {
    try {
      const response = this.financeClient
        .send('financeClient/updateUtility', { id_user, dto, file })
        .pipe(timeout(15000));
      return response;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async deleteUtility(id_user: string, id_family: number, id_utility: number) {
    try {
      const response = this.financeClient
        .send('financeClient/deleteUtility', {
          id_user,
          id_family,
          id_utility,
        })
        .pipe(timeout(15000));
      return response;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
