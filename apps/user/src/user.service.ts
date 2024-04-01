import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager } from "typeorm";
import { CreateAccountDto } from "./dto/createAccount.dto";
import { DeleteFileRequest, UploadFileRequest, Users } from "@app/common";
import { RpcException } from "@nestjs/microservices";
import { StorageService } from "./storage/storage.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    private readonly entityManager: EntityManager,
    private readonly storageService: StorageService
  ) {}

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
      const query = 'SELECT * FROM f_change_password($1, $2)';
      const parameters = [user.id_user, newPassword];
      const data = await this.entityManager.query(query, parameters);
      return data;
    }
    catch (error) {
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