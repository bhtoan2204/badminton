import { FamilyExtraPackages, PackageExtra } from '@app/common';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

@Injectable()
export class PackageExtraService {
  constructor(
    @InjectRepository(PackageExtra)
    private packageExtraRepository: Repository<PackageExtra>,
    @InjectRepository(FamilyExtraPackages)
    private familyExtraRepository: Repository<FamilyExtraPackages>,
  ) {}

  async getPackagesExtra(
    search: string,
    sortBy: string,
    sortDesc: boolean,
  ): Promise<PackageExtra[]> {
    try {
      return this.packageExtraRepository.find({
        where: search ? { description: Like(`%${search}%`) } : {},
        order: { [sortBy]: sortDesc ? 'DESC' : 'ASC' },
      });
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async updatePackageExtra(data: any): Promise<PackageExtra> {
    try {
      const { id_extra_package, price, description, is_active } = data;
      const packageExtra = await this.packageExtraRepository.findOne({
        where: { id_extra_package },
      });
      if (!packageExtra) {
        throw new RpcException('PackageExtra not found');
      }
      if (price) {
        packageExtra.price = price;
      }
      if (description) {
        packageExtra.description = description;
      }
      if (is_active !== null && is_active !== undefined) {
        packageExtra.is_active = is_active;
      }
      return await this.packageExtraRepository.save(packageExtra);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async getPackageExtraStatistics(): Promise<any> {
    try {
      const extraPackageCount = await this.packageExtraRepository
        .createQueryBuilder('packageExtra')
        .leftJoinAndSelect(
          'packageExtra.familyExtraPackages',
          'familyExtraPackages',
        )
        .select('packageExtra.name', 'name')
        .addSelect(
          'COUNT(familyExtraPackages.id_family_extra_package)',
          'count',
        )
        .groupBy('packageExtra.id_extra_package')
        .addGroupBy('packageExtra.name')
        .getRawMany();

      return extraPackageCount.map((item) => ({
        name: item.name,
        count: parseInt(item.count, 10),
      }));
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
