import { HttpService } from "@nestjs/axios";
import { HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RpcException } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class DatafetcherService {
  private readonly ip_api_url: string = null;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.ip_api_url = this.configService.get<string>('IP_API_URL');
  }

  async getIpData(ip: string) {
    try {
      const response = await firstValueFrom(this.httpService.get(`${this.ip_api_url}${ip}`));
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new RpcException({
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Internal server error',
      });
    }
  }
}