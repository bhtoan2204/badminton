import {HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager } from "typeorm";
import { CreateAccountDto } from "./dto/createAccount.dto";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcryptjs';
import { LoginType, Users } from "@app/common";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager
  ) {}

  async validateLocalUser(email: string, password: string) {
    let user;
    try {
      user = await this.userRepository.findOne({ where: { email } });
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
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new RpcException({
        message: 'Credentials are not valid',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }
  
    return user;
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
        return user;
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
    return user;
  }

  async createAccount(createAccountDto: CreateAccountDto) {
    try {
      const { email, phone, password, firstname, lastname } = createAccountDto;
      const hashedPassword = await bcrypt.hash(password, 10);

      const query = 'SELECT * FROM f_create_user($1, $2, $3, $4, $5, $6)';
      const parameters = [email, phone, hashedPassword, firstname, lastname, null];

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
}