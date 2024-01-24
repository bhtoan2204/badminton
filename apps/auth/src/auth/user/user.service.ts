import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../utils/models/user.model";
import { Repository } from "typeorm";
import { Otp } from "../../utils/models/otp.model";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Otp) private otpRepository: Repository<Otp>,
  ) {}

  async sendOtp(){

  }

  async validateLocalUser(username: string, password: string){

  }
  
  async getUserById(id: string) {}
}