import { HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "./user/user.service";
import { TokenPayload } from "./interface/tokenPayload.interface";
import { LoginType, Users } from "@app/common";
import { RpcException } from "@nestjs/microservices";
import { EntityManager } from "typeorm";

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly entityManager: EntityManager
  ) {}

  async getTokens(payload) {
    const jwtPayload: TokenPayload = { 
      email: payload.email, 
      id_user: payload.id_user,
      phone: payload.phone,
      isadmin: payload.isadmin
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '1d',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_SECRET_REFRESH'),
        expiresIn: '7d',
      })
    ]);
    return { accessToken, refreshToken };
  }

  async localLogin(payload: Users){
    const { accessToken, refreshToken } = await this.getTokens(payload);
    try {
      const query = "SELECT * FROM f_generate_refresh_token ($1, $2)";
      const parameters = [payload.id_user, refreshToken];
      await this.entityManager.query(query, parameters);
    }
    catch(err) {
      throw new RpcException({
        message: err.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
    return {
      accessToken,
      refreshToken
    };
  }

  async googleValidate(google_accessToken: string, profile: any) {
    const user = await this.userService.validateGoogleUser(google_accessToken, profile);
    const { accessToken, refreshToken } = await this.getTokens(user);
    try {
      const query = "SELECT * FROM f_generate_refresh_token ($1, $2)";
      const parameters = [user.id_user, refreshToken];
      await this.entityManager.query(query, parameters);
    }
    catch(err) {
      throw new RpcException({
        message: err.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
    return {
      accessToken,
      refreshToken
    };
  }

  async facebookValidate(facebook_accessToken: string, profile: any) {
    const user = await this.userService.validateFacebookUser(facebook_accessToken, profile);
    const { accessToken, refreshToken } = await this.getTokens(user);
    try {
      const query = "SELECT * FROM f_generate_refresh_token ($1, $2)";
      const parameters = [user.id_user, refreshToken];
      await this.entityManager.query(query, parameters);
    }
    catch(err) {
      throw new RpcException({
        message: err.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
    return {
      accessToken,
      refreshToken
    };
  }

  async refreshToken(payload: Users, deletedRefreshToken: string) {
    const {accessToken, refreshToken} = await this.getTokens(payload);
    try {
      const genereateQuery = "SELECT * FROM f_generate_refresh_token ($1, $2)";
      const generateTokenParameters = [payload.id_user, refreshToken];
      const deleteQuery = "SELECT * FROM f_delete_refresh_token ($1)";
      const deleteTokenParameters = [deletedRefreshToken];

      const promises = [
        this.entityManager.query(genereateQuery, generateTokenParameters),
        this.entityManager.query(deleteQuery, deleteTokenParameters)
      ];
      await Promise.all(promises);
    }
    catch(err) {
      throw new RpcException({
        message: err.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
    return {
      accessToken,
      refreshToken
    };
  }
  
  async logout(refreshToken) {
    try {
      const query = "SELECT * FROM f_delete_refresh_token ($1)";
      const parameters = [refreshToken];
      await this.entityManager.query(query, parameters);
      return {
        message: 'Logout successfully'
      };
    }
    catch(err) {
      throw new RpcException({
        message: err.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }
}