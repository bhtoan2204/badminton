import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SerperService {
  private readonly serperUrl;
  private readonly serperApiKey;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.serperUrl = this.configService.get('SERPER_API_URL');
    this.serperApiKey = this.configService.get('SERPER_API_KEY');
  }

  async getShoppingSuggestions(query: string) {
    const data = JSON.stringify({
      q: query,
      gl: 'vn',
      hl: 'vi',
    });
    const headers = {
      'X-API-KEY': this.serperApiKey,
      'Content-Type': 'application/json',
    };
    const config = {
      headers,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.serperUrl, data, config),
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new RpcException(new Error('Error fetching data from Serper API'));
    }
  }
}
