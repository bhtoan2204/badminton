import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { catchError, lastValueFrom, timeout } from "rxjs";
import { CreateFamilyDto } from "./dto/createFamilyDto.dto";
import { MemberFamilyDto } from "./dto/memberFamilyDto.dto";
import { FAMILY_SERVICE } from "../utils/constant/services.constant";



@Injectable()

export class FamilyService {
    constructor(
        @Inject(FAMILY_SERVICE) private familyClient: ClientProxy
    ) { }

    async getFamily(CurrentUser) {
        try {
            const response = this.familyClient.send('family/get_Family', { CurrentUser })
                .pipe(
                    timeout(5000),
                );
            const data = await lastValueFrom(response);
            return data;
        } catch (err) {
            throw err;
        }
    }

    async addMember(CurrentUser, MemberFamilyDto: MemberFamilyDto) {
        try {
            const response = this.familyClient.send('family/add_Member', { CurrentUser, MemberFamilyDto })
                .pipe(
                    timeout(5000),
                );
            const data = await lastValueFrom(response);
            return data;
        } catch (err) {
            throw err;
        }
    }

    async createFamily(CurrentUser, CreateFamilyDto: CreateFamilyDto) {
        const source = this.familyClient.send('family/create_Family', { CurrentUser, CreateFamilyDto }).pipe(
            timeout(5000),
            catchError(err => {
                throw new Error(`Failed to create family: ${err.message}`);
            })
        );;
        const data = await lastValueFrom(source);
        return data;
    }

    async updateFamily(CurrentUser, CreateFamilyDto: CreateFamilyDto) {
        const source = this.familyClient.send('family/update_Family', { CurrentUser, CreateFamilyDto }).pipe(
            timeout(5000),
            catchError(err => {
                throw new Error(`Failed to update family: ${err.message}`);
            })
        );;
        const data = await lastValueFrom(source);
        return data;
    }

    async deleteFamily(CurrentUser) {
        const source = this.familyClient.send('family/delete_Family', { CurrentUser }).pipe(
            timeout(5000),
            catchError(err => {
                throw new Error(`Failed to delete family: ${err.message}`);
            })
        );;
        const data = await lastValueFrom(source);
        return data;
    }

}