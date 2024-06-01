import { HttpException, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { FAMILY_SERVICE } from "../utils";
import { lastValueFrom, timeout } from "rxjs";
import { CreateFamilyDto } from "./dto/createFamily.dto";
import { MemberFamilyDto } from "./dto/memberFamily.dto";
import { DeleteMemberDTO } from "./dto/deleteFamily.dto";
import { UpdateFamilyDTO } from "./dto/updateFamily.dto";

@Injectable()
export class FamilyService {
  constructor(
    @Inject(FAMILY_SERVICE) private familyClient: ClientProxy
  ) { }

  async getFamily(id_user, id_family) {
    try {
      const response = this.familyClient.send('family/get_Family', { id_user, id_family })
        .pipe(
          timeout(15000),
        );
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getMember(id_user) {
    try {
      const response = this.familyClient.send('family/get_Member', { id_user })
        .pipe(
          timeout(15000),
        );
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getAllMember(id_user: string, id_family: any) {
    try {
      const response = this.familyClient.send('family/get_all_Member', { id_user, id_family })
        .pipe(
          timeout(15000),
        );
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getAllFamily(id_user: string) {
    try {
      const response = this.familyClient.send('family/get_all_Family', id_user)
        .pipe(
          timeout(15000),
        );
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }

  }

  async addMember(id_user: string, memberFamilyDto: MemberFamilyDto) {
    try {
      const response = this.familyClient.send('family/add_Member', { id_user, memberFamilyDto })
        .pipe(
          timeout(15000),
        );
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async deleteMember(id_user: string, deleteMemberDTO: DeleteMemberDTO) {
    try {
      const response = this.familyClient.send('family/delete_Member', { id_user, deleteMemberDTO })
        .pipe(
          timeout(15000),
        );
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async createFamily(id_user, createFamilyDto: CreateFamilyDto) {
    try {
      const source = this.familyClient.send('family/create_Family', { id_user, createFamilyDto }).pipe(
        timeout(15000)
      );
      const data = await lastValueFrom(source);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateFamily(id_user: string, updateFamilyDTO: UpdateFamilyDTO) {
    try {
      const source = this.familyClient.send('family/update_Family', { id_user, updateFamilyDTO }).pipe(
        timeout(15000)
      );
      const data = await lastValueFrom(source);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async deleteFamily(id_user: string, id_family) {
    try {
      const source = this.familyClient.send('family/delete_Family', { id_user, id_family }).pipe(
        timeout(15000)
      );
      const data = await lastValueFrom(source);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async changeAvatar(id_user: string, id_family: number, file: Express.Multer.File) {
    try {
      const source = this.familyClient.send('family/change_avatar', { id_user, id_family, file }).pipe(
        timeout(15000)
      );
      const data = await lastValueFrom(source);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}