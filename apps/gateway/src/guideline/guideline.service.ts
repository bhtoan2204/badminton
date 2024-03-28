import { HttpException, Inject, Injectable } from "@nestjs/common";
import { GUIDELINE_SERVICE } from "../utils";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";
import { CreateGuidelineDto } from "./dto/createGuideline.dto";
import { UpdateGuidelineDto } from "./dto/updateGuideline.dto";

@Injectable()
export class GuidelineService {
  constructor(
    @Inject(GUIDELINE_SERVICE) private guidelineClient: ClientProxy
  ) { }

  async getAllGuideline(id_user: string, id_family: any, page, itemsPerPage) {
    try {
      const response = this.guidelineClient.send('guidelineClient/get_all_guideline', { id_user, id_family, page, itemsPerPage})
        .pipe(
          timeout(5000),
        );
        return await lastValueFrom(response);
    } catch (error) {
      throw new HttpException(error, error.statusCode);
    }
  }

  async getGuideline(id_user: string, id_family: number, id_guideline: number) {
    try {
      const response = this.guidelineClient.send('guidelineClient/get_guideline', { id_user, id_family, id_guideline })
        .pipe(
          timeout(5000),
        );
      return await lastValueFrom(response);
    } catch (error) {
      throw new HttpException(error, error.statusCode);
    }
  }

  async createGuideline(id_user: string, dto: CreateGuidelineDto) {
    try {
      const response = this.guidelineClient.send('guidelineClient/create_guideline', { id_user, dto })
        .pipe(
          timeout(5000),
        );
      return await lastValueFrom(response);
    } catch (error) {
      console.log(error.statusCode, error.message)
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateGuideline(id_user: string, dto: UpdateGuidelineDto) {
    try {
      const response = this.guidelineClient.send('guidelineClient/update_guideline', { id_user, dto })
        .pipe(
          timeout(5000),
        );
      return await lastValueFrom(response);
    } catch (error) {
      throw new HttpException(error, error.statusCode);
    }
  }

  async deleteGuideline(id_user: string, id_family: number, id_guideline: number) {
    try {
      const response = this.guidelineClient.send('guidelineClient/delete_guideline', { id_user, id_family, id_guideline })
        .pipe(
          timeout(5000),
        );
      return await lastValueFrom(response);
    } catch (error) {
      throw new HttpException(error, error.statusCode);
    }
  }
}