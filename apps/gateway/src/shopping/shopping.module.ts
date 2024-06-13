import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { FAMILY_SERVICE, PermissionGuard, SHOPPING_SERVICE } from '../utils';
import { ShoppingController } from './shopping.controller';
import { ShoppingService } from './shopping.service';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    RmqModule.register({ name: SHOPPING_SERVICE }),
    RmqModule.register({ name: FAMILY_SERVICE }),
  ],
  controllers: [ShoppingController],
  providers: [
    ShoppingService,
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class ShoppingModule {}
