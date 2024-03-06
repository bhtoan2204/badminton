import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager } from "typeorm";
import { CreateAccountDto } from "./dto/createAccount.dto";
import { ConfigService } from "@nestjs/config";
import { DeleteFileRequest, LoginType, UploadFileRequest, Users } from "@app/common";
import { RpcException } from "@nestjs/microservices";
import { StorageService } from "../../storage/storage.service";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  storageService: any;
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager
  ) {}

  async validateLocalUser(email: string, inputPassword: string) {
    let user;
    try {
      user = await this.userRepository.findOne({ where: { email, login_type: LoginType.LOCAL } });
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
  
    //const isMatch = await bcrypt.compare(inputPassword, user.password);
    const Query = 'SELECT * FROM compare_passwords($1,$2)';
    const param = [inputPassword,  user.password];
    const isMatch= await this.entityManager.query(Query, param);


    if (!isMatch) {
      throw new RpcException({
        message: 'Credentials are not valid',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }
    
    // Thay đổi username và password trong DATABASE_URL
    const configService = new ConfigService();
    const dbUrl = configService.get('DATABASE_URL');
    const newUsername = user.id_user;
    const newPassword = inputPassword;
    const newDbUrl = dbUrl.replace(/\/\/([^:]+):([^@]+)@/, `//${newUsername}:${newPassword}@`);
    process.env.DATABASE_URL = newDbUrl;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async validateGoogleUser(accessToken: string, profile: any) {
    try {
      const user = await this.userRepository.findOne({where: 
        {
          email: profile.emails[0].value,
          login_type: LoginType.GOOGLE
        }
      });
      if (!user) {
        const query = 'SELECT * FROM f_create_user($1, $2, $3, $4, $5, $6, $7)';
        const parameters = [profile.emails[0].value, null, null, profile.name.givenName, profile.name.familyName, null, LoginType.GOOGLE];
        const data = await this.entityManager.query(query, parameters);

        return await this.userRepository.findOne({where: 
          {
            id_user: data[0].id_user,
            login_type: LoginType.GOOGLE
          }
        });
      }
      else {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: 404
      });
    }
  }
  
  async validateUserId(id_user: string){
    const user = await this.userRepository.findOne({where: { id_user }});
    if (!user) {
      throw new RpcException({
        message: 'User not found',
        statusCode: 404
      });
    };
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async createAccount(createAccountDto: CreateAccountDto) {
    try {
      const { email, phone, password, firstname, lastname } = createAccountDto;

      const query = 'SELECT * FROM f_create_user($1, $2, $3, $4, $5, $6)';
      const parameters = [email, phone, password, firstname, lastname, null];

      const data = await this.entityManager.query(query, parameters);
      
      return data;
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.CONFLICT
      });
    }
  }

  async changePassword(user: any, passwordDto: any) {
    try {
      const { oldPassword, newPassword } = passwordDto;
      if (oldPassword === newPassword) {
        throw new RpcException({
          message: 'New password must be different from old password',
          statusCode: HttpStatus.BAD_REQUEST
        });
      }

      const { password } = await this.userRepository.findOne({where: { id_user: user.id_user }});
      const Query = 'SELECT * FROM compare_passwords($1,$2)';
      const param = [oldPassword,  password];
      const isMatch= await this.entityManager.query(Query, param);

      if (!isMatch) {
        throw new RpcException({
          message: 'Old password is not correct',
          statusCode: HttpStatus.UNAUTHORIZED
        });
      }
      //const hashedPassword = await bcrypt.hash(newPassword, 10);
      const query = 'SELECT * FROM f_change_password($1, $2)';
      const parameters = [user.id_user, newPassword];
      const data = await this.entityManager.query(query, parameters);
      return data;
    }
    catch (error) {
      console.log(error);
      if (error instanceof RpcException) {
        throw error;
      }
      else {
        throw new RpcException({
          message: error.message,
          statusCode: HttpStatus.UNAUTHORIZED
        });
      }
    }
  }
  async updateProfile(user: any, data: any) {
    try {
      const { firstname, lastname } = data;
      if (user.firstname === firstname && user.lastname === lastname) {
        throw new RpcException({
          message: 'No changes detected',
          statusCode: HttpStatus.BAD_REQUEST
        });
      }
      let query, parameters;
      if (firstname && !lastname) {
        query = 'SELECT * FROM f_change_firstname($1, $2)';
        parameters = [user.id_user, firstname];
      }
      else if (!firstname && lastname) {
        query = 'SELECT * FROM f_change_lastname($1, $2)';
        parameters = [user.id_user, lastname];
      }
      else {
        query = 'SELECT * FROM f_change_firstname_lastname($1, $2, $3)';
        parameters = [user.id_user, firstname, lastname];
      }
      const result = await this.entityManager.query(query, parameters);
      return result;
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }
  async changeAvatar(data: any) {
    try {
      const { currentUser, file } = data;
      const filename = 'avatar_' + currentUser.id_user + '_' + Date.now() + '_' + file.originalname;
      const params: UploadFileRequest = {
        fileName: filename,
        file: new Uint8Array(file.buffer.data)
      }
      const uploadImageData = await this.storageService.uploadFile(params);
      const fileUrl = uploadImageData.fileUrl;
      if (currentUser.avatar) {
        const deleteParams: DeleteFileRequest = {
          fileName: (currentUser.avatar).split('/').pop()
        }
        await this.storageService.deleteFile(deleteParams);
      }
      const query = 'SELECT * FROM f_update_user_avatar($1, $2)';
      const parameters = [currentUser.id_user, fileUrl];
      const result = await this.entityManager.query(query, parameters);
      return {
        message: file.size + ' bytes uploaded successfully',
        data: uploadImageData,
        result: result
      };
    }
    catch (error) {
      console.log(error.message);
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
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
          statusCode: HttpStatus.BAD_REQUEST
        });
      }
      return {
        message: 'Email has been verified',
        data: result
      };
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

}