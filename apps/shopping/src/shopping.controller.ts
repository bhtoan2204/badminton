import { Controller, Get } from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class ShoppingController {
  constructor(
    private readonly shoppingService: ShoppingService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('shoppingClient/getShoppingItemType')
  async getShoppingItemType(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.shoppingService.getShoppingItemType();
  }

  @EventPattern('shoppingClient/getShoppingList')
  async getShoppingList(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.shoppingService.getShoppingList(data.id_user, data.id_family, data.page, data.itemsPerPage);
  }

  @EventPattern('shoppingClient/getShoppingItem')
  async getShoppingItem(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.shoppingService.getShoppingItem(data.id_user, data.id_family, data.page, data.itemsPerPage);
  }

  @EventPattern('shoppingClient/createShoppingList')
  async createShoppingList(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.shoppingService.createShoppingList(data.id_user, data.dto);
  }

  @EventPattern('shoppingClient/createShoppingItem')
  async createShoppingItem(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.shoppingService.createShoppingItem(data.id_user, data.dto);
  }
}
