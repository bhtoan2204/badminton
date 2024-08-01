import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Family } from './entity/family.entity';
import { PaymentHistory } from './entity/payment_history.entity';
import { Users } from './entity/users.entity';
import { FamilyExtraPackages } from './entity/family_package_extra.entity';
import { PackageCombo } from './entity/package_combo.entity';
import { PackageExtra } from './entity/package_extra.entity';
import { PackageMain } from './entity/package_main.entity';
import { parse } from 'pg-connection-string';
import { EducationProgress } from './entity/education_progress.entity';
import { Subjects } from './entity/subject.entity';
import { ShoppingItemTypes } from './entity/shopping_item_types.entity';
import { ShoppingItems } from './entity/shopping_items.entity';
import { ShoppingLists } from './entity/shopping_lists.entity';
import { MemberFamily } from './entity/member_family.entity';
import { Feedback } from './entity/feedback.entity';
import { FeedbackMetadata } from './entity/feedbackMetadata.entity';
import { Order } from './entity/order.entity';
import { OrderSubscriber } from './subcriber/order.subcriber';
import { FamilyRoles } from './entity/family_roles.entity';
import { ShoppingListTypes } from './entity/shopping_list_type.entity';
import { Utilities } from './entity/utilities.entity';
import { UtilitiesType } from './entity/utilities_type.entity';
import { FinanceExpenditure } from './entity/finance_expenditure.entity';
import { FinanceExpenditureType } from './entity/finance_expenditure_type.entity';
import { FinanceIncome } from './entity/finance_income.entity';
import { FinanceIncomeSource } from './entity/finance_income_source.entity';
import { FinanceAssets } from './entity/finance_assets.entity';
import { RefreshToken } from './entity/refresh_token.entity';
import { FamilySubscriber } from './subcriber/family.subcriber';
import { UtilitiesSubcriber } from './subcriber/utilities.subcriber';
import { ShoppingListSubscriber } from './subcriber/shoppingList.subcriber';
import { ShoppingItemSubscriber } from './subcriber/shoppingItems.subcriber';
import { Discount } from './entity/discount.entity';
import { OTP } from './entity/otp.entity';
import { FamilyInvitation } from './entity/family_invitation.entity';
import { FrequentlyQuestionMetaData } from './entity/freq_question.entity';
import * as Joi from 'joi';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: false,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
      }),
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? './libs/.env.production'
          : './libs/.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get('DATABASE_URL');
        const connectionOptions = parse(dbUrl);
        return {
          name: 'main',
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
            PaymentHistory,
            Users,
            OTP,
            Family,
            MemberFamily,
            FamilyInvitation,
            FamilyExtraPackages,
            PackageCombo,
            PackageExtra,
            PackageMain,
            EducationProgress,
            Subjects,
            ShoppingItemTypes,
            ShoppingItems,
            ShoppingLists,
            ShoppingListTypes,
            Feedback,
            FeedbackMetadata,
            PaymentHistory,
            Order,
            FamilyRoles,
            Utilities,
            UtilitiesType,
            FinanceExpenditure,
            FinanceExpenditureType,
            FinanceIncome,
            FinanceIncomeSource,
            FinanceAssets,
            RefreshToken,
            Discount,
            FrequentlyQuestionMetaData,
          ],
          // subscribers: [OrderSubscriber],
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    OrderSubscriber,
    FamilySubscriber,
    UtilitiesSubcriber,
    ShoppingListSubscriber,
    ShoppingItemSubscriber,
  ],
})
export class MainDatabaseModule {}
