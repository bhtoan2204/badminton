import { HttpStatus, Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class SearchService {
  private readonly index = 'famfund-app-production';
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async getLogsCount() {
    try {
      const totalPromise = this.elasticsearchService.count({
        index: this.index,
        body: {
          query: {
            match_all: {}
          }
        }
      });
  
      const infoPromise = this.elasticsearchService.count({
        index: this.index,
        body: {
          query: {
            match: { "log.level": "info" }
          }
        }
      });
  
      const errorPromise = this.elasticsearchService.count({
        index: this.index,
        body: {
          query: {
            match: { "log.level": "error" }
          }
        }
      });
  
      const [response, logInfoResponse, logErrorResponse] = await Promise.all([totalPromise, infoPromise, errorPromise]);
  
      return {
        total: response.count,
        info: logInfoResponse.count,
        error: logErrorResponse.count
      };
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }
}
