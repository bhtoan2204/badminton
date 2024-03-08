import { HttpException, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { FAMILY_SERVICE } from "../utils/constant/services.constant";
import { catchError, lastValueFrom, timeout } from "rxjs";
import { CreateFamilyDto } from "./dto/createFamily.dto";
import { MemberFamilyDto } from "./dto/memberFamily.dto";
import { DeleteMemberDTO } from "./dto/deleteFamily.dto";
import { UpdateFamilyDTO } from "./dto/updateFamily.dto";

@Injectable()

export class FamilyService {
    constructor(
        @Inject(FAMILY_SERVICE) private familyClient: ClientProxy
    ) { }
    
    async getFamily(CurrentUser, id_family) {
        try {
            const response = this.familyClient.send('family/get_Family', { CurrentUser, id_family })
                .pipe(
                    timeout(5000),
                );
            const data = await lastValueFrom(response);
            return data;
        } catch (error) {
            throw new HttpException(error, error.statusCode);
        }
    }

    async getMember(CurrentUser, id_user) {
        try {
            const response = this.familyClient.send('family/get_Member', { CurrentUser, id_user })
                .pipe(
                    timeout(5000),
                );
            const data = await lastValueFrom(response);
            return data;
        } catch (error) {
            throw new HttpException(error, error.statusCode);
        }
    }

    async getallMember(CurrentUser, id_family) {
        try {
            const response = this.familyClient.send('family/get_all_Member', { CurrentUser, id_family })
                .pipe(
                    timeout(5000),
                );
            const data = await lastValueFrom(response);
            return data;
        } catch (error) {
            throw new HttpException(error, error.statusCode);
        }
    }

    async GetAllFamily(CurrentUser) {
        try {
            const response = this.familyClient.send('family/get_all_Family', { CurrentUser })
                .pipe(
                    timeout(5000),
                );
            const data = await lastValueFrom(response);
            return data;
        } catch (error) {
            throw new HttpException(error, error.statusCode);
        }

    }

    async addMember(CurrentUser, memberFamilyDto: MemberFamilyDto) {
        try {
            const response = this.familyClient.send('family/add_Member', { CurrentUser, memberFamilyDto })
                .pipe(
                    timeout(5000),
                );
            const data = await lastValueFrom(response);
            return data;
        } catch (error) {
            throw new HttpException(error, error.statusCode);
        }
    }

    async deleteMember(CurrentUser, DeleteMemberDTO: DeleteMemberDTO) {
        try {
            const response = this.familyClient.send('family/delete_Member', { CurrentUser, DeleteMemberDTO })
                .pipe(
                    timeout(5000),
                );
            const data = await lastValueFrom(response);
            return data;
        } catch (error) {
            throw new HttpException(error, error.statusCode);
        }
    }

    async createFamily(CurrentUser, createFamilyDto: CreateFamilyDto) {
        try {
            const source = this.familyClient.send('family/create_Family', { CurrentUser, createFamilyDto }).pipe(
                timeout(5000),
                catchError(err => {
                    throw new Error(`Failed to create family: ${err.message}`);
                })
            );;
            const data = await lastValueFrom(source);
            return data;
        } catch (error) {
            throw new HttpException(error, error.statusCode);
        }
    }

    async updateFamily(CurrentUser, UpdateFamilyDTO: UpdateFamilyDTO) {
        try {
            const source = this.familyClient.send('family/update_Family', { CurrentUser, UpdateFamilyDTO }).pipe(
                timeout(5000),
                catchError(err => {
                    throw new Error(`Failed to update family: ${err.message}`);
                })
            );;
            const data = await lastValueFrom(source);
            return data;
        } catch (error) {
            throw new HttpException(error, error.statusCode);
        }
    }

    async deleteFamily(CurrentUser, id_family) {
        try {
            const source = this.familyClient.send('family/delete_Family', { CurrentUser, id_family }).pipe(
                timeout(5000),
                catchError(err => {
                    throw new Error(`Failed to delete family: ${err.message}`);
                })
            );;
            const data = await lastValueFrom(source);
            return data;
        } catch (error) {
            throw new HttpException(error, error.statusCode);
        }
    }

}