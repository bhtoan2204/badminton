import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ShoppingService } from "./shopping.service";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { CurrentUser } from "../utils";
import { CreateShoppingListDto } from "./dto/createShoppingList.dto";
import { CreateShoppingItemDto } from "./dto/createShoppingItem.dto";

@ApiTags('Shopping')
@Controller('shopping')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ShoppingController {
  constructor(
    private readonly shoppingService: ShoppingService
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get shopping item type' })
  @Get('getShoppingItemType')
  async getShoppingItemType() {
    return this.shoppingService.getShoppingItemType();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get shopping list' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @Get('getShoppingList/:id_family')
  async getShoppingList(@CurrentUser() currentUser, @Param('id_family') id_family: number, @Query('page') page: number, @Query('itemsPerPage') itemsPerPage: number) {
    if (!page) page = 1;
    if (!itemsPerPage) itemsPerPage = 10;
    return this.shoppingService.getShoppingList(currentUser.id_user, id_family, page, itemsPerPage);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get shopping item' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @Get('getShoppingItem/:id_list')
  async getShoppingItem(@CurrentUser() currentUser, @Param('id_list') id_list: number, @Query('page') page: number, @Query('itemsPerPage') itemsPerPage: number) {
    if (!page) page = 1;
    if (!itemsPerPage) itemsPerPage = 10;
    return this.shoppingService.getShoppingItem(currentUser.id_user, id_list, page, itemsPerPage);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create shopping list' })
  @Post('createShoppingList')
  async createShoppingList(@CurrentUser() currentUser, @Body() dto: CreateShoppingListDto) {
    return this.shoppingService.createShoppingList(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create shopping item' })
  @Post('createShoppingItem')
  async createShoppingItem(@CurrentUser() currentUser, @Body() dto: CreateShoppingItemDto) {
    return this.shoppingService.createShoppingItem(currentUser.id_user, dto);
  }
}