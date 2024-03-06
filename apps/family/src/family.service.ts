import { Injectable } from '@nestjs/common';
import { EntityManager } from "typeorm";
import { CreateFamilyDto } from 'apps/gateway/src/family/dto/createFamily.dto';
import { ConfigService } from "@nestjs/config";
import { MemberFamilyDto } from 'apps/gateway/src/family/dto/memberFamily.dto';
import { DeleteMemberDTO } from 'apps/gateway/src/family/dto/deleteFamily.dto';
import { UpdateFamilyDTO } from 'apps/gateway/src/family/dto/updateFamily.dto';

@Injectable()

export class FamilyService {
  constructor(
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager
) {}

  async getFamily(user, id_family: any){
    try {
      const q2 = 'select * from f_getfamily($1, $2)';
      const param = [user.id_user, id_family];
      const data= await this.entityManager.query(q2, param);
      return data;
    }
    catch(error) {
        throw error;
    }}

    async getMember(user, id_user: any){
      try {
        const q2 = 'SELECT email, phone, language, firstname, lastname FROM users WHERE id_user = $1';
        const param = [id_user];
        const data= await this.entityManager.query(q2, param);
        return data;
      }
      catch(error) {
          throw error;
      }}

      async getallMember(user, id_family: any){
        try {
          const q2 = 'select * from f_get_all_member($1, $2)';
          const param = [user.id_user, id_family];
          const data= await this.entityManager.query(q2, param);
          return data;
        }
        catch(error) {
            throw error;
        }}
  
    async GetAllFamily(user: any){
      try {
        const q2 = 'select * from get_all_family($1)';
        const param = [user.id_user];
        const data= await this.entityManager.query(q2, param);
        return data;
      }
      catch(error) {
          throw error;
      }}



  async addMember(user, memberFamilyDto: MemberFamilyDto){
    try {
      const {id_family, phone, gmail, role} = memberFamilyDto;
      const q2 = 'call p_add_member($1,$2,$3,$4,$5)';
      const param = [user.id_user, id_family, phone, gmail,role];
      const data= await this.entityManager.query(q2, param);
      return data;
    }
    catch(error) {
        throw error;
    }}


  async createFamily(user: any,createFamilyDto: CreateFamilyDto) {
    try {
      const { description, name } = createFamilyDto;
      const Query = 'SELECT * FROM f_create_family($1, $2, $3)';
      const params = [user.id_user, description, name]; 
      const data = await this.entityManager.query(Query, params);
      return data[0]['f_create_family'];
    } catch (error) {
      throw error;
    }
  }

  async updateFamily(user,UpdateFamilyDTO: UpdateFamilyDTO) {
    try{
      const {id_family, description, name} = UpdateFamilyDTO;
      const Query = 'call p_update_family($1,$2,$3,$4)';
      const param = [user.id_user, id_family,name,description];
      const data= await this.entityManager.query(Query, param);
      return data;
    }
    catch(error) {
        throw error;
    }
  }



  async deleteFamily(user, id_family: any) {
    try{
      const Query = 'call p_delete_family($1, $2)';
      const param = [user.id_user, id_family];
      const data= await this.entityManager.query(Query, param);
      return data;
    }

    catch(error) {
        throw error;
    }
  }

  async deleteMember(user, member : DeleteMemberDTO) {
    try{
      const {id_family, id_user} = member;

      const Query = 'call p_delete_member($1, $2, $3)';
      const param = [user.id_user, id_user, id_family];
      const data= await this.entityManager.query(Query, param);
      return data;
    }

    catch(error) {
        throw error;
    }
  }
}