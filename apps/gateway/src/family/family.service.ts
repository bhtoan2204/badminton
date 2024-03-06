import { HttpException, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";
import { CreateFamilyDto } from "./dto/createFamily.dto";
import { MemberFamilyDto } from "./dto/memberFamily.dto";
import { FAMILY_SERVICE } from "../utils/constant/services.constant";
import { UpdateFamilyDTO } from "./dto/updateFamilyDto.dto";

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
        }
        catch (error) {
            throw new HttpException(error, error.statusCode);
        }
    }

    async addMember(CurrentUser, MemberFamilyDto: MemberFamilyDto) {
        try {
            const response = this.familyClient.send('family/add_Member', { CurrentUser, MemberFamilyDto }).pipe(
                timeout(5000),
            );
            const data = await lastValueFrom(response);
            return data;
        }
        catch (error) {
            throw new HttpException(error, error.statusCode);
        }
    }

    async createFamily(CurrentUser, CreateFamilyDto: CreateFamilyDto) {
        try {
            const source = this.familyClient.send('family/create_Family', { CurrentUser, CreateFamilyDto }).pipe(
                timeout(5000)
            );
            const data = await lastValueFrom(source);
            return data;
        } 
        catch (error) {
            throw new HttpException(error, error.statusCode);
        }
    }

    async updateFamily(CurrentUser, UpdateFamilyDTO: UpdateFamilyDTO) {
        const source = this.familyClient.send('family/update_Family', { CurrentUser, UpdateFamilyDTO }).pipe(
            timeout(5000)
        );;
        const data = await lastValueFrom(source);
        return data;
    }
}