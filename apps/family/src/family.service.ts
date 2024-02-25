import { Family } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FamilyService {
  constructor(
    @InjectRepository(Family) private familyRepository: Repository<Family>
  ) {}

  async getFamily(id: number): Promise<any> {
    return await this.familyRepository.find({where: {
      id_family: id,
    }});
  }
}
