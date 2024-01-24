import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../utils/models/user.model";
import { Repository } from "typeorm";
import { Otp } from "../../utils/models/otp.model";
import { CreateAccountDto } from "./dto/createAccount.dto";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Otp) private otpRepository: Repository<Otp>,
    private readonly configService: ConfigService
  ) {}

  async sendOtp(){

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
  
  async getUserById(id: string) {

  }

  async createAccount(createAccountDto: CreateAccountDto) {
    const {email, phone, password, firstName, lastName} = createAccountDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = await this.userRepository.save({
      email,
      phone,
      password: hashedPassword,
      firstName,
      lastName
    });

    return data;
  }
}