import { HttpStatus, Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class GuidelineIndexerService {
  private readonly index = 'guideline_items';
  constructor(private readonly elasticSearchService: ElasticsearchService) {}

  async indexGuideline(guideline: any): Promise<any> {
    try {
      if (guideline === undefined) {
        throw new Error('Guideline is undefined');
      }
      if (guideline.id_guide_item === undefined) {
        throw new Error('id_guide_item is undefined');
      }
      const data = await this.elasticSearchService.index({
        index: this.index,
        id: guideline.id_guide_item.toString(),
        body: guideline,
      });
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
      if (id_guide_item === undefined) {
        throw new Error('id_guide_item is undefined');
      }
      await this.elasticSearchService.delete({
        index: this.index,
        id: id_guide_item.toString(),
      });
    } catch (error) {
      console.error('Error deleting household', error);
    }
  }

  async searchGuideline(query: {
    text: string;
    page: number;
    itemsPerPage: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc' | 'none';
  }): Promise<any> {
    try {
      const { text, page, itemsPerPage, sortBy, sortDirection } = query;
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
      if (sortBy && sortDirection) {
        option.body.sort = [
          {
            [sortBy]: {
              order: sortDirection,
            },
          },
        ];
      }

      const data = await this.elasticSearchService.search(option);
      if (data && data.hits && data.hits.hits) {
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
