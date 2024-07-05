import { Controller } from '@nestjs/common';
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
    return this.shoppingService.getShoppingItemType(data.search);
  }

  @EventPattern('shoppingClient/getShoppingList')
  async getShoppingList(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.shoppingService.getShoppingList(
      data.id_user,
      data.id_family,
      data.page,
      data.itemsPerPage,
    );
  }

  @EventPattern('shoppingClient/getShoppingItem')
  async getShoppingItem(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.shoppingService.getShoppingItem(
      data.id_user,
      data.id_list,
      data.id_family,
      data.page,
      data.itemsPerPage,
    );
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

  @EventPattern('shoppingClient/getShoppingListType')
  async getShoppingListType(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.shoppingService.getShoppingListType(data.search);
  }

  @EventPattern('shoppingClient/updateShoppingList')
  async updateShoppingList(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.shoppingService.updateShoppingList(data.id_user, data.dto);
  }

  @EventPattern('shoppingClient/updateShoppingItem')
  async updateShoppingItem(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.shoppingService.updateShoppingItem(data.id_user, data.dto);
  }

  @EventPattern('shoppingClient/deleteShoppingList')
  async deleteShoppingList(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.shoppingService.deleteShoppingList(
      data.id_user,
      data.id_family,
      data.id_list,
    );
  }

  @EventPattern('shoppingClient/deleteShoppingItem')
  async deleteShoppingItem(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.shoppingService.deleteShoppingItem(
      data.id_user,
      data.id_family,
      data.id_list,
      data.id_item,
    );
  }

  @EventPattern('shoppingClient/getSuggestions')
  async getSuggestions(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.shoppingService.getSuggestions(
      data.id_user,
      data.id_family,
      data.id_list,
      data.id_item,
    );
  }
}
