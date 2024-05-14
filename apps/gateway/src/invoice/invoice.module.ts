import { RmqModule } from "@app/common";
import { Module } from "@nestjs/common";
import { INVOICE_SERVICE } from "../utils";
import { InvoiceService } from "./invoice.service";
import { InvoiceController } from "./invoice.controller";

@Module({
  imports: [
    RmqModule.register({ name: INVOICE_SERVICE })
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}