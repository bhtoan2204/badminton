import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { StorageService } from './storage/storage.service';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly storageService: StorageService
  ) { }

  async getInvoiceDetail(id_user: any, id_family: any, id_invoice: any) {
    throw new Error('Method not implemented.');
  }

  async getInvoices(id_user: any, id_invoice: any) {
    throw new Error('Method not implemented.');
  }

  async createInvoice(id_user: any, dto: any) {
    throw new Error('Method not implemented.');
  }

  async deleteInvoice(id_user: any, id_family: any, id_invoice: any) {
    throw new Error('Method not implemented.');
  }

  async updateInvoice(id_user: any, dto: any) {
    throw new Error('Method not implemented.');
  }

  async deleteInvoiceType(id_user: any, id_family: any, id_invoice_type: any) {
    throw new Error('Method not implemented.');
  }

  async updateInvoiceType(id_user: any, dto: any) {
    throw new Error('Method not implemented.');
  }

  async createInvoiceType(id_user: any, dto: any) {
    throw new Error('Method not implemented.');
  }

  async getInvoiceTypes(id_user: any, id_family: any) {
    throw new Error('Method not implemented.');
  }
}
