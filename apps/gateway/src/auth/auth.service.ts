import { Inject, Injectable } from "@nestjs/common";
import { AUTH_SERVICE } from "apps/gateway/constant/services.constant";
import { ClientProxy } from "@nestjs/microservices";
import { catchError, lastValueFrom, timeout } from "rxjs";
import { CreateAccountDto } from "./dto/createAccount.dto";

@Injectable()
export class AuthApiService {
    constructor(
        @Inject(AUTH_SERVICE) private authClient: ClientProxy
    ) { }

    async localLogin(currentUser) {
        const source = this.authClient.send('authClient/local/login', currentUser).pipe(
            timeout(5000),
            catchError(err => {
                throw new Error(`Failed to login: ${err.message}`);
            })
        );
        const data = await lastValueFrom(source);
        return data;
    }

    async googleLogin(currentUser) {
        const source = this.authClient.send('authClient/local/login', currentUser).pipe(
            timeout(5000),
            catchError(err => {
                throw new Error(`Failed to login: ${err.message}`);
            })
        );
        const data = await lastValueFrom(source);
        return data;
    }

    async refreshToken(currentUser) {
        const source = this.authClient.send('authClient/refresh_token', currentUser).pipe(
            timeout(5000),
            catchError(err => {
                throw new Error(`Failed to refresh token: ${err.message}`);
            })
        );
        const data = await lastValueFrom(source);
        return data;
    }
}

@Injectable()
export class UserService {
    constructor(
        @Inject(AUTH_SERVICE) private authClient: ClientProxy
    ) { }

    async sendRegisterSms() {
        const source = this.authClient.send('authClient/send_register_sms', {}).pipe(
            timeout(5000),
            catchError(err => {
                throw new Error(`Failed to send Sms: ${err.message}`);
            })
        );;
        const data = await lastValueFrom(source);
        return data;
    }

    async createAccount(createAccountDto: CreateAccountDto) {
        const source = this.authClient.send('authClient/create_account', { createAccountDto }).pipe(
            timeout(5000),
            catchError(err => {
                throw new Error(`Failed to create Account: ${err.message}`);
            })
        );;
        const data = await lastValueFrom(source);
        return data;
    }

    async getProfile(id: string) {
        const source = this.authClient.send('authClient/get_profile', { id }).pipe(
            timeout(5000),
            catchError(err => {
                throw new Error(`Failed to get profile: ${err.message}`);
            })
        );
        const data = await lastValueFrom(source);
        return data;
    }
}