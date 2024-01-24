import { Injectable } from "@nestjs/common";
import { LoginDto } from "./user/dto/login.dto";

@Injectable()
export class AuthenticationService {
  constructor() {}

  async localLogin(payload: LoginDto){

  }
}