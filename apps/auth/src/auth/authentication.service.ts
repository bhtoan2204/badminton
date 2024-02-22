import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "./user/user.service";
import { TokenPayload } from "./interface/tokenPayload.interface";
import { Users } from "@app/common";

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async getTokens(payload: Users) {
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
    const {accessToken, refreshToken} = await this.getTokens(payload);
    try {
      // TODO: save refresh token to db
    }
    catch(err) {
      if (err instanceof NotFoundException) {
        // TODO: delete refresh token from db
        throw new UnauthorizedException();
      } else {
        throw err;
      }
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

  async googleValidate(google_accessToken: string, profile: any) {
    const user = await this.userService.validateGoogleUser(google_accessToken, profile);
    const { accessToken, refreshToken } = await this.getTokens(user);
    try {
      // TODO: save refresh token to db
    }
    catch(err) {
      if (err instanceof NotFoundException) {
        // TODO: delete refresh token from db
        throw new UnauthorizedException();
      } else {
        throw err;
      }
    }
    return {
      accessToken,
      refreshToken,
      data: {
        id_user: user.id_user,
        email: user.email,
        phone: user.phone,
        isadmin: user.isadmin
      }
    };
  }

  async refreshToken(payload: Users) {
    const {accessToken, refreshToken} = await this.getTokens(payload);
    try {
      // TODO: save refresh token to db
    }
    catch(err) {
      if (err instanceof NotFoundException) {
        // TODO: delete refresh token from db
        throw new UnauthorizedException();
      } else {
        throw err;
      }
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