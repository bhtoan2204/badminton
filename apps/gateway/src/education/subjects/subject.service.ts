import { HttpException, Inject, Injectable } from '@nestjs/common';
import { EDUCATION_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { CreateSubjectDto } from './dto/createSubject.dto';
import { UpdateSubjectDto } from './dto/updateSubject.dto';
import { AddComponentScoreDto } from './dto/addComponentScore.dto';
import { UpdateComponentScoreDto } from './dto/updateComponentScore.dto';
import { DeleteComponentScoreDto } from './dto/deleteComponentScore.dto';
import { ModifyScoreDto } from './dto/modifyScore.dto';
import { RmqService } from '@app/common';

@Injectable()
export class SubjectService {
  constructor(
    @Inject(EDUCATION_SERVICE) private educationClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {}

  async createSubject(id_user: string, dto: CreateSubjectDto) {
    try {
      return await this.rmqService.send(
        this.educationClient,
        'educationClient/createSubject',
        { id_user, dto },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getDetailSubject(
    id_user: string,
    id_family: number,
    id_education_progress: number,
    id_subject: number,
  ) {
    try {
      return await this.rmqService.send(
        this.educationClient,
        'educationClient/getDetailSubject',
        {
          id_user,
          id_family,
          id_education_progress,
          id_subject,
        },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async updateDetailSubject(id_user: string, dto: UpdateSubjectDto) {
    try {
      return await this.rmqService.send(
        this.educationClient,
        'educationClient/updateDetailSubject',
        { id_user, dto },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async deleteSubject(
    id_user: string,
    id_family: number,
    id_education_progress: number,
    id_subject: number,
  ) {
    try {
      return await this.rmqService.send(
        this.educationClient,
        'educationClient/deleteSubject',
        {
          id_user,
          id_family,
          id_education_progress,
          id_subject,
        },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async addComponentScore(id_user: string, dto: AddComponentScoreDto) {
    try {
      return await this.rmqService.send(
        this.educationClient,
        'educationClient/addComponentScore',
        { id_user, dto },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async insertComponentScore(id_user: string, dto: any) {
    try {
      return await this.rmqService.send(
        this.educationClient,
        'educationClient/insertComponentScore',
        { id_user, dto },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async updateComponentScore(id_user: string, dto: UpdateComponentScoreDto) {
    try {
      return await this.rmqService.send(
        this.educationClient,
        'educationClient/updateComponentScore',
        { id_user, dto },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async deleteComponentScore(id_user: string, dto: DeleteComponentScoreDto) {
    try {
      return await this.rmqService.send(
        this.educationClient,
        'educationClient/deleteComponentScore',
        { id_user, dto },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async modifyScore(id_user: string, dto: ModifyScoreDto) {
    try {
      return await this.rmqService.send(
        this.educationClient,
        'educationClient/modifyScore',
        { id_user, dto },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async removeScore(id_user: string, dto: any) {
    try {
      return await this.rmqService.send(
        this.educationClient,
        'educationClient/removeScore',
        { id_user, dto },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async changeStatus(id_user: string, dto: any) {
    try {
      return await this.rmqService.send(
        this.educationClient,
        'educationClient/changeStatus',
        { id_user, dto },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
