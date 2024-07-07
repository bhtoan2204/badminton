import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { DeleteFileRequest, UploadFileRequest, Users } from '@app/common';
import { RpcException } from '@nestjs/microservices';
import { MailerService } from '@nestjs-modules/mailer';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    private readonly entityManager: EntityManager,
    private readonly storageService: StorageService,
    private readonly mailerService: MailerService,
  ) {}

  async createAccount(createAccountDto: any) {
    try {
      const { email, phone, password, firstname, lastname, genre, birthdate } =
        createAccountDto;

      const query = 'SELECT * FROM f_create_user($1, $2, $3, $4, $5, $6, $7)';
      const parameters = [
        email,
        phone,
        password,
        firstname,
        lastname,
        genre,
        birthdate,
      ];

      const data = await this.entityManager.query(query, parameters);

      return data;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.CONFLICT,
      });
    }
  }

  async getProfile(user: any) {
    try {
      const userProfile = await this.userRepository.findOne({
        where: { id_user: user.id_user },
      });
      return userProfile;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async check_phone(phone) {
    try {
      const query = 'SELECT * FROM check_phone_number_exists($1)';
      const parameters = [phone];
      const data = await this.entityManager.query(query, parameters);
      return data;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.CONFLICT,
      });
    }
  }

  async changePassword(user: any, passwordDto: any) {
    try {
      const { oldPassword, newPassword } = passwordDto;
      if (oldPassword === newPassword) {
        throw new RpcException({
          message: 'New password must be different from old password',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      const { password } = await this.userRepository.findOne({
        where: { id_user: user.id_user },
      });
      const comparePasswordQuery = 'SELECT * FROM compare_passwords($1,$2)';
      const comparePasswordParams = [oldPassword, password];
      const isMatch = await this.entityManager.query(
        comparePasswordQuery,
        comparePasswordParams,
      );

      if (!isMatch) {
        throw new RpcException({
          message: 'Old password is not correct',
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }
      const changePassQuery = 'SELECT * FROM f_change_password($1, $2)';
      const changeParameters = [user.id_user, newPassword];
      await this.entityManager.query(changePassQuery, changeParameters);
      return {
        message: 'Password has been changed',
        data: true,
      };
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      } else {
        throw new RpcException({
          message: error.message,
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }
    }
  }

  async forgotPassword(data: any) {
    const { email, phone } = data;
    try {
      if (!email) {
        const query = 'SELECT * FROM f_handle_forgot_password_by_phone($1)';
        const parameters = [phone];
        const result = await this.entityManager.query(query, parameters);
        const code = result[0].f_handle_forgot_password_by_phone;
        // TODO: send code to phone number
        return {
          message: 'OTP has been sent to your phone',
          data: code,
        };
      } else if (!phone) {
        const query = 'SELECT * FROM f_handle_forgot_password_by_email($1)';
        const parameters = [email];
        const result = await this.entityManager.query(query, parameters);
        const code = result[0].f_handle_forgot_password_by_email;
        const sendEmail = await this.mailerService.sendMail({
          to: email,
          from: '"Famfund" <famfund@famfund.com>',
          subject: `Your OTP for Famfund Account Reset password is ${code}`,
          template: 'forgotPassword',
          context: {
            otp: code,
          },
        });
        return {
          message: 'OTP has been sent to your email',
          data: sendEmail,
        };
      } else {
        throw new RpcException({
          message: 'Either email or phone must be provided, but not both.',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateProfile(user: any, data: any) {
    try {
      const { firstname, lastname, genre, birthdate } = data;
      if (user.firstname === firstname && user.lastname === lastname) {
        throw new RpcException({
          message: 'No changes detected',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
      const query = 'SELECT * FROM f_update_user_profile($1, $2, $3, $4, $5)';
      const parameters = [user.id_user, firstname, lastname, genre, birthdate];
      const result = await this.entityManager.query(query, parameters);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = result;
      return userWithoutPassword;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async changeAvatar(data: any) {
    try {
      const { currentUser, file } = data;
      const filename =
        'avatar_' +
        currentUser.id_user +
        '_' +
        Date.now() +
        '_' +
        file.originalname;
      const params: UploadFileRequest = {
        fileName: filename,
        file: new Uint8Array(file.buffer.data),
      };
      const uploadImageData = await this.storageService.uploadFile(params);
      const fileUrl = uploadImageData.fileUrl;
      if (currentUser.avatar) {
        const deleteParams: DeleteFileRequest = {
          fileName: currentUser.avatar.split('/').pop(),
        };
        await this.storageService.deleteFile(deleteParams);
      }
      const updatedUser = await this.userRepository.findOne({
        where: { id_user: currentUser.id_user },
      });
      updatedUser.avatar = fileUrl;

      await this.userRepository.save(updatedUser);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = updatedUser;

      return {
        message: 'Avatar has been changed',
        data: userWithoutPassword,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async validateEmail(dto: any) {
    try {
      const { currentUser, data } = dto;
      const { email, otp } = data;
      const query = 'SELECT * FROM f_validate_otp($1, $2, $3)';
      const parameters = [currentUser.id_user, otp, email];
      const result = await this.entityManager.query(query, parameters);
      if (!result[0].f_validate_otp) {
        throw new RpcException({
          message: 'OTP is not valid',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
      return {
        message: 'Email has been verified',
        data: result,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getUserInfoByEmail(email: string) {
    try {
      const [data, total] = await this.userRepository.findAndCount({
        where: { email: email },
      });
      if (total === 0) {
        throw new RpcException({
          message: 'User not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return {
        data: data,
        total: total,
        message: 'Get user info by email successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getUserInfoByPhone(phone: string) {
    try {
      const [data, total] = await this.userRepository.findAndCount({
        where: { phone: phone },
      });
      if (total === 0) {
        throw new RpcException({
          message: 'User not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return {
        data: data,
        total: total,
        message: 'Get user info by phone successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async sendUserConfirmation(dto) {
    const { userInfo, email } = dto;
    try {
      const generateOtpQuery = 'SELECT * FROM f_generate_otp($1, $2)';
      const generateOtpParams = [userInfo.id_user, email];
      const code = await this.entityManager.query(
        generateOtpQuery,
        generateOtpParams,
      );

      const sendConfirmation = await this.mailerService.sendMail({
        to: email,
        from: '"Famfund" <famfund@famfund.com>',
        subject: `Your OTP for Famfund Account Verification is ${code[0].f_generate_otp}`,
        template: 'verifyAccount',
        context: {
          name: userInfo.firstname + ' ' + userInfo.lastname,
          otp: code[0].f_generate_otp,
        },
      });

      return {
        message: 'OTP has been sent to your email',
        data: sendConfirmation,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async sendInvite(id_user, id_family) {
    try {
      const Query = 'select f_generate_link_invite($1)';
      const params = [id_family];
      const result = await this.entityManager.query(Query, params);
      const inviteLink = result[0].f_generate_link_invite;

      const emailContent = `
            Join Famfund!

            We are a community of warmth, support, and love. We are thrilled to welcome you to join our family!

            Please use the following link to join Famfund: ${inviteLink}
        `;
      return emailContent;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async checkOTP(data) {
    const { email, phone, code } = data;
    try {
      if (!email) {
        const query = 'SELECT * FROM f_check_otp_by_phone($1, $2)';
        const parameters = [phone, code];
        console.log('phone', phone);
        console.log('otp', code);
        const result = await this.entityManager.query(query, parameters);
        const isValid = result[0].f_check_otp_by_phone;
        return isValid
          ? { message: 'OTP is valid', data: isValid }
          : { message: 'OTP is not valid', data: isValid };
      } else if (!phone) {
        const query = 'SELECT * FROM f_check_otp_by_email($1, $2)';
        const parameters = [email, code];
        const result = await this.entityManager.query(query, parameters);
        const isValid = result[0].f_check_otp_by_email;
        return isValid
          ? { message: 'OTP is valid', data: isValid }
          : { message: 'OTP is not valid', data: isValid };
      } else {
        throw new RpcException({
          message: 'Either email or phone must be provided, but not both.',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async resetPassword(data) {
    const { email, phone, password, code } = data;
    try {
      if (!email) {
        const query = 'SELECT * FROM f_check_otp_by_phone($1, $2)';
        const parameters = [phone, code];
        const result = await this.entityManager.query(query, parameters);
        const isReset = result[0].f_check_otp_by_phone;
        console.log('isReset', isReset);
        if (isReset) {
          const resetQuery = 'SELECT * FROM f_reset_password_by_phone($1, $2)';
          const resetParams = [phone, password];
          await this.entityManager.query(resetQuery, resetParams);
          const deleteOtpQuery = 'SELECT * FROM f_delete_otp_by_phone($1)';
          const deleteOtpParams = [phone];
          await this.entityManager.query(deleteOtpQuery, deleteOtpParams);
          return {
            message: 'Password has been reset',
            data: true,
          };
        } else {
          throw new RpcException({
            message: 'Password has not been reset',
            statusCode: HttpStatus.BAD_REQUEST,
          });
        }
      } else if (!phone) {
        const query = 'SELECT * FROM f_check_otp_by_email($1, $2)';
        const parameters = [email, code];
        const result = await this.entityManager.query(query, parameters);
        const isReset = result[0].f_check_otp_by_email;
        if (isReset) {
          const resetQuery = 'SELECT * FROM f_reset_password_by_email($1, $2)';
          const resetParams = [email, password];
          const data = await this.entityManager.query(resetQuery, resetParams);
          console.log(data);
          const deleteOtpQuery = 'SELECT * FROM f_delete_otp_by_email($1)';
          const deleteOtpParams = [phone];
          await this.entityManager.query(deleteOtpQuery, deleteOtpParams);
          return {
            message: 'Password has been reset',
            data: true,
          };
        } else {
          throw new RpcException({
            message: 'Password has not been reset',
            statusCode: HttpStatus.BAD_REQUEST,
          });
        }
      } else {
        throw new RpcException({
          message: 'Either email or phone must be provided, but not both.',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
