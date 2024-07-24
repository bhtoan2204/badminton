import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService, LoginType, RefreshToken, Users } from '@app/common';
import { RpcException } from '@nestjs/microservices';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenPayload } from './interface/tokenPayload.interface';
import { UserService } from './user/user.service';
import { comparePassword } from './utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly firebaseService: FirebaseService,
    private readonly userService: UserService,
  ) {}

  async validateGoogleUser(accessToken: string, profile: any) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email: profile.emails[0].value,
          login_type: LoginType.GOOGLE,
        },
      });
      console.log(profile);
      if (!user) {
        const newUser = await this.userService.createAccount({
          email: profile.emails[0].value,
          phone: null,
          password: '',
          firstname: profile.name.givenName,
          lastname: profile.name.familyName,
          genre: null,
          birthdate: null,
          login_type: LoginType.GOOGLE,
          avatar: profile.photos[0].value,
        });

        return newUser;
      } else {
        if (user.is_banned === true) {
          throw new RpcException({
            message: 'User is banned',
            statusCode: HttpStatus.UNAUTHORIZED,
          });
        }
        return user;
      }
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: 404,
      });
    }
  }

  async validateFacebookUser(accessToken: string, profile: any) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email: profile.emails[0].value,
          login_type: LoginType.FACEBOOK,
        },
      });
      if (!user) {
        const newUser = await this.userService.createAccount({
          email: profile.emails[0].value,
          phone: null,
          password: '',
          firstname: profile.name.givenName,
          lastname: profile.name.familyName,
          genre: null,
          birthdate: null,
          login_type: LoginType.FACEBOOK,
          avatar: profile.photos[0].value,
        });

        return newUser;
      } else {
        if (user.is_banned === true) {
          throw new RpcException({
            message: 'User is banned',
            statusCode: HttpStatus.UNAUTHORIZED,
          });
        }
        return user;
      }
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: 404,
      });
    }
  }

  async getTokens(payload) {
    const jwtPayload: TokenPayload = {
      email: payload.email,
      id_user: payload.id_user,
      phone: payload.phone,
      isadmin: payload.isadmin,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '1d',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_SECRET_REFRESH'),
        expiresIn: '3d',
      }),
    ]);

    const currentTime = Math.floor(Date.now() / 1000);
    const accessTokenExpiresIn =
      currentTime +
      parseInt(this.configService.get<string>('JWT_EXPIRATION'), 10);
    const refreshTokenExpiresIn =
      currentTime +
      parseInt(this.configService.get<string>('JWT_REFRESH_EXPIRATION'), 10);
    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
    };
  }

  async localLogin(payload: Users) {
    const {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
    } = await this.getTokens(payload);
    try {
      const newRefreshToken = new RefreshToken();
      newRefreshToken.id_user = payload.id_user;
      newRefreshToken.refresh_token = refreshToken;
      newRefreshToken.expired_at = new Date(refreshTokenExpiresIn * 1000);
      await this.refreshTokenRepository.save(newRefreshToken);
    } catch (err) {
      throw new RpcException({
        message: err.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
    };
  }

  async googleValidate(google_accessToken: string, profile: any) {
    const user = (await this.validateGoogleUser(
      google_accessToken,
      profile,
    )) as Users;
    const {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
    } = await this.getTokens(user);
    try {
      const newRefreshToken = new RefreshToken();
      newRefreshToken.id_user = user.id_user;
      newRefreshToken.refresh_token = refreshToken;
      newRefreshToken.expired_at = new Date(refreshTokenExpiresIn * 1000);
      await this.refreshTokenRepository.save(newRefreshToken);
    } catch (err) {
      throw new RpcException({
        message: err.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
    };
  }

  async facebookValidate(facebook_accessToken: string, profile: any) {
    const user = (await this.validateFacebookUser(
      facebook_accessToken,
      profile,
    )) as Users;
    const {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
    } = await this.getTokens(user);
    try {
      const newRefreshToken = new RefreshToken();
      newRefreshToken.id_user = user.id_user;
      newRefreshToken.refresh_token = refreshToken;
      newRefreshToken.expired_at = new Date(refreshTokenExpiresIn * 1000);
      await this.refreshTokenRepository.save(newRefreshToken);
    } catch (err) {
      throw new RpcException({
        message: err.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async refreshToken(payload: Users, deletedRefreshToken: string) {
    const {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
    } = await this.getTokens(payload);
    try {
      const newRefreshToken = new RefreshToken();
      newRefreshToken.id_user = payload.id_user;
      newRefreshToken.refresh_token = refreshToken;
      newRefreshToken.expired_at = new Date(refreshTokenExpiresIn * 1000);
      await this.refreshTokenRepository.save(newRefreshToken);
    } catch (err) {
      throw new RpcException({
        message: err.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async logout(id_user: string) {
    try {
      await this.refreshTokenRepository.delete({ id_user });
      return {
        message: 'Logout successfully',
      };
    } catch (err) {
      throw new RpcException({
        message: err.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async validateUserId(id_user: string) {
    const user = await this.userRepository.findOne({ where: { id_user } });
    if (!user) {
      throw new RpcException({
        message: 'User not found',
        statusCode: 404,
      });
    }
    return user;
  }

  async validateLocalUser(email: string, inputPassword: string) {
    let user;
    try {
      user = await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .addSelect('user.salt')
        .where('user.email = :email', { email })
        .andWhere('user.login_type = :login_type', {
          login_type: LoginType.LOCAL,
        })
        .getOne();
    } catch (error) {
      throw new RpcException({
        message: 'An error occurred while retrieving user information',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    if (!user) {
      throw new RpcException({
        message: 'User not found',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    if (user.is_banned === true) {
      throw new RpcException({
        message: 'User is banned',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    const isMatch = comparePassword(inputPassword, user.password, user.salt);

    if (!isMatch) {
      throw new RpcException({
        message: 'Credentials are not valid',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    return user;
  }

  async saveFCMToken(userId: string, fcmToken: string) {
    try {
      return await this.firebaseService.saveFCMToken(userId, fcmToken);
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: 404,
      });
    }
  }

  async deleteFCMToken(userId: string, fcmToken: string) {
    try {
      return await this.firebaseService.deleteFCMToken(userId, fcmToken);
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: 404,
      });
    }
  }

  async getUsersAdmin(
    page: number,
    itemsPerPage: number,
    search: string,
    sortBy: string,
    sortDesc: boolean,
  ) {
    try {
      const option = {
        take: itemsPerPage,
        skip: (page - 1) * itemsPerPage,
      };
      if (search) {
        option['where'] = [
          { email: Like(`%${search}%`) },
          { firstname: Like(`%${search}%`) },
          { lastname: Like(`%${search}%`) },
        ];
      }
      if (sortBy && sortDesc) {
        option['order'] = { [sortBy]: sortDesc ? 'DESC' : 'ASC' };
      }
      const [data, total] = await this.userRepository.findAndCount(option);
      return {
        data,
        total,
        message: 'Get users successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async banUser(id_user: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id_user } });
      if (!user) {
        throw new RpcException({
          message: 'User not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      if (user.isadmin === true) {
        throw new RpcException({
          message: 'Cannot ban an admin user',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
      user.is_banned = true;
      const data = await this.userRepository.save(user);
      return {
        data: data,
        message: 'User banned successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async unbanUser(id_user: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id_user } });
      if (!user) {
        throw new RpcException({
          message: 'User not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      user.is_banned = false;
      const data = await this.userRepository.save(user);
      return {
        data: data,
        message: 'User unbanned successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
