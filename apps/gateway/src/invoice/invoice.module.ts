import { RmqModule } from '@app/common';
import { forwardRef, Module } from '@nestjs/common';
import { FAMILY_SERVICE, INVOICE_SERVICE, PermissionGuard } from '../utils';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { UtilitiesModule } from './utilities/utilities.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    RmqModule.register({ name: INVOICE_SERVICE }),
    RmqModule.register({ name: FAMILY_SERVICE }),
    forwardRef(() => UtilitiesModule),
  ],
  controllers: [InvoiceController],
  providers: [
    InvoiceService,
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
  exports: [RmqModule],
})
export class InvoiceModule {}
