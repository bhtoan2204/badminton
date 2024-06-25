import { HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { StorageService } from './storage/storage.service';
import { RpcException } from '@nestjs/microservices';
import { UploadFileRequest } from '@app/common';
import { ConfigService } from '@nestjs/config';
import * as axios from 'axios';
import { DocumentaiService } from './documentai/documentai.service';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
    private readonly documentaiService: DocumentaiService,
  ) {}

  async convertFormattedStringToJson(formattedString) {
    const cleanedString = formattedString
      .replace(/^```json\n/, '')
      .replace(/```$/, '');
    const jsonString = cleanedString
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .replace(/`/g, '');
    const jsonObject = JSON.parse(jsonString);
    return jsonObject;
  }

  async getInvoiceDetail(id_user: string, id_family: any, id_invoice: any) {
    try {
      const query = 'SELECT * FROM f_get_invoice_detail($1, $2, $3)';
      const params = [id_user, id_family, id_invoice];
      const data = await this.entityManager.query(query, params);
      return {
        data: data[0],
        message: 'Get invoice detail',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getInvoices(
    id_user: string,
    id_family: number,
    page: number,
    itemsPerPage: number,
  ) {
    try {
      const query = 'SELECT * FROM f_get_invoices($1, $2, $3, $4)';
      const params = [id_user, id_family, page, itemsPerPage];
      const countQuery = 'SELECT COUNT(*) FROM invoice WHERE id_family = $1';
      const countParams = [id_family];
      const [data, total] = await Promise.all([
        this.entityManager.query(query, params),
        this.entityManager.query(countQuery, countParams),
      ]);
      return {
        data,
        total,
        message: 'Get invoices',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createInvoice(id_user: any, dto: any, file: any) {
    try {
      const {
        id_family,
        id_invoice_type,
        invoice_name,
        invoice_date,
        description,
      } = dto;
      let fileUrl = null;
      if (file) {
        const filename =
          'invoice_' + id_user + '_' + Date.now() + '_' + file.originalname;
        const params: UploadFileRequest = {
          file: new Uint8Array(file.buffer.data),
          fileName: filename,
        };
        const uploadImageData =
          await this.storageService.uploadImageInvoice(params);
        fileUrl = uploadImageData.fileUrl;
      }

      const queryCreateInvoice =
        'SELECT * FROM f_create_invoice($1, $2, $3, $4, $5, $6, $7)';
      const paramsCreateInvoice = [
        id_user,
        id_family,
        id_invoice_type,
        invoice_name,
        invoice_date,
        description,
        fileUrl,
      ];
      const data = await this.entityManager.query(
        queryCreateInvoice,
        paramsCreateInvoice,
      );
      return {
        data: {
          id_invoice: data[0].id_invoice,
          id_invoice_type,
          invoice_name,
          invoice_date,
          description,
          imageurl: fileUrl,
        },
        message: 'Create invoice',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteInvoice(id_user: any, id_family: any, id_invoice: any) {
    try {
      const query = 'SELECT * FROM f_delete_invoice($1, $2, $3)';
      const params = [id_user, id_family, id_invoice];
      const old_imgurl = await this.entityManager.query(query, params);
      if (old_imgurl[0].f_delete_invoice) {
        await this.storageService.deleteImageInvoice(
          old_imgurl[0].f_delete_invoice,
        );
      }
      return {
        message: 'Delete invoice',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateInvoice(id_user: any, dto: any, file: any) {
    try {
      const {
        id_invoice,
        id_family,
        id_invoice_type,
        invoice_name,
        invoice_date,
        description,
      } = dto;
      let fileUrl = null;
      if (file) {
        const filename =
          'invoice_' + id_user + '_' + Date.now() + '_' + file.originalname;
        const params: UploadFileRequest = {
          file: new Uint8Array(file.buffer.data),
          fileName: filename,
        };
        const uploadImageData =
          await this.storageService.uploadImageInvoice(params);
        fileUrl = uploadImageData.fileUrl;
      }
      const queryUpdateInvoice =
        'SELECT * FROM f_update_invoice($1, $2, $3, $4, $5, $6, $7, $8)';
      const paramsUpdateInvoice = [
        id_user,
        id_invoice,
        id_family,
        id_invoice_type,
        invoice_name,
        invoice_date,
        description,
        fileUrl,
      ];
      const data = await this.entityManager.query(
        queryUpdateInvoice,
        paramsUpdateInvoice,
      );
      // if (fileUrl && data[0].f_update_invoice) {
      //   await this.storageService.deleteImageInvoice(data[0].f_update_invoice);
      // }
      return {
        data,
        message: 'Update invoice',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteInvoiceType(id_user: any, id_family: any, id_invoice_type: any) {
    try {
      const query = 'SELECT * FROM f_delete_invoice_type($1, $2, $3)';
      const params = [id_user, id_family, id_invoice_type];
      await this.entityManager.query(query, params);
      return {
        message: 'Delete invoice type',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateInvoiceType(id_user: any, dto: any) {
    try {
      const { id_family, id_invoice_type, type_name } = dto;
      const query = 'SELECT * FROM f_update_invoice_type($1, $2, $3, $4)';
      const params = [id_user, id_family, id_invoice_type, type_name];
      await this.entityManager.query(query, params);
      return {
        data: {
          id_invoice_type: id_invoice_type,
          type_name,
        },
        message: 'Update invoice type',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createInvoiceType(id_user: string, dto: any) {
    try {
      const { id_family, type_name } = dto;
      const query = 'SELECT * FROM f_create_invoice_type($1, $2, $3)';
      const params = [id_user, id_family, type_name];
      const data = await this.entityManager.query(query, params);
      return {
        data: {
          id_invoice_type: data[0].id_invoice_type,
          type_name,
        },
        message: 'Create invoice type',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getInvoiceTypes(id_user: any, id_family: any) {
    try {
      const query = 'SELECT * FROM f_get_invoice_types($1, $2)';
      const params = [id_user, id_family];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Get invoice types',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createInvoiceItems(id_user: string, dto: any) {
    try {
      const { id_family, id_invoice, items } = dto;
      const query = 'SELECT * FROM f_create_invoice_items($1, $2, $3, $4)';
      const params = [id_user, id_family, id_invoice, JSON.stringify(items)];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Create invoice items',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getAllInvoiceItems(
    id_user: string,
    id_family: number,
    id_invoice: number,
  ) {
    try {
      const query = 'SELECT * FROM f_get_all_invoice_items($1, $2, $3)';
      const params = [id_user, id_family, id_invoice];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Get all invoice items',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getInvoiceItemDetail(
    id_user: string,
    id_family: number,
    id_invoice: number,
    id_invoice_item: number,
  ) {
    try {
      const query = 'SELECT * FROM f_get_invoice_item_detail($1, $2, $3, $4)';
      const params = [id_user, id_family, id_invoice, id_invoice_item];
      const data = await this.entityManager.query(query, params);
      return {
        data: data[0],
        message: 'Get invoice item detail',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateInvoiceItems(id_user: string, dto: any) {
    try {
      const {
        id_family,
        id_invoice,
        id_item,
        item_name,
        item_description,
        quantity,
        unit_price,
      } = dto;
      const query =
        'SELECT * FROM f_update_invoice_items($1, $2, $3, $4, $5, $6, $7, $8)';
      const params = [
        id_user,
        id_family,
        id_invoice,
        id_item,
        item_name,
        item_description,
        quantity,
        unit_price,
      ];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Update invoice items',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteInvoiceItem(
    id_user: string,
    id_family: number,
    id_invoice: number,
    id_item: number,
  ) {
    try {
      const query = 'SELECT * FROM f_delete_invoice_item($1, $2, $3, $4)';
      const params = [id_user, id_family, id_invoice, id_item];
      await this.entityManager.query(query, params);
      return {
        message: 'Delete invoice item',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async convertTextToInvoiceItems(text: string) {
    try {
      const geminiApiUrl = this.configService.get<string>(
        'GOOGLE_API_URL_GEMINI',
      );
      const geminiApiKey = this.configService.get<string>(
        'GOOGLE_API_KEY_GEMINI',
      );
      const geminiUrl = `${geminiApiUrl}?key=${geminiApiKey}`;
      const body = {
        contents: [
          {
            parts: [
              {
                text: `Convert this text to json including: amount (before tax), tax (0 if not provide), and an array of items including: item_name, item_description (optional), quantity (1 if not provide), unit_price: \n${text}`,
              },
            ],
          },
        ],
      };
      const response = await axios.default.post(geminiUrl, body);
      if (response.data.error) {
        throw new RpcException({
          message: response.data.error.message,
          statusCode: response.data.error.code,
        });
      }
      const data = await this.convertFormattedStringToJson(
        response.data.candidates[0].content.parts[0].text,
      );
      console.log(data);
      return {
        data: data,
        message: 'Convert text to invoice items',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async processInvoice(file: Express.Multer.File) {
    try {
      return await this.documentaiService.processInvoice(file);
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
