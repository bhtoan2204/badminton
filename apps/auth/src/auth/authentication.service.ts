import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "./user/user.service";
import { TokenPayload } from "./interface/tokenPayload.interface";
import { Users } from "@app/common";
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
        statusCode: 404
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
        statusCode: 404
      });
    }
    return {
      accessToken,
      refreshToken
    };
  }

  async refreshToken(payload: Users) {
    const {accessToken, refreshToken} = await this.getTokens(payload);
    try {
      const query = "SELECT * FROM f_generate_refresh_token ($1, $2)";
      const parameters = [payload.id_user, refreshToken];
      await this.entityManager.query(query, parameters);
    }
    catch(err) {
      throw new RpcException({
        message: err.message,
        statusCode: 404
      });
    }
    return {
      accessToken,
      refreshToken,
      data: {
        id_user: payload.id_user,
        email: payload.email,
        phone: payload.phone,
        isadmin: payload.isadmin
      }
    };
  }
  
}