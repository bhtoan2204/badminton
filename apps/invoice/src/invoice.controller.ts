import { Controller } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import { RmqService } from "@app/common";

@Controller()
export class InvoiceController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly invoiceService: InvoiceService
  ) {}

  @EventPattern('invoiceClient/getInvoiceTypes')
  async getInvoiceTypes(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.invoiceService.getInvoiceTypes(data.id_user, data.id_family);
  }

  @EventPattern('invoiceClient/createInvoiceType')
  async createInvoiceType(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.invoiceService.createInvoiceType(data.id_user, data.dto);
  }

  @EventPattern('invoiceClient/updateInvoiceType')
  async updateInvoiceType(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.invoiceService.updateInvoiceType(data.id_user, data.dto);
  }

  @EventPattern('invoiceClient/deleteInvoiceType')
  async deleteInvoiceType(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.invoiceService.deleteInvoiceType(data.id_user, data.id_family, data.id_invoice_type);
  }

  @EventPattern('invoiceClient/getInvoices')
  async getInvoice(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.invoiceService.getInvoices(data.id_user, data.id_family, data.page, data.itemsPerPage);
  }

  @EventPattern('invoiceClient/getInvoiceDetail')
  async getInvoiceDetail(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.invoiceService.getInvoiceDetail(data.id_user, data.id_family, data.id_invoice);
  }

  @EventPattern('invoiceClient/createInvoice')
  async createInvoice(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.invoiceService.createInvoice(data.id_user, data.dto, data.file);
  }

  @EventPattern('invoiceClient/updateInvoice')
  async updateInvoice(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.invoiceService.updateInvoice(data.id_user, data.dto, data.file);
  }

  @EventPattern('invoiceClient/deleteInvoice')
  async deleteInvoice(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.invoiceService.deleteInvoice(data.id_user, data.id_family, data.id_invoice);
  }

  @EventPattern('invoiceClient/createInvoiceItems')
  async createInvoiceItems(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.invoiceService.createInvoiceItems(data.id_user, data.dto);
  }

  @EventPattern('invoiceClient/getAllInvoiceItems')
  async getAllInvoiceItems(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.invoiceService.getAllInvoiceItems(data.id_user, data.id_family ,data.id_invoice);
  }

  @EventPattern('invoiceClient/getInvoiceItemDetail')
  async getInvoiceItemDetail(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.invoiceService.getInvoiceItemDetail(data.id_user, data.id_family, data.id_invoice, data.id_invoice_item);
  }

  @EventPattern('invoiceClient/updateInvoiceItem')
  async updateInvoiceItems(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.invoiceService.updateInvoiceItems(data.id_user, data.dto);
  }

  @EventPattern('invoiceClient/deleteInvoiceItem')
  async deleteInvoiceItem(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.invoiceService.deleteInvoiceItem(data.id_user, data.id_family, data.id_invoice, data.id_item);
  }

  @EventPattern('invoiceClient/convertTextToInvoiceItems')
  async convertTextToInvoiceItems(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.invoiceService.convertTextToInvoiceItems(data.text);
  }
}
