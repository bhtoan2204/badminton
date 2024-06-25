import { forwardRef, Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { DatabaseModule, RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { StorageModule } from './storage/storage.module';
import { UtilitiesModule } from './utilities/utilities.module';
import { DocumentaiModule } from './documentai/documentai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_INVOICE_QUEUE: Joi.string().required(),
        GRPC_STORAGE_PACKAGE: Joi.string().required(),
        GRPC_STORAGE_PROTO_PATH: Joi.string().required(),
        GRPC_STORAGE_URL: Joi.string().required(),
      }),
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? './apps/invoice/.env.production'
          : './apps/invoice/.env',
    }),
    RmqModule,
    DatabaseModule,
    StorageModule,
    DocumentaiModule,
    forwardRef(() => UtilitiesModule),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [RmqModule],
})
export class InvoiceModule {}
