import { HttpException, Inject, Injectable } from "@nestjs/common";
import { AUTH_SERVICE } from "apps/gateway/src/utils/constant/services.constant";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";

@Injectable()
export class AuthApiService {
    constructor(
        @Inject(AUTH_SERVICE) private authClient: ClientProxy
    ) { }

    async localLogin(currentUser) {
        try {
            const source = this.authClient.send('authClient/local/login', currentUser).pipe(
                timeout(5000)
            );
            const data = await lastValueFrom(source);
            return data;
        }
        catch (error) {
            throw new HttpException(error, error.statusCode);
        }
    }

    async refreshToken(currentUser, refreshToken) {
        try {
            const source = this.authClient.send('authClient/refresh_token', { currentUser, refreshToken }).pipe(
                timeout(5000)
            );
            const data = await lastValueFrom(source);
            return data;
        }
        catch (error) {
            throw new HttpException(error, error.statusCode);
        }
    }

    async logout(refreshToken) {
        try {
            const source = this.authClient.send('authClient/logout', refreshToken).pipe(
                timeout(5000)
            );
            const data = await lastValueFrom(source);
            return data;
        }
        catch (error) {
            throw new HttpException(error, error.statusCode);
        }
    }
}