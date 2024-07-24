import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DeleteFileRequest,
  LoginType,
  OTP,
  OTPType,
  UploadFileRequest,
  Users,
} from '@app/common';
import { RpcException } from '@nestjs/microservices';
import { MailerService } from '@nestjs-modules/mailer';
import { StorageService } from '../storage/storage.service';
import { FamilyInvitation } from '@app/common/database/entity/family_invitation.entity';
import { TwilioService } from 'nestjs-twilio';
import { ConfigService } from '@nestjs/config';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { comparePassword, generateSalt, hashPassword } from '../utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(OTP) private otpRepository: Repository<OTP>,
    @InjectRepository(FamilyInvitation)
    private familyInvitationRepository: Repository<FamilyInvitation>,
    private readonly storageService: StorageService,
    private readonly mailerService: MailerService,
    private readonly twilioService: TwilioService,
    private readonly configService: ConfigService,
  ) {}

  async createAccount(createAccountDto: {
    email: string;
    phone: string;
    password: string;
    firstname: string;
    lastname: string;
    genre: string;
    birthdate: string;
    login_type: LoginType;
    avatar?: string;
  }) {
    try {
      const salt = generateSalt();
      const hashedPassword = hashPassword(createAccountDto.password, salt);
      const user = await this.userRepository.create({
        email: createAccountDto.email,
        phone: createAccountDto.phone,
        password: hashedPassword,
        firstname: createAccountDto.firstname,
        lastname: createAccountDto.lastname,
        genre: createAccountDto.genre,
        birthdate: createAccountDto.birthdate,
        login_type: createAccountDto.login_type,
        avatar: createAccountDto.avatar,
        salt: salt,
      });
      await this.userRepository.save(user);
      return {
        message: 'User has been created',
        data: user.id_user,
      };
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

  async check_phone(phone: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { phone: phone },
      });
      return user ? true : false;
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

      const foundUser = await this.userRepository.findOne({
        where: { id_user: user.id_user },
        select: ['id_user', 'password'],
      });

      if (!foundUser) {
        throw new RpcException({
          message: 'User not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      const isMatch = await comparePassword(
        oldPassword,
        foundUser.password,
        foundUser.salt,
      );
      if (!isMatch) {
        throw new RpcException({
          message: 'Old password is not correct',
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }
      const hashedPassword = await hashPassword(newPassword, foundUser.salt);
      foundUser.password = hashedPassword;
      await this.userRepository.save(foundUser);

      return {
        message: 'Password has been changed',
        data: true,
      };
    } catch (error) {
      console.log(error);
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async forgotPassword(data: any) {
    const { email, phone } = data;
    try {
      if (!email) {
        const user = await this.userRepository.findOne({
          where: { phone },
        });
        if (!user) {
          throw new RpcException({
            message: 'User not found',
            statusCode: HttpStatus.NOT_FOUND,
          });
        }
        const phoneNumber = parsePhoneNumberFromString(phone);
        const formattedNumber = phoneNumber.formatInternational();
        if (!formattedNumber) {
          throw new RpcException({
            message: 'Invalid phone number',
            statusCode: HttpStatus.BAD_REQUEST,
          });
        }
        const otp = await this.otpRepository.create({
          id_user: user.id_user,
          code: Math.floor(100000 + Math.random() * 900000).toString(),
          phone,
        });
        await this.otpRepository.save(otp);
        this.twilioService.client.messages.create({
          body: `Your OTP for Famfund Account Reset password is ${otp.code}`,
          from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
          to: formattedNumber,
        });
        return {
          message: 'OTP has been sent to your phone',
          data: otp.code,
        };
      } else if (!phone) {
        const user = await this.userRepository.findOne({
          where: { email },
        });
        if (!user) {
          throw new RpcException({
            message: 'User not found',
            statusCode: HttpStatus.NOT_FOUND,
          });
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const newOtp = await this.otpRepository.create({
          id_user: user.id_user,
          code,
          email,
          phone: null,
          type: OTPType.RESET_PASSWORD,
        });
        await this.otpRepository.save(newOtp);
        this.mailerService.sendMail({
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

  async updateProfile(inputUser: any, data: any) {
    try {
      const { firstname, lastname, genre, birthdate } = data;
      const user = await this.userRepository.findOne({
        where: { id_user: inputUser.id_user },
      });
      if (!user) {
        throw new RpcException({
          message: 'User not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      user.firstname = firstname;
      user.lastname = lastname;
      user.genre = genre;
      user.birthdate = birthdate;
      return await this.userRepository.save(user);
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

      return {
        message: 'Email has been verified',
        // data: result,
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
      // const generateOtpQuery = 'SELECT * FROM f_generate_otp($1, $2)';
      // const generateOtpParams = [userInfo.id_user, email];
      // const code = await this.entityManager.query(
      //   generateOtpQuery,
      //   generateOtpParams,
      // );

      // const sendConfirmation = await this.mailerService.sendMail({
      //   to: email,
      //   from: '"Famfund" <famfund@famfund.com>',
      //   subject: `Your OTP for Famfund Account Verification is ${code[0].f_generate_otp}`,
      //   template: 'verifyAccount',
      //   context: {
      //     name: userInfo.firstname + ' ' + userInfo.lastname,
      //     otp: code[0].f_generate_otp,
      //   },
      // });

      return {
        message: 'OTP has been sent to your email',
        // data: sendConfirmation,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async sendInvite(id_user: string, id_family: number) {
    try {
      const emailContent = `
            Join Famfund!

            We are a community of warmth, support, and love. We are thrilled to welcome you to join our family!

            Please use the following link to join Famfund: ${'inviteLink'}
        `;
      return emailContent;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async checkOTP(data: { email: string; phone: string; code: string }) {
    try {
      const otp = await this.otpRepository.findOne({
        where: [
          { email: data.email, code: data.code },
          { phone: data.phone, code: data.code },
        ],
      });
      if (!otp) {
        throw new RpcException({
          message: 'OTP is not valid',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
      return {
        message: 'OTP is valid',
        data: true,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async resetPassword(data: any) {
    const { email, phone, password, code } = data;
    try {
      const otp = await this.otpRepository.findOne({
        where: [
          { email, code },
          { phone, code },
        ],
      });
      if (!otp) {
        throw new RpcException({
          message: 'OTP is not valid',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
      const user = await this.userRepository.findOne({
        where: [
          { email, login_type: LoginType.LOCAL },
          { phone, login_type: LoginType.LOCAL },
        ],
      });
      if (!user) {
        throw new RpcException({
          message: 'User not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      const hashedPassword = await hashPassword(password, user.salt);
      user.password = hashedPassword;
      await Promise.all([
        this.userRepository.save(user),
        this.otpRepository.remove(otp),
      ]);
      return {
        message: 'Password has been reset',
        data: true,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
