import { HttpException, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ROLE_SERVICE } from "../utils/constant/services.constant";
import { lastValueFrom, timeout } from "rxjs";

@Injectable()

export class RoleService {
    constructor(
        @Inject(ROLE_SERVICE) private roleClient: ClientProxy
    ) { }


    async getallRole() {
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
            const response = this.roleClient.send('role/getrole', {family, user})
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