import { ConflictException, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { lastValueFrom, timeout } from "rxjs";
import { ChangePasswordDto } from "./dto/changePassword.dto";
import { CreateAccountDto } from "./dto/createAccount.dto";
import { ClientProxy } from "@nestjs/microservices";
import { USER_SERVICE } from "../utils";
import { logger } from "@app/common";

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
            return await lastValueFrom(source);
        }
        catch (error) {
            logger.error(error);
            throw new HttpException(error, error.statusCode);
        }
    }

    async changePassword(currentUser, data: ChangePasswordDto) {
        try {
            const source = this.userClient.send('userClient/change_password', { currentUser, data }).pipe(
                timeout(5000),
            );
            return await lastValueFrom(source);
        }
        catch (error) {
            logger.error(error);
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
            return await lastValueFrom(source);
        }
        catch (error) {
            logger.error(error);
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new HttpException(error, error.statusCode);
        }
    }

    async changeAvatar(currentUser, file: Express.Multer.File) {
        try {
            const source = this.userClient.send('userClient/change_avatar', { currentUser, file }).pipe(
                timeout(10000),
            );
            return await lastValueFrom(source);
        }
        catch (error) {
            logger.error(error);
            throw new HttpException(error, error.statusCode);
        }
    }

    async validateEmail(currentUser, data) {
        try {
            const source = this.userClient.send('userClient/validate_email', { currentUser, data }).pipe(
                timeout(5000),
            );
            return await lastValueFrom(source);
        }
        catch (error) {
            logger.error(error);
            throw new HttpException(error, error.statusCode);
        }
    }
}