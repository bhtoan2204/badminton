import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FINANCE_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { CreateAssetDto } from './dto/createAsset.dto';
import { TimeoutError, lastValueFrom, timeout } from 'rxjs';
import { UpdateAssetDto } from './dto/updateAsset.dto';

@Injectable()
export class AssetService {
  constructor(@Inject(FINANCE_SERVICE) private financeClient: ClientProxy) {}

  async getAsset(
    id_user: string,
    id_family: number,
    page: number,
    itemsPerPage: number,
  ) {
    try {
      const response = this.financeClient
        .send('financeClient/getAsset', {
          id_user,
          id_family,
          page,
          itemsPerPage,
        })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async createAsset(id_user: string, dto: CreateAssetDto) {
    try {
      const response = this.financeClient
        .send('financeClient/createAsset', { id_user, dto })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateAsset(id_user: string, dto: UpdateAssetDto) {
    try {
      const response = this.financeClient
        .send('financeClient/updateAsset', { id_user, dto })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async deleteAsset(id_user: string, id_family, id_asset: number) {
    try {
      const response = this.financeClient
        .send('financeClient/deleteAsset', { id_user, id_family, id_asset })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}
