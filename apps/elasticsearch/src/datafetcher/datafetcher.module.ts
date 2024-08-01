import { Module, forwardRef } from '@nestjs/common';
import { DatafetcherController } from './datafetcher.controller';
import { DatafetcherService } from './datafetcher.service';
import { SearchModule } from '../elasticsearch.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { MainDatabaseModule, Family, Order, Users } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MainDatabaseModule,
    forwardRef(() => SearchModule),
    TypeOrmModule.forFeature([Users, Family, Order]),
  ],
  controllers: [DatafetcherController],
  providers: [DatafetcherService],
})
export class DatafetcherModule {}
