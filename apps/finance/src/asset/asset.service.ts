import { FinanceAssets } from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(FinanceAssets)
    private assetRepository: Repository<FinanceAssets>,
  ) {}

  async getAsset(
    id_user: string,
    id_family: number,
    page: number,
    itemsPerPage: number,
  ) {
    try {
      const [data, total] = await this.assetRepository.findAndCount({
        where: { id_family: id_family },
        skip: (page - 1) * itemsPerPage,
        take: itemsPerPage,
        relations: ['family'],
      });
      return {
        data: data,
        total: total,
        message: 'Get asset successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createAsset(id_user: string, dto: any) {
    const { id_family, name, description, value, purchase_date } = dto;
    try {
      const newAssets = await this.assetRepository.create({
        id_family,
        name,
        description,
        value,
        purchase_date,
      });
      await this.assetRepository.save(newAssets);
      return {
        data: newAssets,
        message: 'Asset created',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateAsset(id_user: string, dto: any) {
    const { id_asset, id_family, name, description, value, purchase_date } =
      dto;
    try {
      const updateAsset = await this.assetRepository.findOne({
        where: {
          id_asset: id_asset,
          id_family: id_family,
        },
      });
      if (!updateAsset) {
        throw new RpcException({
          message: 'Asset not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      if (name !== undefined) updateAsset.name = name;
      if (description !== undefined) updateAsset.description = description;
      if (value !== undefined) updateAsset.value = value;
      if (purchase_date !== undefined)
        updateAsset.purchase_date = purchase_date;
      await this.assetRepository.save(updateAsset);
      return {
        data: updateAsset,
        message: 'Asset updated',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteAsset(id_user: string, id_family, id_asset: number) {
    try {
      const asset = await this.assetRepository.findOne({
        where: {
          id_asset: id_asset,
          id_family: id_family,
        },
      });
      if (!asset) {
        throw new RpcException({
          message: 'Asset not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      await this.assetRepository.delete(asset);
      return {
        message: 'Asset deleted',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
