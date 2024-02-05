import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../utils/models/user.model";
import { Repository } from "typeorm";
import { Otp } from "../../utils/models/otp.model";
import { CreateAccountDto } from "./dto/createAccount.dto";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcrypt';
import { LoginType } from "../../utils/enums/loginType.enum";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Otp) private otpRepository: Repository<Otp>,
    private readonly configService: ConfigService
  ) {}

  async sendOtp() {

  }

  async validateLocalUser(email: string, password: string){
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

  async validateGoogleUser(accessToken: string, profile: any) {
    const user = await this.userRepository.findOne({where: 
      {
        email: profile.emails[0].value,
        loginType: LoginType.GOOGLE
      }
    });
    if (!user) {
      const newUser = await this.userRepository.save({
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        loginType: LoginType.GOOGLE,
        role: 'user'
      });
      return newUser;
    }
    else {
      return user;
    }
  }
  
  async validateUserId(id: string){
    const user = await this.userRepository.findOne({where: {id}});
    if(!user) {
      throw new UnauthorizedException('User not found');
    };
    return user;
  }

  async getProfile(id: string) {
    const user = await this.userRepository.findOne({where: {id}});
    if(!user) {
      throw new UnauthorizedException('User not found');
    };
    return user;
  }

  async createAccount(createAccountDto: CreateAccountDto) {
    const {email, phone, password, firstName, lastName} = createAccountDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = await this.userRepository.save({
      email,
      phone,
      password: hashedPassword,
      firstName,
      lastName,
      loginType: LoginType.LOCAL,
    });

    return data;
  }
}