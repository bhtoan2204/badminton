import { HttpException, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";
import { ELASTICSEARCH_SERVICE } from "../../utils";

@Injectable()
export class ProxyService {
  constructor(
    @Inject(ELASTICSEARCH_SERVICE) private elasticsearchClient: ClientProxy
  ) { }

  async getZone() {
    try {
      const response = this.elasticsearchClient.send('proxyClient/getZone', {})
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

  async getAnalytics(dto: any) {
    try {
      const response = this.elasticsearchClient.send('proxyClient/analytics', dto )
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