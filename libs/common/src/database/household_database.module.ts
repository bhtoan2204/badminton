import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { parse } from 'pg-connection-string';
import { HouseholdItems } from './entity/household/household_items.entity';
import { HouseholdConsumableItems } from './entity/household/household_consumable_items.entity';
import { HouseholdDurableItems } from './entity/household/household_durable_items.entity';
import { Room } from './entity/household/room.entity';
import { HouseholdItemCategories } from './entity/household/household_item_categories.entity';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: false,
      validationSchema: Joi.object({
        GUIDELINE_DATABASE_URL: Joi.string().required(),
      }),
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? './libs/.env.production'
          : './libs/.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get('HOUSEHOLD_DATABASE_URL');
        const connectionOptions = parse(dbUrl);
        return {
          name: 'household',
          type: 'postgres',
          host: connectionOptions.host,
          port: parseInt(connectionOptions.port),
          username: connectionOptions.user,
          password: connectionOptions.password,
          database: connectionOptions.database,
          synchronize: true,
          autoLoadEntities: true,
          ssl: {
            rejectUnauthorized: false,
          },
          entities: [
            HouseholdItems,
            HouseholdConsumableItems,
            HouseholdDurableItems,
            HouseholdItemCategories,
            Room,
          ],
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class HouseholdDatabaseModule {}
