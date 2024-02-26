import { BadRequestException, Inject, Injectable } from "@nestjs/common";
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
        try {
            const source = this.authClient.send('authClient/local/login', currentUser).pipe(
                timeout(5000),
                catchError(err => {
                    throw err;
                })
            );
            const data = await lastValueFrom(source);
            return data;
        }
        catch (error) {
            throw new Error(error);
        }
    }

    async googleLogin(currentUser) {
        try {
            const source = this.authClient.send('authClient/local/login', currentUser).pipe(
                timeout(5000),
                catchError(err => {
                    throw err;
                })
            );
            const data = await lastValueFrom(source);
            return data;
        }
        catch (error) {
            throw new Error(error);
        }
    }

    async refreshToken(currentUser) {
        try {
            const source = this.authClient.send('authClient/refresh_token', currentUser).pipe(
                timeout(5000),
                catchError(err => {
                    throw err;
                })
            );
            const data = await lastValueFrom(source);
            return data;
        }
        catch (error) {
            throw new Error(error);
        }
    }
}

@Injectable()
export class UserService {
    constructor(
        @Inject(AUTH_SERVICE) private authClient: ClientProxy
    ) { }

    async createAccount(createAccountDto: CreateAccountDto) {
        try {
            const source = this.authClient.send('authClient/create_account', { createAccountDto }).pipe(
                timeout(5000),
                catchError(err => {
                    throw err;
                })
            );;
            const data = await lastValueFrom(source);
            return data;
        }
        catch (error) {
            throw error;
        }
    }
}