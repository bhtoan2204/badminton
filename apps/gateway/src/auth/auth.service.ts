import { Inject, Injectable } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { AUTH_SERVICE } from "apps/gateway/constant/services.constant";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { CreateAccountDto } from "./dto/createAccount.dto";

@Injectable()
export class AuthApiService {
    constructor(
        @Inject(AUTH_SERVICE) private authClient: ClientProxy
    ) { }

    async localLogin(currentUser) {
        const source = this.authClient.send('authClient/local/login', currentUser);
        const data = await lastValueFrom(source);
        return data;
    }
}

@Injectable()
export class UserService {
    constructor(
        @Inject(AUTH_SERVICE) private authClient: ClientProxy
    ) { }

    async sendRegisterSms(){
        const source = this.authClient.send('authClient/send_register_sms', {});
        const data = await lastValueFrom(source);
        return data;
    }

    async createAccount(createAccountDto: CreateAccountDto){
        const source = this.authClient.send('authClient/create_account', {createAccountDto});
        const data = await lastValueFrom(source);
        return data;
    }

    async getProfile(id: string){
        const source = this.authClient.send('authClient/get_profile', {id});
        const data = await lastValueFrom(source);
        return data;
    }
}