import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService, LoginType, Users } from '@app/common';
import { RpcException } from '@nestjs/microservices';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenPayload } from './interface/tokenPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly entityManager: EntityManager,
    private readonly firebaseService: FirebaseService,
  ) {}

  async validateGoogleUser(accessToken: string, profile: any) {
    try {
      const getUserQuery =
        'SELECT * FROM users where email = $1 and login_type = $2';
      const getUserParams = [profile.emails[0].value, LoginType.GOOGLE];
      const userResult = await this.entityManager.query(
        getUserQuery,
        getUserParams,
      );
      const user = userResult[0];
      if (!user) {
        const query =
          'SELECT * FROM f_create_user($1, $2, $3, $4, $5, $6, $7, $8)';
        const parameters = [
          profile.emails[0].value,
          null,
          '',
          profile.name.givenName,
          profile.name.familyName,
          null,
          LoginType.GOOGLE,
          profile.photos[0].value,
        ];

        const data = await this.entityManager.query(query, parameters);

        return await this.userRepository.findOne({
          where: {
            id_user: data[0].id_user,
            login_type: LoginType.GOOGLE,
          },
        });
      } else {
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
      const getUserQuery =
        'SELECT * FROM users where email = $1 and login_type = $2';
      const getUserParams = [profile.emails[0].value, LoginType.FACEBOOK];
      const userResult = await this.entityManager.query(
        getUserQuery,
        getUserParams,
      );
      const user = userResult[0];
      if (!user) {
        const query =
          'SELECT * FROM f_create_user($1, $2, $3, $4, $5, $6, $7, $8)';
        const parameters = [
          profile._json.email,
          null,
          '',
          profile.name.givenName,
          profile.name.familyName,
          '',
          LoginType.FACEBOOK,
          profile.photos[0].value,
        ];
        const data = await this.entityManager.query(query, parameters);

        return await this.userRepository.findOne({
          where: {
            id_user: data[0].id_user,
            login_type: LoginType.FACEBOOK,
          },
        });
      } else {
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
      const query = 'SELECT * FROM f_generate_refresh_token ($1, $2)';
      const parameters = [payload.id_user, refreshToken];
      await this.entityManager.query(query, parameters);
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
    const user = await this.validateGoogleUser(google_accessToken, profile);
    const {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
    } = await this.getTokens(user);
    try {
      const query = 'SELECT * FROM f_generate_refresh_token($1, $2)';
      const parameters = [user.id_user, refreshToken];
      await this.entityManager.query(query, parameters);
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
    const user = await this.validateFacebookUser(facebook_accessToken, profile);
    const {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
    } = await this.getTokens(user);
    try {
      const query = 'SELECT * FROM f_generate_refresh_token ($1, $2)';
      const parameters = [user.id_user, refreshToken];
      await this.entityManager.query(query, parameters);
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

  async refreshToken(payload: Users, deletedRefreshToken: string) {
    const {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
    } = await this.getTokens(payload);
    try {
      const genereateQuery = 'SELECT * FROM f_generate_refresh_token ($1, $2)';
      const generateTokenParameters = [payload.id_user, refreshToken];
      const deleteQuery = 'SELECT * FROM f_delete_refresh_token ($1)';
      const deleteTokenParameters = [deletedRefreshToken];

      const promises = [
        this.entityManager.query(genereateQuery, generateTokenParameters),
        this.entityManager.query(deleteQuery, deleteTokenParameters),
      ];
      await Promise.all(promises);
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

  async logout(refreshToken) {
    try {
      const query = 'SELECT * FROM f_delete_refresh_token ($1)';
      const parameters = [refreshToken];
      await this.entityManager.query(query, parameters);
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

    const Query = 'SELECT * FROM compare_passwords($1,$2)';
    const param = [inputPassword, user.password];
    const result = await this.entityManager.query(Query, param);

    const isMatch = result[0]['compare_passwords'];

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
}
