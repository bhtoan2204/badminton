import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { INVOICE_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';
import * as Tesseract from 'tesseract.js';

@Injectable()
export class InvoiceService {
  constructor(
    @Inject(INVOICE_SERVICE) private readonly invoiceClient: ClientProxy,
  ) {}

  async getInvoiceTypes(id_user: string, id_family: number) {
    try {
      const response = this.invoiceClient
        .send('invoiceClient/getInvoiceTypes', { id_user, id_family })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async createInvoiceType(id_user: string, dto: any) {
    try {
      const response = this.invoiceClient
        .send('invoiceClient/createInvoiceType', { id_user, dto })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateInvoiceType(id_user: string, dto: any) {
    try {
      const response = this.invoiceClient
        .send('invoiceClient/updateInvoiceType', { id_user, dto })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async deleteInvoiceType(
    id_user: string,
    id_family: number,
    id_invoice_type: number,
  ) {
    try {
      const response = this.invoiceClient
        .send('invoiceClient/deleteInvoiceType', {
          id_user,
          id_family,
          id_invoice_type,
        })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getInvoices(
    id_user: string,
    id_family: number,
    page: number,
    itemsPerPage: number,
  ) {
    try {
      const response = this.invoiceClient
        .send('invoiceClient/getInvoices', {
          id_user,
          id_family,
          page,
          itemsPerPage,
        })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getInvoiceDetail(
    id_user: string,
    id_family: number,
    id_invoice: number,
  ) {
    try {
      const response = this.invoiceClient
        .send('invoiceClient/getInvoiceDetail', {
          id_user,
          id_family,
          id_invoice,
        })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async createInvoice(id_user: string, dto: any, file: any) {
    try {
      const response = this.invoiceClient
        .send('invoiceClient/createInvoice', { id_user, dto, file })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateInvoice(id_user: string, dto: any, file: any) {
    try {
      const response = this.invoiceClient
        .send('invoiceClient/updateInvoice', { id_user, dto, file })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async deleteInvoice(id_user: string, id_family: number, id_invoice: number) {
    try {
      const response = this.invoiceClient
        .send('invoiceClient/deleteInvoice', { id_user, id_family, id_invoice })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateInvoiceItem(id_user: string, dto: any) {
    try {
      const response = this.invoiceClient
        .send('invoiceClient/updateInvoiceItem', { id_user, dto })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async createInvoiceItems(id_user: string, dto: any) {
    try {
      const response = this.invoiceClient
        .send('invoiceClient/createInvoiceItems', { id_user, dto })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getInvoiceItemDetail(
    id_user: string,
    id_family: number,
    id_invoice: number,
    id_invoice_item: number,
  ) {
    try {
      const response = this.invoiceClient
        .send('invoiceClient/getInvoiceItemDetail', {
          id_user,
          id_family,
          id_invoice,
          id_invoice_item,
        })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getAllInvoiceItems(
    id_user: string,
    id_family: number,
    id_invoice: number,
  ) {
    try {
      const response = this.invoiceClient
        .send('invoiceClient/getAllInvoiceItems', {
          id_user,
          id_family,
          id_invoice,
        })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async deleteInvoiceItem(
    id_user: string,
    id_family: number,
    id_invoice: number,
    id_item: number,
  ) {
    try {
      const response = this.invoiceClient
        .send('invoiceClient/deleteInvoiceItem', {
          id_user,
          id_family,
          id_invoice,
          id_item,
        })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async convertImageToText(file: any) {
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    const filePath = path.join(tempDir, file.originalname);
    try {
      fs.writeFileSync(filePath, file.buffer);
      const {
        data: { text },
      } = await Tesseract.recognize(filePath, 'eng', {
        logger: (info) =>
          console.log(
            `Status ${info.status} in progress ${info.progress * 100}`,
          ),
      });
      return text;
    } catch (error) {
      console.error('Error:', error);
      throw new HttpException(
        'Failed to recognize text from image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      fs.unlinkSync(filePath);
    }
  }

  async convertTextToInvoiceItems(text: string) {
    try {
      const response = this.invoiceClient
        .send('invoiceClient/convertTextToInvoiceItems', { text })
        .pipe(timeout(50000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}
