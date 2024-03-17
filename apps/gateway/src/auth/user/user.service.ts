import { ConflictException, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { lastValueFrom, timeout } from "rxjs";
import { ChangePasswordDto } from "../dto/changePassword.dto";
import { CreateAccountDto } from "../dto/createAccount.dto";
import { ClientProxy } from "@nestjs/microservices";
import { AUTH_SERVICE } from "../../utils/constant/services.constant";

@Injectable()
export class UserService {
    constructor(
        @Inject(AUTH_SERVICE) private authClient: ClientProxy
    ) { }

    async createAccount(createAccountDto: CreateAccountDto) {
        try {
            const source = this.authClient.send('authClient/create_account', { createAccountDto }).pipe(
                timeout(5000),
            );
            const data = await lastValueFrom(source);
            return data;
        }
        catch (error) {
            throw new HttpException(error, error.statusCode);
        }
    }

    async changePassword(currentUser, data: ChangePasswordDto) {
        try {
            const source = this.authClient.send('authClient/change_password', { currentUser, data }).pipe(
                timeout(5000),
            );
            const result = await lastValueFrom(source);
            return result;
        }
        catch (error) {
            throw new HttpException(error, error.statusCode);
        }
    }

    async updateProfile(user, data) {
        try {
            const { firstname, lastname } = data;
            if ((firstname && user.firstname === firstname) 
            || (lastname && user.lastname === lastname)
            || (!firstname && !lastname)) {
                throw new ConflictException({
                    message: 'No changes detected',
                    statusCode: HttpStatus.BAD_REQUEST
                });
            }
            const source = this.authClient.send('authClient/update_profile', { user , data }).pipe(
                timeout(5000),
            );
            const result = await lastValueFrom(source);
            return result;
        }
        catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new HttpException(error, error.statusCode);
        }
    }

    async changeAvatar(currentUser, file: Express.Multer.File) {
        try {
            const source = this.authClient.send('authClient/change_avatar', { currentUser, file } ).pipe(
                timeout(5000),
            );
            const result = await lastValueFrom(source);
            return result;
        }
        catch (error) {
            throw new HttpException(error, error.statusCode);
        }
    }

    async validateEmail(currentUser, data) {
        try {
            const source = this.authClient.send('authClient/validate_email', { currentUser, data }).pipe(
                timeout(5000),
            );
            const result = await lastValueFrom(source);
            return result;
        }
        catch (error) {
            throw new HttpException(error, error.statusCode);
        }
    }
}