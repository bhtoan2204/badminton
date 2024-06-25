import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ELASTICSEARCH_SERVICE, GUIDELINE_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { TimeoutError, lastValueFrom, timeout } from 'rxjs';
import { CreateGuidelineDto } from './dto/createGuideline.dto';
import { UpdateGuidelineDto } from './dto/updateGuideline.dto';
import { AddStepGuidelineDto } from './dto/addStep.dto';

@Injectable()
export class GuidelineService {
  constructor(
    @Inject(GUIDELINE_SERVICE) private guidelineClient: ClientProxy,
    @Inject(ELASTICSEARCH_SERVICE) private elasticsearchClient: ClientProxy,
  ) {}

  async getAllGuideline(
    id_user: string,
    id_family: number,
    page: number,
    itemsPerPage: number,
  ) {
    try {
      const response = this.guidelineClient
        .send('guidelineClient/get_all_guideline', {
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

  async getGuideline(id_user: string, id_family: number, id_guideline: number) {
    try {
      const response = this.guidelineClient
        .send('guidelineClient/get_guideline', {
          id_user,
          id_family,
          id_guideline,
        })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async createGuideline(id_user: string, dto: CreateGuidelineDto) {
    try {
      const response = this.guidelineClient
        .send('guidelineClient/create_guideline', { id_user, dto })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      console.log(error.statusCode, error.message);
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateGuideline(id_user: string, dto: UpdateGuidelineDto) {
    try {
      const response = this.guidelineClient
        .send('guidelineClient/update_guideline', { id_user, dto })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async deleteGuideline(
    id_user: string,
    id_family: number,
    id_guideline: number,
  ) {
    try {
      const response = this.guidelineClient
        .send('guidelineClient/delete_guideline', {
          id_user,
          id_family,
          id_guideline,
        })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getStep(id_user: string, id_family: number, id_guideline: number) {
    try {
      const response = this.guidelineClient
        .send('guidelineClient/get_step', { id_user, id_family, id_guideline })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async addStep(
    id_user: string,
    dto: AddStepGuidelineDto,
    file: Express.Multer.File,
  ) {
    try {
      const response = this.guidelineClient
        .send('guidelineClient/add_step', { id_user, dto, file })
        .pipe(timeout(10000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async insertStep(
    id_user: string,
    dto: AddStepGuidelineDto,
    file: Express.Multer.File,
  ) {
    try {
      const response = this.guidelineClient
        .send('guidelineClient/insert_step', { id_user, dto, file })
        .pipe(timeout(10000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateStep(
    id_user: string,
    dto: AddStepGuidelineDto,
    file: Express.Multer.File,
  ) {
    try {
      const response = this.guidelineClient
        .send('guidelineClient/update_step', { id_user, dto, file })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async deleteStep(
    id_user: string,
    id_family: number,
    id_guideline: number,
    index: number,
  ) {
    try {
      const response = this.guidelineClient
        .send('guidelineClient/delete_step', {
          id_user,
          id_family,
          id_guideline,
          index,
        })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async markShared(id_user: string, id_family: number, id_guideline: number) {
    try {
      const response = this.guidelineClient
        .send('guidelineClient/mark_shared', {
          id_user,
          id_family,
          id_guideline,
        })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getSharedGuideline(
    page: number,
    itemsPerPage: number,
    text: string,
    sort: string,
  ) {
    try {
      const response = this.elasticsearchClient
        .send('guidelineIndexer/searchGuideline', {
          page,
          itemsPerPage,
          text,
          sort,
        })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}
