import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checklist } from './entity/checklist.entity';
import { Family } from './entity/family.entity';
import { PaymentHistory } from './entity/payment_history.entity';
import { Users } from './entity/users.entity';
import { FamilyExtraPackages } from './entity/family_package_extra.entity';
import { PackageCombo } from './entity/package_combo.entity';
import { PackageExtra } from './entity/package_extra.entity';
import { PackageMain } from './entity/package_main.entity';
import { HouseholdItems } from './entity/household_items.entity';
import { Room } from './entity/room.entity';
import { HouseholdItemCategories } from './entity/household_item_categories.entity';
import { HouseholdDurableItems } from './entity/household_durable_items.entity';
import { HouseholdConsumableItems } from './entity/household_consumable_items.entity';
import { parse } from 'pg-connection-string';
import { GuideItems } from './entity/guide_items.entity';
import { EducationProgress } from './entity/education_progress.entity';
import { Subjects } from './entity/subject.entity';
import { ShoppingItemTypes } from './entity/shopping_item_types.entity';
import { ShoppingItems } from './entity/shopping_items.entity';
import { ShoppingLists } from './entity/shopping_lists.entity';
import * as Joi from 'joi';
import { MemberFamily } from './entity/member_family.entity';
import { Feedback } from './entity/feedback.entity';
import { FeedbackMetadata } from './entity/feedbackMetadata.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: false,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
      }),
      envFilePath: './libs/.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get('DATABASE_URL');
        const connectionOptions = parse(dbUrl);
        return {
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
            Checklist,
            PaymentHistory,
            Users,
            Family,
            MemberFamily,
            FamilyExtraPackages,
            PackageCombo,
            PackageExtra,
            PackageMain,
            HouseholdItems,
            Room,
            HouseholdItemCategories,
            HouseholdDurableItems,
            HouseholdConsumableItems,
            GuideItems,
            EducationProgress,
            Subjects,
            ShoppingItemTypes,
            ShoppingItems,
            ShoppingLists,
            Feedback,
            FeedbackMetadata,
          ],
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
