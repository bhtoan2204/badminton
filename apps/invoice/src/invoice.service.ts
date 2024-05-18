import { HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { StorageService } from './storage/storage.service';
import { RpcException } from '@nestjs/microservices';
import { UploadFileRequest } from '@app/common';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly storageService: StorageService
  ) { }

  async getInvoiceDetail(id_user: any, id_family: any, id_invoice: any) {
    try {

    }
    catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getInvoices(id_user: any, id_invoice: any) {
    try {

    }
    catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async createInvoice(id_user: any, dto: any, file: any) {
    try {
      const { id_family, id_invoice_type, invoice_name, invoice_date, description } = dto;
      const query = 'SELECT * FROM f_is_user_member_of_family($1, $2)';
      const parameters = [id_user, id_family];
      const isUserMemberOfFamily = await this.entityManager.query(query, parameters);
      if (!isUserMemberOfFamily[0].f_is_user_member_of_family) {
        throw new RpcException({
          message: 'User is not member of family',
          statusCode: HttpStatus.UNAUTHORIZED
        });
      }
      let fileUrl = null;
      if (file) {
        const filename = 'invoice_' + id_user + '_' + Date.now() + '_' + file.originalname;
        const params: UploadFileRequest = {
          file: new Uint8Array(file.buffer.data),
          fileName: filename,
        };
        const uploadImageData = await this.storageService.uploadImageInvoice(params);
        fileUrl = uploadImageData.fileUrl;
      }

      const queryCreateInvoice = 'SELECT * FROM f_create_invoice($1, $2, $3, $4, $5, $6, $7)';
      const paramsCreateInvoice = [id_user, id_family, id_invoice_type, invoice_name, invoice_date, description, fileUrl];
      const data = await this.entityManager.query(queryCreateInvoice, paramsCreateInvoice);
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
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async deleteInvoice(id_user: any, id_family: any, id_invoice: any) {
    try {
      const query = 'SELECT * FROM f_delete_invoice($1, $2, $3)';
      const params = [id_user, id_family, id_invoice];
      const old_imgurl = await this.entityManager.query(query, params);
      if (old_imgurl[0].f_delete_invoice) {
        await this.storageService.deleteImageInvoice(old_imgurl[0].f_delete_invoice);
      }
      return {
        message: 'Delete invoice',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async updateInvoice(id_user: any, dto: any, file: any) {
    try {
      const { id_invoice, id_family, id_invoice_type, invoice_name, invoice_date, description } = dto;
      const query = 'SELECT * FROM f_is_user_member_of_family($1, $2)';
      const parameters = [id_user, id_family];
      const isUserMemberOfFamily = await this.entityManager.query(query, parameters);
      if (!isUserMemberOfFamily[0].f_is_user_member_of_family) {
        throw new RpcException({
          message: 'User is not member of family',
          statusCode: HttpStatus.UNAUTHORIZED
        });
      }
      let fileUrl = null;
      if (file) {
        const filename = 'invoice_' + id_user + '_' + Date.now() + '_' + file.originalname;
        const params: UploadFileRequest = {
          file: new Uint8Array(file.buffer.data),
          fileName: filename,
        };
        const uploadImageData = await this.storageService.uploadImageInvoice(params);
        fileUrl = uploadImageData.fileUrl;
      }
      const queryUpdateInvoice = 'SELECT * FROM f_update_invoice($1, $2, $3, $4, $5, $6, $7, $8)';
      const paramsUpdateInvoice = [id_user, id_invoice, id_family, id_invoice_type, invoice_name, invoice_date, description, fileUrl];
      const data = await this.entityManager.query(queryUpdateInvoice, paramsUpdateInvoice);
      // if (fileUrl && data[0].f_update_invoice) {
      //   await this.storageService.deleteImageInvoice(old_imgurl[0].f_update_invoice);
      // }
      return {
        data,
        message: 'Update invoice',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
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
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
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
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
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
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
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
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
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
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getAllInvoiceItems(id_user: string, id_family: number, id_invoice: number) {
    try {
      const query = 'SELECT * FROM f_get_all_invoice_items($1, $2, $3)';
      const params = [id_user, id_family, id_invoice];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Get all invoice items',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getInvoiceItemDetail(id_user: string, id_family: number, id_invoice: number, id_invoice_item: number) {
    try {
      const query = 'SELECT * FROM f_get_invoice_item_detail($1, $2, $3, $4)';
      const params = [id_user, id_family, id_invoice, id_invoice_item];
      const data = await this.entityManager.query(query, params);
      return {
        data: data[0],
        message: 'Get invoice item detail',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async updateInvoiceItems(id_user: string, dto: any) {
    try {
      const { id_family, id_invoice, id_item, item_name, item_description, quantity, unit_price } = dto;
      const query = 'SELECT * FROM f_update_invoice_items($1, $2, $3, $4, $5, $6, $7, $8)';
      const params = [id_user, id_family, id_invoice, id_item, item_name, item_description, quantity, unit_price];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Update invoice items',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async deleteInvoiceItem(id_user: string, id_family: number, id_invoice: number, id_item: number) {
    try {
      const query = 'SELECT * FROM f_delete_invoice_item($1, $2, $3, $4)';
      const params = [id_user, id_family, id_invoice, id_item];
      await this.entityManager.query(query, params);
      return {
        message: 'Delete invoice item',
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
