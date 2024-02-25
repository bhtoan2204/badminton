import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { FAMILY_SERVICE } from "apps/gateway/constant/services.constant";
import { catchError, lastValueFrom, timeout } from "rxjs";

@Injectable()
export class FamilyService {
  constructor(
    @Inject(FAMILY_SERVICE) private familyClient: ClientProxy
  ) { }

  async getFamily(id_family : number){
      const response = await this.familyClient.send('family/getFamily', {})
        .pipe(
          timeout(5000), 
          catchError(err => {
            throw new UnauthorizedException('Unauthorized');
          })
        )

      const data = await lastValueFrom(response);
      return data;
    } catch (err) {
      throw err;
    }
  
}