import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { TimeoutError, lastValueFrom, timeout } from "rxjs";
import { EDUCATION_SERVICE } from "../utils";
import { ClientProxy } from "@nestjs/microservices";
import { UpdateEducationDto } from "./dto/updateEducation.dto";

@Injectable()
export class EducationService {
  constructor(
    @Inject(EDUCATION_SERVICE) private educationClient: ClientProxy
  ) { }

  async createEducationProgress(id_user: string, dto: any) {
    try {
      const response = this.educationClient.send('educationClient/createEducationProgress', { id_user, dto })
        .pipe(
          timeout(5000),
        );
      return await lastValueFrom(response);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getAllEducationProgress(id_user: string, pageNumber, itemsPerPage, id_family) {
    try {
      const response = this.educationClient.send('educationClient/getAllEducationProgress', { id_user, pageNumber, itemsPerPage, id_family })
        .pipe(
          timeout(5000),
        );
      return await lastValueFrom(response);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }

  }

  async getDetailEducationProgress(id_user: string, id_family: number, id_education_progress: number) {
    try {
      const response = this.educationClient.send('educationClient/getDetailEducationProgress', { id_user, id_family, id_education_progress })
        .pipe(
          timeout(5000),
        );
      return await lastValueFrom(response);
    }
    catch (error) {
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateDetailEducationProgress(id_user: string, dto: UpdateEducationDto) {
    try {
      const response = this.educationClient.send('educationClient/updateDetailEducationProgress', { id_user, dto })
        .pipe(
          timeout(5000),
        );
      return await lastValueFrom(response);
    }
    catch (error) {
      throw new HttpException(error, error.statusCode);
    }

  }

  async deleteEducationProgress(id_user: string, id_family: number, id_education_progress: number) {
    try {
      const response = this.educationClient.send('educationClient/deleteEducationProgress', { id_user, id_family, id_education_progress })
        .pipe(
          timeout(5000),
        );
      return await lastValueFrom(response);
    }
    catch (error) {
      throw new HttpException(error, error.statusCode);
    }
  }
}