import { HttpException, Inject, Injectable } from "@nestjs/common";
import { EDUCATION_SERVICE } from "../../utils";
import { ClientProxy } from "@nestjs/microservices";
import { CreateSubjectDto } from "./dto/createSubject.dto";
import { lastValueFrom, timeout } from "rxjs";
import { UpdateSubjectDto } from "./dto/updateSubject.dto";
import { AddComponentScoreDto } from "./dto/addComponentScore.dto";
import { UpdateComponentScoreDto } from "./dto/updateComponentScore.dto";
import { DeleteComponentScoreDto } from "./dto/deleteComponentScore.dto";
import { ModifyScoreDto } from "./dto/modifyScore.dto";

@Injectable()
export class SubjectService {
  constructor(
    @Inject(EDUCATION_SERVICE) private educationClient: ClientProxy
  ) { }

  async createSubject(id_user: string, dto: CreateSubjectDto) {
    try {
      const response = this.educationClient.send('educationClient/createSubject', { id_user, dto })
        .pipe(
          timeout(15000),
        );
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getDetailSubject(id_user: string, id_family: number, id_education_progress: number, id_subject: number) {
    try {
      const response = this.educationClient.send('educationClient/getDetailSubject', { id_user, id_family, id_education_progress, id_subject })
        .pipe(
          timeout(15000),
        );
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }

  }

  async updateDetailSubject(id_user: string, dto: UpdateSubjectDto) {
    try {
      const response = this.educationClient.send('educationClient/updateDetailSubject', { id_user, dto })
        .pipe(
          timeout(15000),
        );
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async deleteSubject(id_user: string, id_family: number, id_education_progress: number, id_subject: number) {
    try {
      const response = this.educationClient.send('educationClient/deleteSubject', { id_user, id_family, id_education_progress, id_subject })
        .pipe(
          timeout(15000),
        );
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async addComponentScore(id_user: string, dto: AddComponentScoreDto) {
    try {
      const response = this.educationClient.send('educationClient/addComponentScore', { id_user, dto })
        .pipe(
          timeout(15000),
        );
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async insertComponentScore(id_user: string, dto: any) {
    try {
      const response = this.educationClient.send('educationClient/insertComponentScore', { id_user, dto })
        .pipe(
          timeout(15000),
        );
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateComponentScore(id_user: string, dto: UpdateComponentScoreDto) {
    try {
      const response = this.educationClient.send('educationClient/updateComponentScore', { id_user, dto })
        .pipe(
          timeout(15000),
        );
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async deleteComponentScore(id_user: string, dto: DeleteComponentScoreDto) {
    try {
      const response = this.educationClient.send('educationClient/deleteComponentScore', { id_user, dto })
        .pipe(
          timeout(15000),
        );
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async modifyScore(id_user: string, dto: ModifyScoreDto) {
    try {
      const response = this.educationClient.send('educationClient/modifyScore', { id_user, dto })
        .pipe(
          timeout(15000),
        );
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async removeScore(id_user: string, dto: any) {
    try {
      const response = this.educationClient.send('educationClient/removeScore', { id_user, dto })
        .pipe(
          timeout(15000),
        );
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async changeStatus(id_user: string, dto: any) {
    try {
      const response = this.educationClient.send('educationClient/changeStatus', { id_user, dto })
        .pipe(
          timeout(15000),
        );
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}