import { Inject, Injectable } from "@nestjs/common";
import { EDUCATION_SERVICE } from "../../utils";
import { ClientProxy } from "@nestjs/microservices";
import { CreateSubjectDto } from "./dto/createSubject.dto";
import { lastValueFrom, timeout } from "rxjs";

@Injectable()
export class SubjectService {
  constructor(
    @Inject(EDUCATION_SERVICE) private educationClient: ClientProxy
  ) { }

  async createSubject(id_user: string, dto: CreateSubjectDto) {
    try {
      const response = this.educationClient.send('educationClient/createSubject', { id_user, dto })
        .pipe(
          timeout(5000),
        );
      return await lastValueFrom(response);
    } catch (error) {
      throw error;
    }
  }

  async getDetailSubject(id_user: string, id_family: number, id_education_progress: number, id_subject: number) {
    try {
      const response = this.educationClient.send('educationClient/getDetailSubject', { id_user, id_family, id_education_progress, id_subject })
        .pipe(
          timeout(5000),
        );
      return await lastValueFrom(response);
    } catch (error) {
      throw error;
    }

  }

  async updateDetailSubject() {

  }

  async deleteSubject() {

  }
}