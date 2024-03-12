import { HttpException, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";
import { ROLE_SERVICE } from "../../utils/constant/services.constant";

@Injectable()

export class RoleService {
    constructor(
        @Inject(ROLE_SERVICE) private roleClient: ClientProxy
    ) { }

    async getAllRole() {
        try {
            const response = this.roleClient.send('role/getallrole', {})
                .pipe(
                    timeout(5000),
                );
            const data = await lastValueFrom(response);
            return data;
        } catch (error) {
            throw new HttpException(error, error.statusCode);
        }
    }

    async getRole(family, user) {
        try {
            const response = this.roleClient.send('role/getrole', { family, user })
                .pipe(
                    timeout(5000),
                );
            const data = await lastValueFrom(response);
            return data;
        } catch (error) {
            throw new HttpException(error, error.statusCode);
        }
    }
}