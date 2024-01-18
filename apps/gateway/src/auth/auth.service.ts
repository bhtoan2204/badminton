import { Inject, Injectable } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { AUTH_SERVICE } from "apps/gateway/constant/services.constant";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Injectable()
export class AuthApiService {
    constructor(
        @Inject(AUTH_SERVICE) private authClient: ClientProxy
    ) { }

    async localLogin(loginDto: LoginDto) {
        const source = this.authClient.send('local_login', loginDto);
        const data = await lastValueFrom(source);
        return data;
    }
}