import { Injectable } from "@nestjs/common";
import { LoginDto } from "./user/dto/login.dto";

@Injectable()
export class AuthenticationService {
  constructor() {}

  async localLogin(payload: any){
    console.log('localLogin', payload)
    return {message: 'localLogin successful', payload};
  }
}