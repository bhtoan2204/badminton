import { ChecklistType } from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ChecklistTypeService {
  constructor(
    @InjectRepository(ChecklistType)
    private checklistTypeRepository: Repository<ChecklistType>,
  ) {}

  async getChecklistTypes(id_family: number) {
    try {
      const [data, total] = await this.checklistTypeRepository.findAndCount({
        where: { id_family },
      });
      return {
        data: data,
        total: total,
        message: 'Get checklist types successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createChecklistType(dto: {
    name: string;
    id_family: number;
    icon_url: string;
  }) {
    try {
      const checklistType = await this.checklistTypeRepository.save({
        name_en: dto.name,
        name_vn: dto.name,
        id_family: dto.id_family,
        icon_url: dto.icon_url,
      });
      return {
        data: checklistType,
        message: 'Create checklist type successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateChecklistType(dto: {
    id_checklist_type: number;
    id_family: number;
    name_vn: string;
    name_en: string;
  }) {
    try {
      const checklistType = await this.checklistTypeRepository.findOne({
        where: {
          id_checklist_type: dto.id_checklist_type,
          id_family: dto.id_family,
        },
      });
      if (!checklistType) {
        throw new Error('Checklist type not found');
      }
      if (dto.name_en) {
        checklistType.name_en = dto.name_en;
      }
      if (dto.name_vn) {
        checklistType.name_vn = dto.name_vn;
      }
      await this.checklistTypeRepository.save(checklistType);
      return {
        data: checklistType,
        message: 'Update checklist type successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
