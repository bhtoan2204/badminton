import { GuideItems, UploadFileRequest } from '@app/common';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { StorageService } from './storage/storage.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class GuidelineService {
  constructor(
    private readonly storageService: StorageService,
    private readonly elasticsearchService: ElasticsearchService,
    @InjectRepository(GuideItems)
    private readonly guideItemsRepository: Repository<GuideItems>,
    @Inject('ELASTICSEARCH') private readonly elasticsearchClient: ClientProxy,
  ) {}

  async getAllGuideline(
    id_user: string,
    dto: {
      id_family: number;
      page: number;
      itemsPerPage: number;
      sortBy: string;
      sortDirection: 'ASC' | 'DESC';
    },
  ) {
    try {
      const option = {
        where: { id_family: dto.id_family },
        take: dto.itemsPerPage,
        skip: (dto.page - 1) * dto.itemsPerPage,
      };
      if (dto.sortBy) {
        option['order'] = { [dto.sortBy]: dto.sortDirection };
      }
      const [data, total] =
        await this.guideItemsRepository.findAndCount(option);
      return {
        message: 'Success',
        data,
        total,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getGuideline(id_user: string, id_family: number, id_guideline: number) {
    try {
      const data = await this.guideItemsRepository.findOne({
        where: { id_family, id_guide_item: id_guideline },
      });
      return {
        message: 'Success',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createGuideline(
    id_user: string,
    { id_family, name, description, id_household_item },
  ) {
    try {
      const newGuideItem = await this.guideItemsRepository.create({
        id_family,
        name,
        description,
        is_shared: false,
        steps: null,
      });

      const data = await this.guideItemsRepository.save(newGuideItem);
      await this.elasticsearchClient.emit('guidelineIndexer/indexGuideline', {
        data,
      });
      return {
        message: 'Success',
        data: newGuideItem,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateGuideline(id_user: any, dto: any) {
    try {
      const { id_family, id_guideline, name, description } = dto;
      const guideItem = await this.guideItemsRepository.findOne({
        where: { id_family, id_guide_item: id_guideline },
      });
      if (!guideItem) {
        throw new RpcException({
          message: 'Guide item not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      if (name !== undefined) {
        guideItem.name = name;
      }
      if (description !== undefined) {
        guideItem.description = description;
      }
      const data = await this.guideItemsRepository.save(guideItem);
      await this.elasticsearchClient.emit('guidelineIndexer/indexGuideline', {
        data,
      });
      return {
        message: 'Success',
        guideItem,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteGuideline(
    id_user: string,
    id_family: number,
    id_guideline: number,
  ) {
    try {
      const guideItem = await this.guideItemsRepository.findOne({
        where: { id_family, id_guide_item: id_guideline },
      });
      if (!guideItem) {
        throw new RpcException({
          message: 'Guide item not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      await this.guideItemsRepository.remove(guideItem);
      await this.elasticsearchClient.emit('guidelineIndexer/deleteGuideline', {
        id_guideline,
      });
      return {
        message: 'Success',
        data: 'Delete guideline successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getStep(id_user: string, id_family: number, id_guideline: number) {
    try {
      const data = await this.guideItemsRepository.findOne({
        where: { id_family, id_guide_item: id_guideline },
      });
      if (!data) {
        throw new RpcException({
          message: 'Guide item not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return {
        message: 'Success',
        data: data.steps,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async addStep(
    id_user: string,
    { id_family, id_guideline, name, description },
    file: any,
  ) {
    try {
      let fileUrl = null;
      if (file) {
        const filename =
          'step_' + id_user + '_' + Date.now() + '_' + file.originalname;
        const params: UploadFileRequest = {
          fileName: filename,
          file: new Uint8Array(file.buffer.data),
        };
        const uploadImageData =
          await this.storageService.uploadImageStep(params);
        fileUrl = uploadImageData.fileUrl;
      }
      const guideItem = await this.guideItemsRepository.findOne({
        where: { id_family, id_guide_item: id_guideline },
      });

      if (!guideItem) {
        throw new RpcException({
          message: 'Guide item not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      const newStep = {
        name,
        description,
        imageUrl: fileUrl,
      };

      if (!guideItem.steps) {
        guideItem.steps = [];
      }

      guideItem.steps.push(newStep);
      await this.guideItemsRepository.save(guideItem);

      return {
        message: 'Success',
        guideItem,
      };
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async insertStep(
    id_user: string,
    { id_family, id_guideline, name, description, index },
    file: any,
  ) {
    try {
      let fileUrl = null;
      if (file) {
        const filename =
          'step_' + id_user + '_' + Date.now() + '_' + file.originalname;
        const params: UploadFileRequest = {
          fileName: filename,
          file: new Uint8Array(file.buffer.data),
        };
        const uploadImageData =
          await this.storageService.uploadImageStep(params);
        fileUrl = uploadImageData.fileUrl;
      }
      const guideItem = await this.guideItemsRepository.findOne({
        where: { id_family, id_guide_item: id_guideline },
      });

      if (!guideItem) {
        throw new RpcException({
          message: 'Guide item not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      const newStep = {
        name,
        description,
        imageUrl: fileUrl,
      };
      if (!guideItem.steps) {
        guideItem.steps = [];
      }
      guideItem.steps.splice(index, 0, newStep);
      await this.guideItemsRepository.save(guideItem);

      return {
        message: 'Success',
        guideItem,
      };
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateStep(
    id_user: string,
    { id_family, id_guideline, name, description, index },
    file: any,
  ) {
    try {
      let fileUrl = null;
      if (file) {
        const filename =
          'step_' + id_user + '_' + Date.now() + '_' + file.originalname;
        const params: UploadFileRequest = {
          fileName: filename,
          file: new Uint8Array(file.buffer.data),
        };
        const uploadImageData =
          await this.storageService.uploadImageStep(params);
        fileUrl = uploadImageData.fileUrl;
      }
      const guideItem = await this.guideItemsRepository.findOne({
        where: { id_family, id_guide_item: id_guideline },
      });
      if (!guideItem) {
        throw new RpcException({
          message: 'Guide item not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      if (guideItem.steps && index >= 0 && index < guideItem.steps.length) {
        const updatedStep = guideItem.steps[index];
        if (name !== undefined) {
          updatedStep.name = name;
        }
        if (description !== undefined) {
          updatedStep.description = description;
        }
        if (fileUrl !== null) {
          updatedStep.imageUrl = fileUrl;
        }
        await this.guideItemsRepository.save(guideItem);

        return {
          message: 'Success',
          guideItem,
        };
      } else {
        throw new RpcException({
          message: 'Invalid index or steps array is empty',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteStep(
    id_user: string,
    id_family: number,
    id_guideline: number,
    index: number,
  ) {
    try {
      const guideItem = await this.guideItemsRepository.findOne({
        where: { id_family, id_guide_item: id_guideline },
      });

      if (!guideItem) {
        throw new RpcException({
          message: 'Guide item not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      if (guideItem.steps && index >= 0 && index < guideItem.steps.length) {
        guideItem.steps.splice(index, 1);
        await this.guideItemsRepository.save(guideItem);

        return {
          message: 'Success',
          data: 'Delete step successfully',
        };
      } else {
        throw new RpcException({
          message: 'Invalid index or steps array is empty',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async markShared(id_user: string, id_family: number, id_guideline: number) {
    try {
      const guideItem = await this.guideItemsRepository.findOne({
        where: { id_family, id_guide_item: id_guideline },
      });
      if (!guideItem) {
        throw new RpcException({
          message: 'Guide item not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      guideItem.is_shared = !guideItem.is_shared;
      const data = await this.guideItemsRepository.save(guideItem);

      const elasticdata = await lastValueFrom(
        this.elasticsearchClient
          .send('guidelineIndexer/indexGuideline', {
            data,
          })
          .pipe(timeout(5000)),
      );
      return {
        message: 'Success',
        data: guideItem.is_shared,
        elasticdata,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getSharedGuideline(
    text: string,
    page: number,
    itemsPerPage: number,
    sort: 'asc' | 'desc' | 'none',
  ) {
    try {
      const sortOption =
        sort !== 'none' ? [{ updated_at: { order: sort } }] : [];
      const query = text
        ? {
            multi_match: {
              query: text,
              fields: ['name', 'description'],
              fuzziness: 'AUTO',
            },
          }
        : { match_all: {} };
      const body = await this.elasticsearchService.search({
        index: 'guideline',
        from: (page - 1) * itemsPerPage,
        size: itemsPerPage,
        body: {
          query: query,
          sort: sortOption,
        },
      });

      const results = body.hits.hits.map((hit) => hit._source);
      const total = body.hits.total;

      return {
        results,
        total,
        page,
        itemsPerPage,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getSharedGuidelineById(id_guideline: number) {
    try {
      const guideline = await this.guideItemsRepository.findOne({
        where: { id_guide_item: id_guideline, is_shared: true },
      });
      if (!guideline) {
        throw new RpcException({
          message: 'Guide item not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return {
        message: 'Success',
        data: guideline,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
