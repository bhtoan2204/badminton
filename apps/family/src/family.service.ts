import { Family } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from "typeorm";
import { createFamilyDto } from './dto/createFamilyDto.dto';
import { ConfigService } from "@nestjs/config";
import { Users } from '@app/common';
import { CurrentUser } from 'apps/gateway/decorator/current-user.decorator';
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
    }

    // return await this.familyRepository.findOne({where: 
    //   {
    //     id_family : id_family
    //   }
  }

  async createFamily(user: any,createFamilyDto: createFamilyDto) {
    try {
      const usersEntity: Users = Object.assign(new Users(), user);

      const { description, name } = createFamilyDto;
      const Query = 'SELECT * FROM f_create_family($1, $2, $3)';
      const params = [user.id_user, description, name]; 
      const data = await this.entityManager.query(Query, params);
      return data;
    } catch (error) {
      throw error;
    }
  }
  

  async updateFamily(user: any,createFamilyDto: createFamilyDto) {
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
}
