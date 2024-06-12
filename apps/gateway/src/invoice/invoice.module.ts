import { RmqModule } from '@app/common';
import { forwardRef, Module } from '@nestjs/common';
import { FAMILY_SERVICE, INVOICE_SERVICE } from '../utils';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { UtilitiesModule } from './utilities/utilities.module';

@Module({
  imports: [
    RmqModule.register({ name: INVOICE_SERVICE }),
    RmqModule.register({ name: FAMILY_SERVICE }),
    forwardRef(() => UtilitiesModule),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [RmqModule],
})
export class InvoiceModule {}
