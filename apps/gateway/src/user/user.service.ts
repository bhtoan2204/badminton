import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { lastValueFrom, timeout } from 'rxjs';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { CreateAccountDto } from './dto/createAccount.dto';
import { ClientProxy } from '@nestjs/microservices';
import { USER_SERVICE } from '../utils';

@Injectable()
export class UserService {
  constructor(@Inject(USER_SERVICE) private userClient: ClientProxy) {}

  async createAccount(dto: CreateAccountDto) {
    try {
      const source = this.userClient
        .send('userClient/create_account', dto)
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
      const source = this.userClient
        .send('userClient/check_phone', { phone })
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

  async changePassword(currentUser, data: ChangePasswordDto) {
    try {
      const source = this.userClient
        .send('userClient/change_password', { currentUser, data })
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
      const source = this.userClient
        .send('userClient/forgot_password', data)
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
      const source = this.userClient
        .send('userClient/check_otp', data)
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
      const source = this.userClient
        .send('userClient/reset_password', data)
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
      const source = this.userClient
        .send('userClient/update_profile', { user, data })
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
      const source = this.userClient
        .send('userClient/change_avatar', { currentUser, file })
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
      const source = this.userClient
        .send('userClient/validate_email', { currentUser, data })
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

  async getAllUser() {
    try {
      const source = this.userClient
        .send('userClient/get_all_user', {})
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
