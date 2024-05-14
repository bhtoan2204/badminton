import { HttpException, Inject, Injectable } from "@nestjs/common";
import { INVOICE_SERVICE } from "../utils";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";

@Injectable()
export class InvoiceService {
  constructor(
    @Inject(INVOICE_SERVICE) private readonly invoiceClient: ClientProxy
  ) { }
  

  async getInvoiceTypes(id_user: string, id_family: number) {
    try {
      const response = this.invoiceClient.send('invoiceClient/getInvoiceTypes', { id_user, id_family }).pipe(timeout(5000));
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async createInvoiceType(id_user: string, dto: any) {
    try {
      const response = this.invoiceClient.send('invoiceClient/createInvoiceType', { id_user, dto }).pipe(timeout(5000));
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateInvoiceType(id_user: string, dto: any) {
    try {
      const response = this.invoiceClient.send('invoiceClient/updateInvoiceType', { id_user, dto }).pipe(timeout(5000));
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async deleteInvoiceType(id_user: string, id_family: number, id_invoice_type: number) {
    try {
      const response = this.invoiceClient.send('invoiceClient/deleteInvoiceType', { id_user, id_family, id_invoice_type }).pipe(timeout(5000));
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getInvoices(id_user: string, id_family: number, page: number, itemsPerPage: number) {
    try {
      const response = this.invoiceClient.send('invoiceClient/getInvoices', { id_user, id_family, page, itemsPerPage }).pipe(timeout(5000));
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getInvoiceDetail(id_user: string, id_family:number, id_invoice: number) {
    try {
      const response = this.invoiceClient.send('invoiceClient/getInvoiceDetail', { id_user, id_family, id_invoice }).pipe(timeout(5000));
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async createInvoice(id_user: string, dto: any) {
    try {
      const response = this.invoiceClient.send('invoiceClient/createInvoice', { id_user, dto }).pipe(timeout(5000));
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateInvoice(id_user: string, dto: any) {
    try {
      const response = this.invoiceClient.send('invoiceClient/updateInvoice', { id_user, dto }).pipe(timeout(5000));
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async deleteInvoice(id_user: string, id_family: number, id_invoice: number) {
    try {
      const response = this.invoiceClient.send('invoiceClient/deleteInvoice', { id_user, id_family, id_invoice }).pipe(timeout(5000));
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
  
}