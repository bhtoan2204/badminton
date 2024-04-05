import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { TimeoutError, lastValueFrom, timeout } from "rxjs";
import { EDUCATION_SERVICE } from "../utils";
import { ClientProxy } from "@nestjs/microservices";

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

  async getAllEducationProgress() {

  }

  async getDetailEducationProgress() {

  }

  async updateDetailEducationProgress() {

  }

  async deleteEducationProgress() {

  }

}