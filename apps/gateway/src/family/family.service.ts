import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FAMILY_SERVICE } from '../utils';
import { lastValueFrom, timeout } from 'rxjs';
import { CreateFamilyDto } from './dto/createFamily.dto';
import { MemberFamilyDto } from './dto/memberFamily.dto';
import { DeleteMemberDTO } from './dto/deleteFamily.dto';
import { UpdateFamilyDTO } from './dto/updateFamily.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class FamilyService {
  constructor(
    @Inject(FAMILY_SERVICE) private familyClient: ClientProxy,
    @InjectRedis() private readonly redisService: Redis,
  ) {}

  async getFamily(id_user, id_family) {
    try {
      const response = this.familyClient
        .send('familyClient/get_Family', { id_user, id_family })
        .pipe(timeout(15000));
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
      const response = this.familyClient
        .send('familyClient/get_Member', { id_user })
        .pipe(timeout(15000));
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
      const response = this.familyClient
        .send('familyClient/get_all_Member', { id_user, id_family })
        .pipe(timeout(15000));
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
      const response = this.familyClient
        .send('familyClient/get_all_Family', id_user)
        .pipe(timeout(15000));
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
      const response = this.familyClient
        .send('familyClient/add_Member', { id_user, memberFamilyDto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      const cacheKey = `familyCheck:${memberFamilyDto.id_family}:${id_user}`;
      await this.redisService.del(cacheKey);
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
      const response = this.familyClient
        .send('familyClient/delete_Member', { id_user, deleteMemberDTO })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      const cacheKey = `familyCheck:${deleteMemberDTO.id_family}:${id_user}`;
      await this.redisService.del(cacheKey);
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
      const source = this.familyClient
        .send('familyClient/create_Family', { id_user, createFamilyDto })
        .pipe(timeout(15000));
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
      const source = this.familyClient
        .send('familyClient/update_Family', { id_user, updateFamilyDTO })
        .pipe(timeout(15000));
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
      const source = this.familyClient
        .send('familyClient/delete_Family', { id_user, id_family })
        .pipe(timeout(15000));
      const data = await lastValueFrom(source);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async changeAvatar(
    id_user: string,
    id_family: number,
    file: Express.Multer.File,
  ) {
    try {
      const source = this.familyClient
        .send('familyClient/change_avatar', { id_user, id_family, file })
        .pipe(timeout(15000));
      const data = await lastValueFrom(source);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async leaveFamily(id_user: string, id_family: number) {
    try {
      const source = this.familyClient
        .send('familyClient/leave_Family', { id_user, id_family })
        .pipe(timeout(15000));
      const data = await lastValueFrom(source);
      const cacheKey = `familyCheck:${id_family}:${id_user}`;
      await this.redisService.del(cacheKey);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async kickMember(id_user: string, id_user_kick: string, id_family: number) {
    try {
      const source = this.familyClient
        .send('familyClient/kick_Member', { id_user, id_user_kick, id_family })
        .pipe(timeout(15000));
      const data = await lastValueFrom(source);
      const cacheKey = `familyCheck:${id_family}:${id_user_kick}`;
      await this.redisService.del(cacheKey);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}
