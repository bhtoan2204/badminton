import {HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository, TypeOrmModule } from "@nestjs/typeorm";
import { Repository, EntityManager } from "typeorm";
import { CreateAccountDto } from "./dto/createAccount.dto";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcryptjs';
import { LoginType, Users } from "@app/common";
import { RpcException } from "@nestjs/microservices";
import { parse } from "pg-connection-string";

@Injectable()
export class UserService {
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
}