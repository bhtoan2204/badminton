import { ConflictException, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { lastValueFrom, timeout } from "rxjs";
import { ChangePasswordDto } from "./dto/changePassword.dto";
import { CreateAccountDto } from "./dto/createAccount.dto";
import { ClientProxy } from "@nestjs/microservices";
import { USER_SERVICE } from "../utils";

@Injectable()
export class UserService {
    constructor(
        @Inject(USER_SERVICE) private userClient: ClientProxy
    ) { }

    async createAccount(createAccountDto: CreateAccountDto) {
        try {
            const source = this.userClient.send('userClient/create_account', { createAccountDto }).pipe(
                timeout(5000),
            );
            const data = await lastValueFrom(source);
            return data;
        }
        catch (error) {
            if (error.name === 'TimeoutError') {
                throw new HttpException('Timeout', 408);
            }
            throw new HttpException(error, error.statusCode);
        }
    }

    async checkPhone(phone: string) {
        try {
            const source = this.userClient.send('userClient/check_phone', { phone }).pipe(
                timeout(5000),
            );
            const data = await lastValueFrom(source);
            return data;
        }
        catch (error) {
            if (error.name === 'TimeoutError') {
                throw new HttpException('Timeout', 408);
            }
            throw new HttpException(error, error.statusCode);
        }
    }

    async changePassword(currentUser, data: ChangePasswordDto) {
        try {
            const source = this.userClient.send('userClient/change_password', { currentUser, data }).pipe(
                timeout(5000),
            );
            const result = await lastValueFrom(source);
            return result;
        }
        catch (error) {
            if (error.name === 'TimeoutError') {
                throw new HttpException('Timeout', 408);
            }
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
            const source = this.userClient.send('userClient/update_profile', { user, data }).pipe(
                timeout(5000),
            );
            const result = await lastValueFrom(source);
            return result;
        }
        catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            if (error.name === 'TimeoutError') {
                throw new HttpException('Timeout', 408);
            }
            throw new HttpException(error, error.statusCode);
        }
    }

    async changeAvatar(currentUser, file: Express.Multer.File) {
        try {
            const source = this.userClient.send('userClient/change_avatar', { currentUser, file }).pipe(
                timeout(10000),
            );
            const result = await lastValueFrom(source);
            return result;
        }
        catch (error) {
            if (error.name === 'TimeoutError') {
                throw new HttpException('Timeout', 408);
            }
            throw new HttpException(error, error.statusCode);
        }
    }

    async validateEmail(currentUser, data) {
        try {
            const source = this.userClient.send('userClient/validate_email', { currentUser, data }).pipe(
                timeout(5000),
            );
            const result = await lastValueFrom(source);
            return result;
        }
        catch (error) {
            if (error.name === 'TimeoutError') {
                throw new HttpException('Timeout', 408);
            }
            throw new HttpException(error, error.statusCode);
        }
    }
}