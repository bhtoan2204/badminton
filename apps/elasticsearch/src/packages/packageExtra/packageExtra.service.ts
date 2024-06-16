import { PackageExtra } from '@app/common';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PackageExtraService {
  constructor(
    @InjectRepository(PackageExtra)
    private packageMainRepository: Repository<PackageExtra>,
  ) {}

  async getPackagesExtra(): Promise<PackageExtra[]> {
    try {
      return this.packageMainRepository.find();
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async updatePackageExtra(data: any): Promise<PackageExtra> {
    try {
      const { id_extra_package, price, description, is_active } = data;
      const packageExtra = await this.packageMainRepository.findOne({
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
      return await this.packageMainRepository.save(packageExtra);
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
