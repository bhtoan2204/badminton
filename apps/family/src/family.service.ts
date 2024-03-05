import { Family } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from "typeorm";
import { CreateFamilyDto } from 'apps/gateway/src/family/dto/createFamilyDto.dto';
import { ConfigService } from "@nestjs/config";
import { MemberFamilyDto } from 'apps/gateway/src/family/dto/memberFamilyDto.dto';
import { DeleteMemberDTO } from 'apps/gateway/src/family/dto/delete-familydto.dto';


@Injectable()

export class FamilyService {
  constructor(
    @InjectRepository(Family) private familyRepository: Repository<Family>,
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





  async addMember(user: any, memberFamilyDto: MemberFamilyDto){
    try {
      const {phone, gmail, role} = memberFamilyDto;
      const q2 = 'call p_add_member($1,$2,$3,$4)';
      const param = [user.id_user, phone, gmail,role];
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

  async updateFamily(user: any,createFamilyDto: CreateFamilyDto) {
    try{
      const {description, name} = createFamilyDto;
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
    try{
      const Query = 'call p_delete_family($1)';
      const param = [user.id_user];
      const data= await this.entityManager.query(Query, param);
      return data;
    }

    catch(error) {
        throw error;
    }
  }

  async deleteMember(member : DeleteMemberDTO) {
    try{
      const {id_family, id_user} = member;

      const Query = 'call p_delete_member($1, $2)';
      const param = [id_user, id_family];
      const data= await this.entityManager.query(Query, param);
      return data;
    }

    catch(error) {
        throw error;
    }
  }
}