import { forwardRef, Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { UtilitiesController } from './utilities.controller';
import { UtilitiesService } from './utilities.service';
import { FinanceModule } from '../finance.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  FinanceExpenditure,
  FinanceExpenditureType,
  Utilities,
  UtilitiesType,
} from '@app/common';

@Module({
  imports: [
    forwardRef(() => FinanceModule),
    StorageModule,
    TypeOrmModule.forFeature([
      Utilities,
      UtilitiesType,
      FinanceExpenditureType,
      FinanceExpenditure,
    ]),
  ],
  controllers: [UtilitiesController],
  providers: [UtilitiesService],
})
export class UtilitiesModule {}
