import { HttpStatus, Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class GuidelineIndexerService {
  private readonly index = 'guideline_items';
  constructor(private readonly elasticSearchService: ElasticsearchService) {}

  async indexGuideline(guideline: any): Promise<any> {
    try {
      console.log(guideline);
      const data = await this.elasticSearchService.index({
        index: this.index,
        id: guideline.id_guide_item.toString(),
        body: guideline,
      });
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error indexing household', error);
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteGuideline(id_guide_item: number): Promise<void> {
    try {
      await this.elasticSearchService.delete({
        index: this.index,
        id: id_guide_item.toString(),
      });
    } catch (error) {
      console.error('Error indexing household', error);
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async searchGuideline(query: {
    text: string;
    page: number;
    itemsPerPage;
    sort: 'asc' | 'desc' | 'none';
  }): Promise<any> {
    try {
      const { text, page, itemsPerPage, sort } = query;
      const option: any = {
        index: this.index,
        body: {
          from: (page - 1) * itemsPerPage,
          size: itemsPerPage,
          query: {
            bool: {
              must: [
                {
                  term: { is_shared: true },
                },
              ],
            },
          },
        },
      };

      if (text) {
        option.body.query = {
          multi_match: {
            query: text,
            fields: ['name', 'description'],
          },
        };
      }
      if (sort !== 'none' && sort !== undefined) {
        option.body.sort = [
          {
            title: {
              order: sort,
            },
          },
        ];
      }

      const data = await this.elasticSearchService.search(option);
      if (data.hits && data.hits.hits) {
        return {
          data: data.hits.hits.map((hit) => hit._source),
        };
      } else {
        return {
          data: [],
        };
      }
    } catch (error) {
      console.error('Error searching guideline', error);
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
