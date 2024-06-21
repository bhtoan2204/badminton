import { PackageMain } from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

@Injectable()
export class PackageMainService {
  constructor(
    @InjectRepository(PackageMain)
    private packageMainRepository: Repository<PackageMain>,
  ) {}

  async getAllPackageMain(
    page: number,
    itemsPerPage: number,
    search: string,
    sortBy: string,
    sortDesc: boolean,
  ) {
    try {
      const [data, total] = await this.packageMainRepository.findAndCount({
        where: search ? { name: Like(`%${search}%`) } : {},
        take: itemsPerPage,
        skip: (page - 1) * itemsPerPage,
        order: { [sortBy]: sortDesc ? 'DESC' : 'ASC' },
      });
      return {
        data: data,
        total: total,
        message: 'Package fetched successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createPackageMain(dto: any) {
    const { name, description, price, duration_months } = dto;
    try {
      const packageMain = new PackageMain();
      packageMain.name = name;
      packageMain.description = description;
      packageMain.price = price;
      packageMain.duration_months = duration_months;

      const savedPackageMain =
        await this.packageMainRepository.save(packageMain);
      return {
        data: savedPackageMain,
        message: 'Package created successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updatePackageMain(dto: any) {
    const {
      id_main_package,
      name,
      description,
      price,
      duration_months,
      is_active,
    } = dto;
    try {
      const packageMain = await this.packageMainRepository.findOne({
        where: {
          id_main_package: id_main_package,
        },
      });

      if (!packageMain) {
        throw new RpcException({
          message: 'Package not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      if (name !== null && name !== undefined) {
        packageMain.name = name;
      }
      if (description !== null && description !== undefined) {
        packageMain.description = description;
      }
      if (price !== null && price !== undefined) {
        packageMain.price = price;
      }
      if (duration_months !== null && duration_months !== undefined) {
        packageMain.duration_months = duration_months;
      }
      if (is_active !== null && is_active !== undefined) {
        packageMain.is_active = is_active;
      }

      const savedPackageMain =
        await this.packageMainRepository.save(packageMain);
      return {
        data: savedPackageMain,
        message: 'Package updated successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deletePackageMain(id_main_package: number) {
    try {
      const packageMain = await this.packageMainRepository.findOne({
        where: {
          id_main_package: id_main_package,
        },
      });

      if (!packageMain) {
        throw new RpcException({
          message: 'Package not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      await this.packageMainRepository.delete({
        id_main_package: id_main_package,
      });
      return {
        message: 'Package deleted successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
