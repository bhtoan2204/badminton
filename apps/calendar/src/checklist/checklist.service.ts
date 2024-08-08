import { Checklist, ChecklistType } from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ChecklistService {
  constructor(
    @InjectRepository(Checklist)
    private checklistRepository: Repository<Checklist>,
    @InjectRepository(ChecklistType)
    private checklistTypeRepository: Repository<ChecklistType>,
  ) {}

  async getChecklists(
    id_user: string,
    dto: {
      id_family: number;
      id_checklist_type: number;
      page: number;
      itemsPerPage: number;
      sortBy: string;
      sortDirection: 'ASC' | 'DESC';
    },
  ) {
    try {
      const option = {
        where: { id_family: dto.id_family },
        skip: (dto.page - 1) * dto.itemsPerPage,
        take: dto.itemsPerPage,
        relations: ['checklistType'],
        order: {
          [dto.sortBy]: dto.sortDirection,
        },
      };
      if (dto.id_checklist_type) {
        option.where['id_checklist_type'] = dto.id_checklist_type;
      }
      const [data, total] = await this.checklistRepository.findAndCount(option);

      return {
        data: data,
        total: total,
        message: 'Get checklist successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createChecklist(id_user: string, dto: any) {
    try {
      const { id_family, id_checklist_type, task_name, description, due_date } =
        dto;
      const checklistType = await this.checklistTypeRepository.findOne({
        where: { id_checklist_type, id_family },
      });

      if (!checklistType) {
        throw new RpcException({
          message: 'Checklist type not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      const checklist = await this.checklistRepository.save({
        id_family,
        id_checklist_type,
        task_name,
        description,
        due_date,
      });

      return {
        data: checklist,
        message: 'Checklist created successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateChecklist(id_user: string, dto: any) {
    const {
      id_checklist,
      id_checklist_type,
      id_family,
      task_name,
      description,
      due_date,
      is_completed,
    } = dto;
    try {
      const checklist = await this.checklistRepository.findOne({
        where: { id_checklist, id_family },
      });
      if (!checklist) {
        throw new RpcException({
          message: 'Checklist not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      if (id_checklist_type !== undefined) {
        const checklistType = await this.checklistTypeRepository.findOne({
          where: { id_checklist_type },
        });
        if (!checklistType) {
          throw new RpcException({
            message: 'Checklist type not found',
            statusCode: HttpStatus.NOT_FOUND,
          });
        }
        checklist.id_checklist_type = id_checklist_type;
      }
      if (task_name !== undefined) {
        checklist.task_name = task_name;
      }
      if (description !== undefined) {
        checklist.description = description;
      }
      if (due_date !== undefined) {
        checklist.due_date = due_date;
      }
      if (is_completed !== undefined) {
        checklist.is_completed = is_completed;
      }

      const updatedChecklist = await this.checklistRepository.save(checklist);
      return {
        data: updatedChecklist,
        message: 'Checklist updated successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteChecklist(
    id_user: string,
    id_family: number,
    id_checklist: number,
  ) {
    try {
      const checklist = await this.checklistRepository.findOne({
        where: { id_checklist, id_family },
      });
      if (!checklist) {
        throw new RpcException({
          message: 'Checklist not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      await this.checklistRepository.remove(checklist);
      return {
        message: 'Checklist deleted successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
