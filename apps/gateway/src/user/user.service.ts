import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { lastValueFrom, timeout } from 'rxjs';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { CreateAccountDto } from './dto/createAccount.dto';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from '../utils';

@Injectable()
export class UserService {
  constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

  async createAccount(dto: CreateAccountDto) {
    try {
      const source = this.authClient
        .send('authClient/create_account', dto)
        .pipe(timeout(15000));
      const data = await lastValueFrom(source);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async checkPhone(phone: string) {
    try {
      const source = this.authClient
        .send('authClient/check_phone', { phone })
        .pipe(timeout(15000));
      const data = await lastValueFrom(source);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getProfile(currentUser) {
    try {
      const source = this.authClient
        .send('authClient/get_profile', currentUser)
        .pipe(timeout(15000));
      const data = await lastValueFrom(source);
      return data;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async changePassword(currentUser, data: ChangePasswordDto) {
    try {
      const source = this.authClient
        .send('authClient/change_password', { currentUser, data })
        .pipe(timeout(15000));
      const result = await lastValueFrom(source);
      return result;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async forgotPassword(data: any) {
    try {
      const source = this.authClient
        .send('authClient/forgot_password', data)
        .pipe(timeout(15000));
      const result = await lastValueFrom(source);
      return result;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async checkOTP(data: any) {
    try {
      const source = this.authClient
        .send('authClient/check_otp', data)
        .pipe(timeout(15000));
      const result = await lastValueFrom(source);
      return result;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async resetPassword(data: any) {
    try {
      const source = this.authClient
        .send('authClient/reset_password', data)
        .pipe(timeout(15000));
      const result = await lastValueFrom(source);
      return result;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateProfile(user, data) {
    try {
      const source = this.authClient
        .send('authClient/update_profile', { user, data })
        .pipe(timeout(15000));
      const result = await lastValueFrom(source);
      return result;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async changeAvatar(currentUser, file: Express.Multer.File) {
    try {
      const source = this.authClient
        .send('authClient/change_avatar', { currentUser, file })
        .pipe(timeout(10000));
      const result = await lastValueFrom(source);
      return result;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async validateEmail(currentUser, data) {
    try {
      const source = this.authClient
        .send('authClient/validate_email', { currentUser, data })
        .pipe(timeout(15000));
      const result = await lastValueFrom(source);
      return result;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}
