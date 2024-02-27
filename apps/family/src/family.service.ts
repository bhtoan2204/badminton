import { Family } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from "typeorm";
import { createFamilyDto } from './dto/createFamilyDto.dto';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class familyService {
  constructor(
    @InjectRepository(Family) private familyRepository: Repository<Family>,
    private readonly configService: ConfigService,

    private readonly entityManager: EntityManager

  ) {}

  async getFamily(id: number){
    try{
      const Query = 'select * from family where id_family = $1;';
      const param = [id];
      const data= await this.entityManager.query(Query, param);
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

  async createFamily(createFamilyDto: createFamilyDto) {
    try{
      const {description, name} = createFamilyDto;
      const Query = 'select * from f_create_family($1, $2)';
      const param = [description, name];
      const data= await this.entityManager.query(Query, param);
      return data;
    }
    catch(error) {
        throw error;
    }
  }

  async updateFamily(id: number, createFamilyDto: createFamilyDto) {
    try{
      const {description, name} = createFamilyDto;
      const Query = 'call p_update_family($1,$2.$3)';
      const param = [id,description, name];
      const data= await this.entityManager.query(Query, param);
      return data;
    }
    catch(error) {
        throw error;
    }
  }

  async deleteFamily(id: number) {
    try{
      const Query = 'CALL p_delete_family($1)';
      const param = [id];
      const data= await this.entityManager.query(Query, param);
      return data;
    }
    catch(error) {
        throw error;
    }
  }
}
