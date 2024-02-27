import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { FAMILY_SERVICE } from "apps/gateway/constant/services.constant";
import { catchError, lastValueFrom, timeout } from "rxjs";
import { createFamilyDto } from "./dto/createFamilyDto.dto";

@Injectable()
export class FamilyService {
  constructor(
    @Inject(FAMILY_SERVICE) private familyClient: ClientProxy
  ) { }

   async getFamily(id: number) {
    try {
        const response = await this.familyClient.send('get_Family', {id})
            .pipe(
                timeout(5000),
                catchError(err => {
                    throw new Error(`Failed to get: ${err.message}`);
                })
            );

            const data = await lastValueFrom(response);
            return data;
    } catch (err) {
        throw err;
    }
}

    async createFamily(createFamilyDto: createFamilyDto) {
      const source = this.familyClient.send('family/create_Family', { createFamilyDto }).pipe(
          timeout(5000),
          catchError(err => {
              throw new Error(`Failed to create family: ${err.message}`);
          })
      );;
      const data = await lastValueFrom(source);
      return data;
  }

  async updateFamily(id: number, createFamilyDto: createFamilyDto) {
    const source = this.familyClient.send('family/update_Family', { id, createFamilyDto }).pipe(
        timeout(5000),
        catchError(err => {
            throw new Error(`Failed to update family: ${err.message}`);
        })
    );;
    const data = await lastValueFrom(source);
    return data;
}
async deleteFamily(id: number) {
    const source = this.familyClient.send('family/delete_Family', { id }).pipe(
        timeout(5000),
        catchError(err => {
            throw new Error(`Failed to delete family: ${err.message}`);
        })
    );;
    const data = await lastValueFrom(source);
    return data;
}
}