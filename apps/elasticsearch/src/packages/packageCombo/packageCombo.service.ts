import { PackageCombo, PackageExtra } from '@app/common';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';

@Injectable()
export class PackageComboService {
  constructor(
    @InjectRepository(PackageCombo)
    private packageComboRepository: Repository<PackageCombo>,
    @InjectRepository(PackageExtra)
    private packageExtraRepository: Repository<PackageExtra>,
  ) {}

  async getPackagesCombo(
    page: number,
    itemsPerPage: number,
    search: string,
    sortBy: string,
    sortDesc: boolean,
  ): Promise<any> {
    try {
      const [data, total] = await this.packageComboRepository.findAndCount({
        where: search ? { name: Like(`%${search}%`) } : {},
        take: itemsPerPage,
        skip: (page - 1) * itemsPerPage,
        relations: ['id_package_extra'],
        order: { [sortBy]: sortDesc ? 'DESC' : 'ASC' },
      });
      return {
        data: data,
        total: total,
        message: 'Combo package fetched successfully',
      };
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async createPackageCombo(dto: any): Promise<any> {
    try {
      const { name, description, price, id_package_extra } = dto;

      const packageExtras = await this.packageExtraRepository.find({
        where: { id_extra_package: In(id_package_extra) },
      });

      if (packageExtras.length !== id_package_extra.length) {
        throw new RpcException('Some PackageExtra IDs are invalid');
      }

      const packageCombo = new PackageCombo();
      packageCombo.name = name;
      packageCombo.description = description;
      packageCombo.price = price;
      packageCombo.id_package_extra = packageExtras;

      const savedPackageCombo =
        await this.packageComboRepository.save(packageCombo);
      return {
        data: savedPackageCombo,
        message: 'Combo package created successfully',
      };
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async updatePackageCombo(id_combo_package: number, dto: any): Promise<any> {
    try {
      const packageCombo = await this.packageComboRepository.findOne({
        where: { id_combo_package },
      });

      if (!packageCombo) {
        throw new RpcException('PackageCombo not found');
      }

      const { name, description, price, id_package_extra, is_active } = dto;

      if (name !== undefined) {
        packageCombo.name = name;
      }
      if (description !== undefined) {
        packageCombo.description = description;
      }
      if (price !== undefined) {
        packageCombo.price = price;
      }
      if (id_package_extra !== undefined) {
        const packageExtras = await this.packageExtraRepository.find({
          where: { id_extra_package: In(id_package_extra) },
        });

        if (packageExtras.length !== id_package_extra.length) {
          throw new RpcException('Some PackageExtra IDs are invalid');
        }

        packageCombo.id_package_extra = packageExtras;
      }
      if (is_active !== undefined) {
        packageCombo.is_active = is_active;
      }

      const updatedPackageCombo =
        await this.packageComboRepository.save(packageCombo);
      return {
        data: updatedPackageCombo,
        message: 'Combo package updated successfully',
      };
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
