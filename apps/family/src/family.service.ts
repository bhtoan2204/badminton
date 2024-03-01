import { Injectable } from '@nestjs/common';
import { EntityManager } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { MemberFamilyDto } from 'apps/gateway/src/family/dto/memberFamilyDto.dto';

@Injectable()
export class FamilyService {
  constructor(
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager
) {}

  async getFamily(user: any){
    try {
      const q2 = 'select * from family where id_family = (select id_family from users where id_user=$1) ';
      const param = [user.id_user];
      const data= await this.entityManager.query(q2, param);
      return data;
    }
    catch(error) {
        throw error;
    }}


  async addMember(user: any, MemberFamilyDto: MemberFamilyDto){
    try {
      const {phone, gmail, role} = MemberFamilyDto;
      const q2 = 'call p_add_member($1,$2,$3,$4)';
      const param = [user.id_user, phone, gmail,role];
      const data= await this.entityManager.query(q2, param);
      return data;
    }
    catch(error) {
        throw error;
    }}
  async createFamily(user: any, CreateFamilyDto: any) {
    try {
      const { description, name } = CreateFamilyDto;
      const Query = 'SELECT * FROM f_create_family($1, $2, $3)';
      const params = [user.id_user, description, name]; 
      const data = await this.entityManager.query(Query, params);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateFamily(user: any, CreateFamilyDto: any) {
    try {
      const {description, name} = CreateFamilyDto;
      const Query = 'call p_update_family($1,$2,$3)';
      const param = [user.id_user,description, name];
      const data= await this.entityManager.query(Query, param);
      return data;
    }
    catch(error) {
        throw error;
    }
  }

  async deleteFamily(user: any) {
    try {
      const Query = 'call p_delete_family($1)';
      const param = [user.id_user];
      const data= await this.entityManager.query(Query, param);
      return data;
    }
    catch(error) {
        throw error;
    }
  }
}