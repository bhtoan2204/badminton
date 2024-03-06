import { HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from "typeorm";
import { CreateFamilyDto } from 'apps/gateway/src/family/dto/createFamilyDto.dto';
import { MemberFamilyDto } from 'apps/gateway/src/family/dto/memberFamilyDto.dto';
import { DeleteMemberDTO } from 'apps/gateway/src/family/dto/delete-familydto.dto';
import { UpdateFamilyDTO } from 'apps/gateway/src/family/dto/update-familyDTO.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class FamilyService {
  constructor(
    private readonly entityManager: EntityManager
  ) { }

  async getFamily(user, id_family: any) {
    try {
      const q2 = 'select * from f_getfamily($1, $2)';
      const param = [user.id_user, id_family];
      const data = await this.entityManager.query(q2, param);
      return data;
    }
    catch (error) {
      throw error;
    }
  }

  async GetAllFamily(user: any) {
    try {
      const q2 = 'select * from get_all_family($1)';
      const param = [user.id_user];
      const data = await this.entityManager.query(q2, param);
      return data;
    }
    catch (error) {
      throw error;
    }
  }



  async addMember(user, memberFamilyDto: MemberFamilyDto) {
    try {
      const { id_family, phone, gmail, role } = memberFamilyDto;
      const q2 = 'call p_add_member($1,$2,$3,$4,$5)';
      const param = [user.id_user, id_family, phone, gmail, role];
      const data = await this.entityManager.query(q2, param);
      return data;
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }


  async createFamily(user: any, createFamilyDto: CreateFamilyDto) {
    try {
      const { description, name } = createFamilyDto;
      const Query = 'SELECT * FROM f_create_family($1, $2, $3)';
      const params = [user.id_user, description, name];
      const data = await this.entityManager.query(Query, params);
      return data[0]['f_create_family'];
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async updateFamily(user, UpdateFamilyDTO: UpdateFamilyDTO) {
    try {
      const { id_family, description, name } = UpdateFamilyDTO;
      const Query = 'call p_update_family($1,$2,$3,$4)';
      const param = [user.id_user, id_family, name, description];
      const data = await this.entityManager.query(Query, param);
      return data;
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }



  async deleteFamily(user, id_family: any) {
    try {
      const Query = 'call p_delete_family($1, $2)';
      const param = [user.id_user, id_family];
      const data = await this.entityManager.query(Query, param);
      return data;
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async deleteMember(user, member: DeleteMemberDTO) {
    try {
      const { id_family, id_user } = member;

      const Query = 'call p_delete_member($1, $2, $3)';
      const param = [user.id_user, id_user, id_family];
      const data = await this.entityManager.query(Query, param);
      return data;
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }
}