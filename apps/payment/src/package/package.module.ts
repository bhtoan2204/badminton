import { forwardRef, Module } from '@nestjs/common';
import { PaymentModule } from '../payment.module';

@Module({
  imports: [forwardRef(() => PaymentModule)],
  controllers: [],
  providers: [],
  exports: [],
})
export class PackageModule {}
