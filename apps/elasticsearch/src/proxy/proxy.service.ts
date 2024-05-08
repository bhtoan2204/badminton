import { HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class ProxyService {
  private cloudflare_api_key;
  private cloudflare_api_url;
  private cloudflare_graphql_url;
  private cloudflare_zone_id;

  constructor(
    private readonly configService: ConfigService
  ) {
    this.cloudflare_api_key = this.configService.get('CLOUDFLARE_API_KEY');
    this.cloudflare_api_url = this.configService.get('CLOUDFLARE_API_URL');
    this.cloudflare_zone_id = this.configService.get('CLOUDFLARE_ZONE_ID');
    this.cloudflare_graphql_url = this.configService.get('CLOUDFLARE_GRAPHQL_URL');
  }

  async getZone() {
    try {
      const response = await fetch(`${this.cloudflare_api_url}/client/v4/zones/${this.cloudflare_zone_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.cloudflare_api_key}`
        }
      });
      const data = await response.json();
      return {
        data: data,
        message: 'Get zones',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  
}