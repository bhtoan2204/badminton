import { Module } from '@nestjs/common';
import { ShoppingController } from './shopping.controller';
import { ShoppingService } from './shopping.service';
import {
  DatabaseModule,
  RmqModule,
  ShoppingItems,
  ShoppingItemTypes,
  ShoppingLists,
} from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_SHOPPING_QUEUE: Joi.string().required(),
      }),
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? './apps/shopping/.env.production'
          : './apps/shopping/.env',
    }),
    RmqModule,
    DatabaseModule,
    TypeOrmModule.forFeature([ShoppingItemTypes, ShoppingLists, ShoppingItems]),
  ],
  controllers: [ShoppingController],
  providers: [ShoppingService],
})
export class ShoppingModule {}
