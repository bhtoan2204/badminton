import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FAMILY_SERVICE } from '../utils';
import { MemberFamilyDto } from './dto/memberFamily.dto';
import { DeleteMemberDTO } from './dto/deleteFamily.dto';
import { UpdateFamilyDTO } from './dto/updateFamily.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { RmqService } from '@app/common';

@Injectable()
export class FamilyService {
  constructor(
    @Inject(FAMILY_SERVICE) private familyClient: ClientProxy,
    @InjectRedis() private readonly redisService: Redis,
    private readonly rmqService: RmqService,
  ) {}

  async getFamily(id_user, id_family) {
    try {
      return await this.rmqService.send(
        this.familyClient,
        'familyClient/getFamily',
        { id_user, id_family },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getMember(id_user) {
    try {
      return await this.rmqService.send(
        this.familyClient,
        'familyClient/getMember',
        { id_user },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getAllMember(id_user: string, id_family: number, search: string) {
    try {
      return await this.rmqService.send(
        this.familyClient,
        'familyClient/getAllMember',
        { id_user, id_family, search },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getAllFamily(id_user: string) {
    try {
      return await this.rmqService.send(
        this.familyClient,
        'familyClient/getAllFamily',
        id_user,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async addMember(id_user: string, memberFamilyDto: MemberFamilyDto) {
    try {
      const data = await this.rmqService.send(
        this.familyClient,
        'familyClient/addMember',
        { id_user, memberFamilyDto },
      );
      const cacheKey = `familyCheck:${memberFamilyDto.id_family}:${id_user}`;
      await this.redisService.del(cacheKey);
      return data;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async deleteMember(id_user: string, deleteMemberDTO: DeleteMemberDTO) {
    try {
      const data = await this.rmqService.send(
        this.familyClient,
        'familyClient/deleteMember',
        { id_user, deleteMemberDTO },
      );
      const cacheKey = `familyCheck:${deleteMemberDTO.id_family}:${id_user}`;
      await this.redisService.del(cacheKey);
      return data;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async updateFamily(id_user: string, updateFamilyDTO: UpdateFamilyDTO) {
    try {
      return await this.rmqService.send(
        this.familyClient,
        'familyClient/updateFamily',
        { id_user, updateFamilyDTO },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async changeAvatar(
    id_user: string,
    id_family: number,
    file: Express.Multer.File,
  ) {
    try {
      return await this.rmqService.send(
        this.familyClient,
        'familyClient/changeAvatar',
        { id_user, id_family, file },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async leaveFamily(id_user: string, id_family: number) {
    try {
      const data = await this.rmqService.send(
        this.familyClient,
        'familyClient/leaveFamily',
        { id_user, id_family },
      );
      const cacheKey = `familyCheck:${id_family}:${id_user}`;
      await this.redisService.del(cacheKey);
      return data;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async kickMember(id_user: string, id_user_kick: string, id_family: number) {
    try {
      const data = await this.rmqService.send(
        this.familyClient,
        'familyClient/kickMember',
        { id_user, id_user_kick, id_family },
      );
      const cacheKey = `familyCheck:${id_family}:${id_user_kick}`;
      await this.redisService.del(cacheKey);
      return data;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getFamilyRoles() {
    try {
      return await this.rmqService.send(
        this.familyClient,
        'familyClient/getFamilyRoles',
        {},
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async assignFamilyRole(dto: {
    id_user: string;
    id_family_role: number;
    id_family: number;
  }) {
    try {
      return await this.rmqService.send(
        this.familyClient,
        'familyClient/assignFamilyRole',
        { dto },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
