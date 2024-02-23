import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAccountDto } from "./dto/createAccount.dto";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcryptjs';
import { LoginType, OTP, Users } from "@app/common";
import { EntityManager } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(OTP) private otpRepository: Repository<OTP>,
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager
  ) {}

  async validateLocalUser(email: string, password: string){
    try {
      const user = await this.userRepository.findOne({where: {email}});
      if(!user) {
        throw new UnauthorizedException('User not found');
      };
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch) {
        throw new UnauthorizedException('Credentials are not valid.');
      };
      return user;
    }
    catch (error) {
      throw error;
    }
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
        const newUser = await this.userRepository.save({
          email: profile.emails[0].value,
          firstname: profile.name.givenName,
          lastname: profile.name.familyName,
          login_type: LoginType.GOOGLE,
          role: 'user'
        });
        return newUser;
      }
      else {
        return user;
      }
    }
    catch (error) {
      throw error;
    }
  }
  
  async validateUserId(id_user: string){
    const user = await this.userRepository.findOne({where: { id_user }});
    if(!user) {
      throw new UnauthorizedException('User not found');
    };
    return user;
  }

  async createAccount(createAccountDto: CreateAccountDto) {
    try {
      const { email, phone, password, firstName, lastName } = createAccountDto;
      const hashedPassword = await bcrypt.hash(password, 10);

      const query = 'SELECT * FROM f_create_user($1, $2, $3, $4, $5, $6)';
      const parameters = [email, phone, hashedPassword, firstName, lastName, 'null'];

      const data = await this.entityManager.query(query, parameters)
        .catch(err => {
          console.log(err);
          throw err.driverError;
        });
      return data;
    }
    catch (error) {
      throw error;
    }
  }
}