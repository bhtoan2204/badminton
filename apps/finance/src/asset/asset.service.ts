import { FinanceAssets, UploadFileRequest } from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(FinanceAssets)
    private assetRepository: Repository<FinanceAssets>,
    private readonly storageService: StorageService,
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
        order: { created_at: 'DESC' },
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

  async createAsset(id_user: string, dto: any, file: any) {
    const { id_family, name, description, value, purchase_date } = dto;
    try {
      let fileUrl = null;
      if (file) {
        const filename =
          'asset_' + id_user + '_' + Date.now() + '_' + file.originalname;
        const params: UploadFileRequest = {
          file: new Uint8Array(file.buffer.data),
          fileName: filename,
        };
        const uploadImageData =
          await this.storageService.uploadImageExpense(params);
        fileUrl = uploadImageData.fileUrl;
      }
      const newAssets = await this.assetRepository.create({
        id_family,
        name,
        description,
        value,
        purchase_date,
        image_url: fileUrl,
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

  async updateAsset(id_user: string, dto: any, file: any) {
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
      if (file) {
        const filename =
          'asset_' + id_user + '_' + Date.now() + '_' + file.originalname;
        const params: UploadFileRequest = {
          file: new Uint8Array(file.buffer.data),
          fileName: filename,
        };
        const uploadImageData =
          await this.storageService.uploadImageExpense(params);
        updateAsset.image_url = uploadImageData.fileUrl;
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
      await this.assetRepository.remove(asset);
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
