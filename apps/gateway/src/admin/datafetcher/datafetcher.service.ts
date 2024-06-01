import { HttpException, Inject, Injectable } from "@nestjs/common";
import { ELASTICSEARCH_SERVICE } from "../../utils";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";

@Injectable()
export class DatafetcherService {
  constructor(
    @Inject(ELASTICSEARCH_SERVICE) private elasticsearchClient: ClientProxy
  ) { }

  async getIpData(ip: string) {
    try {
      const response = this.elasticsearchClient.send('datafetcherClient/getIpData', {ip})
        .pipe(
          timeout(15000),
        );
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}