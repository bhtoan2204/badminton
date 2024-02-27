import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { FAMILY_SERVICE } from "apps/gateway/constant/services.constant";
import { lastValueFrom, timeout } from "rxjs";
import { createFamilyDto } from "./dto/createFamilyDto.dto";

@Injectable()
export class FamilyService {
  constructor(
    @Inject(FAMILY_SERVICE) private familyClient: ClientProxy
  ) { }

   async getFamily(id: number) {
    try {
        const response = this.familyClient.send('family/get_Family', { id })
            .pipe(
                timeout(5000),
            );

        const data = await lastValueFrom(response);
        return data;
    } catch (err) {
        throw err;
    }
}

    async createFamily(createFamilyDto: createFamilyDto) {
      try {
        const source = this.familyClient.send('family/create_Family', { createFamilyDto }).pipe(
            timeout(5000),
        );;
        const data = await lastValueFrom(source);
        return data;
      }
      catch (err) {
        throw err;
      }
  }

  async updateFamily(id: number, createFamilyDto: createFamilyDto) {
    try {
        const source = this.familyClient.send('family/update_Family', { id, createFamilyDto }).pipe(
            timeout(5000)
        );;
        const data = await lastValueFrom(source);
        return data;
    }
    catch (err) {
        throw err;
    }
}
    async deleteFamily(id: number) {
        try {
            const source = this.familyClient.send('family/delete_Family', { id }).pipe(
                timeout(5000)
            );
            const data = await lastValueFrom(source);
            return data;
        }
        catch (err) {
            throw err;
        }
    }
}