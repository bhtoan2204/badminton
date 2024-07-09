import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { FAMILY_SERVICE, SHOPPING_SERVICE } from '../utils';
import { ShoppingController } from './shopping.controller';
import { ShoppingService } from './shopping.service';

@Module({
  imports: [
    RmqModule.register({ name: SHOPPING_SERVICE }),
    RmqModule.register({ name: FAMILY_SERVICE }),
  ],
  controllers: [ShoppingController],
  providers: [ShoppingService],
})
export class ShoppingModule {}
