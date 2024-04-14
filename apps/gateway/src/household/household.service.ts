import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { HOUSEHOLD_SERVICE } from "../utils";
import { ClientProxy } from "@nestjs/microservices";
import { TimeoutError, lastValueFrom, timeout } from "rxjs";

@Injectable()
export class HouseholdService {
  constructor(
    @Inject(HOUSEHOLD_SERVICE) private householdClient: ClientProxy
  ) { }

  async getCategory() {
    try {
      const response = this.householdClient.send('householdClient/getCategory', { })
        .pipe(
          timeout(5000),
        );
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}