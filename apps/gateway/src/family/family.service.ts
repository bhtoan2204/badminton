import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";

import { ClientProxy } from "@nestjs/microservices";

import { FAMILY_SERVICE } from "apps/gateway/constant/services.constant";

import { catchError, lastValueFrom, timeout } from "rxjs";

import { createFamilyDto } from "./dto/createFamilyDto.dto";

import { memberFamilyDto } from "./dto/memberFamilyDto.dto";



@Injectable()

export class FamilyService {

  constructor(

    @Inject(FAMILY_SERVICE) private familyClient: ClientProxy

  ) { }



    async getFamily(CurrentUser) {

    try {

        const response = this.familyClient.send('family/get_Family', {CurrentUser} )

            .pipe(

                timeout(5000),

            );



        const data = await lastValueFrom(response);

        return data;

    } catch (err) {

        throw err;

    }

}



async addMember(CurrentUser, memberFamilyDto: memberFamilyDto) {

    try {

        const response = this.familyClient.send('family/add_Member', {CurrentUser, memberFamilyDto} )

            .pipe(

                timeout(5000),

            );



        const data = await lastValueFrom(response);

        return data;

    } catch (err) {

        throw err;

    }}



    async createFamily(CurrentUser,createFamilyDto: createFamilyDto) {

      const source = this.familyClient.send('family/create_Family', { CurrentUser,createFamilyDto  }).pipe(

          timeout(5000),

          catchError(err => {

              throw new Error(`Failed to create family: ${err.message}`);

          })

      );;

      const data = await lastValueFrom(source);

      return data;

  }



  async updateFamily(CurrentUser,createFamilyDto: createFamilyDto) {

    const source = this.familyClient.send('family/update_Family', { CurrentUser,createFamilyDto }).pipe(

        timeout(5000),

        catchError(err => {

            throw new Error(`Failed to update family: ${err.message}`);

        })

    );;

    const data = await lastValueFrom(source);

    return data;

}





async deleteFamily(CurrentUser) {

    const source = this.familyClient.send('family/delete_Family', {CurrentUser} ).pipe(

        timeout(5000),

        catchError(err => {

            throw new Error(`Failed to delete family: ${err.message}`);

        })

    );;

    const data = await lastValueFrom(source);

    return data;

}

}