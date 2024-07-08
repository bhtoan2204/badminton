import { RefreshToken } from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async getTopUserLogin(limit: number = 10) {
    try {
      const topUsers = await this.refreshTokenRepository
        .createQueryBuilder('refreshToken')
        .select('refreshToken.id_user', 'id_user')
        .addSelect('COUNT(refreshToken.id)', 'loginCount')
        .groupBy('refreshToken.id_user')
        .orderBy('loginCount', 'DESC')
        .limit(limit)
        .getRawMany();

      return {
        data: topUsers,
        message: 'Top 10 user login',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Error getting top 10 user login',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
