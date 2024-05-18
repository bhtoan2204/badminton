import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, OnModuleInit, Param, Post, Put, Query, Req, Sse, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { InvoiceService } from "./invoice.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImageFileInterceptor } from "../user/interceptor/imageFile.interceptor";
import * as Tesseract from 'tesseract.js';

import * as fs from 'fs';
import * as path from 'path';
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { CurrentUser } from "../utils";
import { CreateInvoiceTypeDto } from "./dto/createInvoiceType.dto";
import { UpdateInvoiceTypeDto } from "./dto/updateInvoiceType.dto";
import { CreateInvoiceDto } from "./dto/createInvoice.dto";
import { UpdateInvoiceDto } from "./dto/updateInvoice.dto";
import { CreateInvoiceItemDto } from "./dto/createInvoiceItem.dto";
import { UpdateInvoiceItemDto } from "./dto/updateInvoiceItem.dto";
import { InvoiceImageFileInterceptor } from "../user/interceptor/invoiceImageFile.interceptor";

// @WebSocketGateway({
//   cors: { origin: '*', },
// })
@ApiTags('Invoice')
@Controller('invoice')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class InvoiceController {
  // @WebSocketServer() server: Server;

  constructor(
    private readonly invoiceService: InvoiceService
  ) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get invoice types' })
  @Get('getInvoiceTypes/:id_family')
  @ApiParam({name: 'id_family', required: true, type: Number})
  async getInvoiceTypes(@CurrentUser() currentUser, @Param('id_family') id_family: number) {
    return this.invoiceService.getInvoiceTypes(currentUser.id_user, id_family);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create invoice type' })
  @Post('createInvoiceType')
  async createInvoiceType(@CurrentUser() currentUser, @Body() dto: CreateInvoiceTypeDto) {
    return this.invoiceService.createInvoiceType(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update invoice type' })
  @Put('updateInvoiceType')
  async updateInvoiceType(@CurrentUser() currentUser, @Body() dto: UpdateInvoiceTypeDto) {
    return this.invoiceService.updateInvoiceType(currentUser.id_user, dto);
  }

  @HttpCode(204)
  @ApiOperation({ summary: 'Delete invoice type' })
  @Delete('deleteInvoiceType/:id_family/:id_invoice_type')
  @ApiParam({name: 'id_family', required: true, type: Number})
  @ApiParam({name: 'id_invoice_type', required: true, type: Number})
  async deleteInvoiceType(@CurrentUser() currentUser, @Param('id_family') id_family: number, @Param('id_invoice_type') id_invoice_type: number) {
    return this.invoiceService.deleteInvoiceType(currentUser.id_user, id_family, id_invoice_type);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get invoices' })
  @Get('getInvoices/:id_family')
  @ApiParam({name: 'id_family', required: true, type: Number})
  @ApiQuery({name: 'page', required: false, type: Number})
  @ApiQuery({name: 'itemsPerPage', required: false, type: Number})
  async getInvoices(@CurrentUser() currentUser, @Param('id_family') id_family: number, @Query('page') page: number, @Query('itemsPerPage') itemsPerPage: number){
    return this.invoiceService.getInvoices(currentUser.id_user, id_family, page, itemsPerPage);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get invoice detail' })
  @Get('getInvoiceDetail/:id_family/:id_invoice')
  @ApiParam({name: 'id_family', required: true, type: Number})
  @ApiParam({name: 'id_invoice', required: true, type: Number})
  async getInvoiceDetail(@CurrentUser() currentUser, @Param('id_family') id_family: number, @Param('id_invoice') id_invoice: number){
    return this.invoiceService.getInvoiceDetail(currentUser.id_user, id_family, id_invoice);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create invoice' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        invoiceImg: {
          type: 'string',
          format: 'binary',
          description: 'The image of the invoice (optional)',
        },
        id_family: {
          type: 'number',
          description: 'The ID of the family',
        },
        invoice_name: {
          type: 'string',
          description: 'The name of the invoice',
        },
        id_invoice_type: {
          type: 'number',
          description: 'The ID of the invoice type',
        },
        invoice_date: {
          type: 'date',
          description: 'The invoice date',
        },
        description: {
          type: 'string',
          description: 'The description of the invoice (optional)',
        },
      },
      required: ["id_family", "id_invoice_type", "invoice_name"],
    },
  })
  @UseInterceptors(FileInterceptor('invoiceImg', new ImageFileInterceptor().createMulterOptions()))
  @Post('createInvoice')
  async createInvoice(@CurrentUser() currentUser, @Body() body: any, @UploadedFile() file: Express.Multer.File){
    const dto : CreateInvoiceDto = {
      id_family: parseInt(body.id_family),
      invoice_name: body.invoice_name,
      id_invoice_type: parseInt(body.id_invoice_type),
      invoice_date: body.invoice_date || null,
      description: body.description,
    }
    return this.invoiceService.createInvoice(currentUser.id_user, dto, file);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update invoice' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        invoiceImg: {
          type: 'string',
          format: 'binary',
          description: 'The image of the invoice (optional)',
        },
        id_invoice: {
          type: 'number',
          description: 'The ID of the invoice',
        },
        id_family: {
          type: 'number',
          description: 'The ID of the family',
        },
        invoice_name: {
          type: 'string',
          description: 'The name of the invoice (optional)',
        },
        id_invoice_type: {
          type: 'number',
          description: 'The ID of the invoice type (optional)',
        },
        invoice_date: {
          type: 'date',
          description: 'The invoice date (optional)',
        },
        description: {
          type: 'string',
          description: 'The description of the invoice (optional)',
        },
      },
      required: ["id_family", "id_invoice"],
    },
  })
  @UseInterceptors(FileInterceptor('invoiceImg', new ImageFileInterceptor().createMulterOptions()))
  @Put('updateInvoice')
  async updateInvoice(@CurrentUser() currentUser, @Body() data: any, @UploadedFile() file: Express.Multer.File) {
    const dto : UpdateInvoiceDto = {
      id_invoice: parseInt(data.id_invoice),
      id_family: parseInt(data.id_family),
      id_invoice_type: parseInt(data.id_invoice_type) || null,
      invoice_name: data.invoice_name || null,
      invoice_date: data.invoice_date || null,
      description: data.description || null,
    }
    console.log(dto);
    return this.invoiceService.updateInvoice(currentUser.id_user, dto, file);
  }

  @HttpCode(204)
  @ApiOperation({ summary: 'Delete invoice' })
  @Delete('deleteInvoice/:id_family/:id_invoice')
  @ApiParam({name: 'id_family', required: true, type: Number})
  @ApiParam({name: 'id_invoice', required: true, type: Number})
  async deleteInvoice(@CurrentUser() currentUser, @Param('id_family') id_family: number, @Param('id_invoice') id_invoice: number){
    return this.invoiceService.deleteInvoice(currentUser.id_user, id_family, id_invoice);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all invoices items' })
  @Get('getAllInvoiceItems/:id_family/:id_invoice')
  @ApiParam({name: 'id_family', required: true, type: Number})
  @ApiParam({name: 'id_invoice', required: true, type: Number})
  async getAllInvoiceItems(@CurrentUser() currentUser, @Param('id_family') id_family: number, @Param('id_invoice') id_invoice: number) {
    return this.invoiceService.getAllInvoiceItems(currentUser.id_user, id_family, id_invoice);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get invoice item detail' })
  @Get('getInvoiceItemDetail/:id_family/:id_invoice/:id_item')
  @ApiParam({name: 'id_family', required: true, type: Number})
  @ApiParam({name: 'id_invoice', required: true, type: Number})
  @ApiParam({name: 'id_item', required: true, type: Number})
  async getInvoiceItemDetail(@CurrentUser() currentUser, @Param('id_family') id_family: number, @Param('id_invoice') id_invoice: number, @Param('id_item') id_item: number) {
    return this.invoiceService.getInvoiceItemDetail(currentUser.id_user, id_family, id_invoice, id_item);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create invoice item' })
  @ApiBody({ type: CreateInvoiceItemDto })
  @Post('createInvoiceItems')
  async createInvoiceItems(@CurrentUser() currentUser, @Body() dto: CreateInvoiceItemDto) {
    return this.invoiceService.createInvoiceItems(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update invoice item' })
  @Put('updateInvoiceItem')
  async updateInvoiceItem(@CurrentUser() currentUser, @Body() dto: UpdateInvoiceItemDto) {
    return this.invoiceService.updateInvoiceItem(currentUser.id_user, dto);
  }

  @HttpCode(204)
  @ApiOperation({ summary: 'Delete invoice item' })
  @Delete('deleteInvoiceItem/:id_family/:id_invoice/:id_item')
  @ApiParam({name: 'id_family', required: true, type: Number})
  @ApiParam({name: 'id_invoice', required: true, type: Number})
  @ApiParam({name: 'id_item', required: true, type: Number})
  async deleteInvoiceItem(@CurrentUser() currentUser, @Param('id_family') id_family: number, @Param('id_invoice') id_invoice: number, @Param('id_item') id_item: number) {
    return this.invoiceService.deleteInvoiceItem(currentUser.id_user, id_family, id_invoice, id_item);
  }

  // async onModuleInit() {
  //   this.server.on('connection', async (socket) => {
  //     try {
  //       const socketId = socket.id;
  //       console.log(socketId, 'connected')
  //       return socketId;
  //     }
  //     catch (error) {
  //       console.error('Error handling connection:', error.message);
  //       socket.disconnect(true);
  //     }
  //   });
  // }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Convert image to text (for testing)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { avatar: { type: 'string', format: 'binary', }, }, }, })
  @UseInterceptors(FileInterceptor('invoiceImg', new ImageFileInterceptor().createMulterOptions()))
  @Post('upload')
  async convertImageToText(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file) {
      throw new HttpException('File not uploaded', HttpStatus.BAD_REQUEST);
    }
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    const filePath = path.join(tempDir, file.originalname);
    try {
      fs.writeFileSync(filePath, file.buffer);
      const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
        logger: info => console.log(`Status ${info.status} in progress ${info.progress * 100}`)// this.server.to(req.socket.id).emit('progress', info.progress)
      });
      // this.server.to(req.socket.id).emit('result', { text: text, done: true });
      return text;

    } catch (error) {
      console.error('Error:', error);
      throw new HttpException('Failed to recognize text from image', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      fs.unlinkSync(filePath);
    }
  }
}
