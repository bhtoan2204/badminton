import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAccountDto } from "./dto/createAccount.dto";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcrypt';
import { LoginType, OTP, Users } from "@app/common";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(OTP) private otpRepository: Repository<OTP>,
    private readonly configService: ConfigService
  ) {}

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
  
  async validateUserId(id_user: string){
    const user = await this.userRepository.findOne({where: { id_user }});
    if(!user) {
      throw new UnauthorizedException('User not found');
    };
    return user;
  }

  async createAccount(createAccountDto: CreateAccountDto) {
    const { email, phone, password, firstName, lastName } = createAccountDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = await this.userRepository.save({
      email,
      phone,
      password: hashedPassword,
      firstname: firstName,
      lastname: lastName,
      loginType: LoginType.LOCAL,
    });

    return data;
  }
}