import { RefreshToken, Users } from '@app/common';
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
        .addSelect('COUNT(refreshToken.id)', 'login_count')
        .addSelect('user.email', 'email')
        .addSelect('user.firstname', 'firstname')
        .addSelect('user.lastname', 'lastname')
        .addSelect('user.avatar', 'avatar')
        .addSelect('MAX(refreshToken.created_at)', 'last_login')
        .leftJoin(Users, 'user', 'user.id_user = refreshToken.id_user')
        .groupBy('refreshToken.id_user')
        .addGroupBy('user.email')
        .addGroupBy('user.firstname')
        .addGroupBy('user.lastname')
        .addGroupBy('user.avatar')
        .orderBy('login_count', 'DESC')
        .limit(limit)
        .getRawMany();

      return {
        data: topUsers.map((user) => ({
          id_user: user.id_user,
          loginCount: parseInt(user.login_count, 10),
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          lastLogin: user.last_login,
          avatar: user.avatar,
        })),
        message: 'Top user login retrieved successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Error getting top 10 user login',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
