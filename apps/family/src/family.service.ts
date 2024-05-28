import { HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { RpcException } from '@nestjs/microservices';
import { StorageService } from './storage/storage.service';
import { DeleteFileRequest, UploadFileRequest } from '@app/common';

@Injectable()
export class FamilyService {
  constructor(
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager,
    private readonly storageService: StorageService,
  ) { }

  async checkIsMember(id_user: string, id_family: number): Promise<boolean> {
    try {
      const q2 = 'select * from f_is_user_member_of_family($1, $2)';
      const param = [id_user, id_family];
      const data = await this.entityManager.query(q2, param);
      return data[0].f_is_user_member_of_family;
    }
    catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode ||  HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getFamily(id_user: string, id_family: any) {
    try {
      const q2 = 'select * from f_getfamily($1, $2)';
      const param = [id_user, id_family];
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

  async getMember(id_user: any) {
    try {
      const q2 = 'SELECT * FROM view_users where id_user = $1';
      const param = [id_user];
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

  async getAllMember(id_user: any, id_family: any) {
    try {
      const q2 = 'select * from f_get_all_member($1, $2)';
      const param = [id_user, id_family];
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

  async getAllFamily(id_user: string) {
    try {
      const q2 = 'select * from get_all_family($1)';
      const param = [id_user];
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

  async addMember(id_user: string, memberFamilyDto: any) {
    try {
      const { id_family, phone, gmail, role } = memberFamilyDto;
      const q2 = 'select * from f_add_member($1,$2,$3,$4,$5)';
      const param = [id_user, id_family, phone, gmail, role];
      const data = await this.entityManager.query(q2, param);
      return {
        data: data[0]['f_add_member'],
        message: 'Member added'
      };
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async createFamily(id_user: string, createFamilyDto) {
    try {
      const { description, name, id_order } = createFamilyDto;
      const Query = 'SELECT * FROM f_create_family($1, $2, $3, $4)';
      const params = [id_user, description, name, id_order];
      const data = await this.entityManager.query(Query, params);
      return { 
        data: data[0]['f_create_family'] ,
        message: 'Family created'
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async updateFamily(id_user: string, UpdateFamilyDTO) {
    try {
      const { id_family, description, name } = UpdateFamilyDTO;
      const Query = 'select * from f_update_family($1,$2,$3,$4)';
      const param = [id_user, id_family, name, description];
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

  async deleteFamily(id_user: string, id_family: any) {
    try {
      const Query = 'select * from f_delete_family($1, $2)';
      const param = [id_user, id_family];
      const data = await this.entityManager.query(Query, param);
      return {
        data: data[0]['f_delete_family'],
        message: 'Family deleted'
      };
    }

    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async deleteMember(id_user: string, member: any) {
    try {
      const { id_family, id_user } = member;

      const Query = 'select * from f_delete_member($1, $2, $3)';
      const param = [id_user, id_user, id_family];
      const data = await this.entityManager.query(Query, param);
      return {
        data: data[0]['f_delete_member'],
        message: 'Member deleted'
      }
    }

    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getIdsMember(id_user: string, id_family: number) {
    try {
      const Query = 'select * from f_get_ids_member($1, $2)';
      const param = [id_user, id_family];
      const data = await this.entityManager.query(Query, param);
      const ids = data.map(row => row.f_get_ids_member);
      return ids;
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async changeAvatar(id_user: string, id_family: number, file: any) {
    try {
      const query = 'SELECT * FROM f_is_user_member_of_family($1, $2)';
      const checkParams = [id_user, id_family];
      const results = await this.entityManager.query(query, checkParams);
      const isMember = results[0].f_is_user_member_of_family;
      if (!isMember) {
        throw new RpcException({
          message: 'User is not a member of the family',
          statusCode: HttpStatus.FORBIDDEN
        });
      }
      const filename = 'avatar_family_' + id_user + '_' + Date.now() + '_' + file.originalname;
      const params: UploadFileRequest = {
        fileName: filename,
        file: new Uint8Array(file.buffer.data)
      }
      const uploadImageData = await this.storageService.uploadFile(params);
      const fileUrl = uploadImageData.fileUrl;

      const changeAvtQuery = 'SELECT * FROM f_update_family_avatar($1, $2, $3)';
      const changeAvtParam = [id_user, id_family, fileUrl];
      const result = await this.entityManager.query(changeAvtQuery, changeAvtParam);
      const oldUrl = result[0]['f_update_family_avatar'];
      if (oldUrl) {
        const deleteParams: DeleteFileRequest = {
          fileName: (oldUrl).split('/').pop()
        }
        await this.storageService.deleteFile(deleteParams);
      }

      return {
        message: file.size + ' bytes uploaded successfully',
        data: fileUrl
      };
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }
}