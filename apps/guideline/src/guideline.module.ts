import { Module } from '@nestjs/common';
import { GuidelineController } from './guideline.controller';
import { GuidelineService } from './guideline.service';
import { GuideItems, GuidelineDatabaseModule, RmqModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { StorageModule } from './storage/storage.module';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HouseholdModule } from './household/household.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_GUIDELINE_QUEUE: Joi.string().required(),

        GRPC_STORAGE_PACKAGE: Joi.string().required(),
        GRPC_STORAGE_PROTO_PATH: Joi.string().required(),
        GRPC_STORAGE_URL: Joi.string().required(),

        GRPC_HOUSEHOLD_PACKAGE: Joi.string().required(),
        GRPC_HOUSEHOLD_PROTO_PATH: Joi.string().required(),
        GRPC_HOUSEHOLD_URL: Joi.string().required(),
      }),
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? './apps/guideline/.env.production'
          : './apps/guideline/.env',
    }),
    RmqModule,
    RmqModule.register({ name: 'ELASTICSEARCH' }),
    GuidelineDatabaseModule,
    StorageModule,
    HouseholdModule,
    TypeOrmModule.forFeature([GuideItems]),
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get<string>('ELASTICSEARCH_NODE'),
        auth: {
          username: configService.get<string>('ELASTICSEARCH_USERNAME'),
          password: configService.get<string>('ELASTICSEARCH_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [GuidelineController],
  providers: [GuidelineService],
})
export class GuidelineModule {}
