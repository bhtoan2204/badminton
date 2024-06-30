import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class DocumentaiService {
  private client: DocumentProcessorServiceClient;
  private projectId = null;
  private location = null;
  private processorId = null;
  constructor(private readonly configService: ConfigService) {
    this.client = new DocumentProcessorServiceClient();
    this.projectId = this.configService.get('GOOGLE_DOCUMENTAI_PROJECT_ID');
    this.location = this.configService.get('GOOGLE_DOCUMENTAI_LOCATION');
    this.processorId = this.configService.get('GOOGLE_DOCUMENTAI_PROCESSOR_ID');
  }

  private extractFields(document: any): any {
    const fields = document.entities.reduce((acc, entity) => {
      const key = entity.type.toLowerCase().replace(/ /g, '_');
      acc[key] = entity.mentionText;
      return acc;
    }, {});

    return fields;
  }

  async processInvoice(file: Express.Multer.File) {
    try {
      const name = `projects/${this.projectId}/locations/${this.location}/processors/${this.processorId}`;
      const [result] = await this.client.processDocument({
        name,
        rawDocument: {
          content: Buffer.from(file.buffer).toString('base64'),
          mimeType: file.mimetype,
        },
      });
      const { document } = result;

      const invoiceData = document.entities;
      return invoiceData;
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
