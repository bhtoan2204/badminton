import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./user/dto/login.dto";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "./user/user.service";
import { User } from "../utils/models/user.model";
import { TokenPayload } from "./interface/tokenPayload.interface";

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async getTokens(payload: User) {
    const jwtPayload: TokenPayload = { 
      email: payload.email, 
      id: payload.id,
      phone: payload.phone,
      role: 'user'
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

  async localLogin(payload: User){
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
        id: payload.id,
        email: payload.email,
        phone: payload.phone,
        role: 'user'
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
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: 'user'
      }
    };
  }

  async refreshToken(payload: User) {
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
        id: payload.id,
        email: payload.email,
        phone: payload.phone,
        role: 'user'
      }
    };
  }

  async getJwtSecret() {
    return this.configService.get<string>('JWT_SECRET');
  }

  async getJwtSecretRefresh() {
    return this.configService.get<string>('JWT_SECRET_REFRESH');
  }

  async getGoogleConfig() {
    return {
      clientID: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: this.configService.get<string>('GOOGLE_CALLBACK_URL')
    };
  }
}