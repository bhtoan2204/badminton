import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { CreateAccountDto } from './dto/createAccount.dto';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from '../utils';
import { LoginType, RmqService } from '@app/common';
import { CreateAccountOTPDto } from './dto/createOTPAccount.dto';
import { VerifyAccountDto } from './dto/verifyAccount.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {}

  async createAccount(createUserDto: CreateAccountDto) {
    try {
      const dto = { login_type: LoginType.LOCAL, ...createUserDto };
      return await this.rmqService.send(
        this.authClient,
        'authClient/create_account',
        dto,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async sendOtpVerifyAccount(dto: CreateAccountOTPDto) {
    try {
      return await this.rmqService.send(
        this.authClient,
        'authClient/sendOtpVerifyAccount',
        dto,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async verifyAccount(dto: VerifyAccountDto) {
    try {
      return await this.rmqService.send(
        this.authClient,
        'authClient/verifyAccount',
        dto,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async checkPhone(phone: string) {
    try {
      return await this.rmqService.send(
        this.authClient,
        'authClient/check_phone',
        { phone },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getProfile(currentUser) {
    try {
      return await this.rmqService.send(
        this.authClient,
        'authClient/get_profile',
        currentUser,
      );
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async changePassword(currentUser, dto: ChangePasswordDto) {
    try {
      return await this.rmqService.send(
        this.authClient,
        'authClient/change_password',
        { currentUser, dto },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async forgotPassword(data: any) {
    try {
      return await this.rmqService.send(
        this.authClient,
        'authClient/forgot_password',
        data,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async checkOTP(data: any) {
    try {
      return await this.rmqService.send(
        this.authClient,
        'authClient/check_otp',
        data,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async resetPassword(data: any) {
    try {
      return await this.rmqService.send(
        this.authClient,
        'authClient/reset_password',
        data,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async updateProfile(user, data) {
    try {
      return await this.rmqService.send(
        this.authClient,
        'authClient/update_profile',
        { user, data },
      );
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async changeAvatar(currentUser, file: Express.Multer.File) {
    try {
      return await this.rmqService.send(
        this.authClient,
        'authClient/change_avatar',
        { currentUser, file },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async validateEmail(currentUser, data) {
    try {
      return await this.rmqService.send(
        this.authClient,
        'authClient/validate_email',
        { currentUser, data },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getUserInfoByEmail(email: string) {
    try {
      return await this.rmqService.send(
        this.authClient,
        'authClient/getUserInfoByEmail',
        { email },
      );
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getUserInfoByPhone(phone: string) {
    try {
      return await this.rmqService.send(
        this.authClient,
        'authClient/getUserInfoByPhone',
        { phone },
      );
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
