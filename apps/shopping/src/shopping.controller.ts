import { Controller, Get } from '@nestjs/common';
import { ShoppingService } from './shopping.service';

@Controller()
export class ShoppingController {
  constructor(private readonly shoppingService: ShoppingService) {}

  @Get()
  getHello(): string {
    return this.shoppingService.getHello();
  }
}
