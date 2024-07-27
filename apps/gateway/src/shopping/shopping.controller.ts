import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  CurrentUser,
  FamilyTermCheckGuard,
  JwtAuthGuard,
  MemberFamilyGuard,
  Permission,
  PERMISSION_SHOPPING,
} from '../utils';
import { CreateShoppingListDto } from './dto/createShoppingList.dto';
import { CreateShoppingItemDto } from './dto/createShoppingItem.dto';
import { UpdateShoppingListDto } from './dto/updateShoppingList.dto';
import { UpdateShoppingItemDto } from './dto/updateShoppingItem.dto';
import { GetShoppingListDto } from './dto/getShoppingList.dto';
import { GetShoppingItemDto } from './dto/getShoppingItem.dto';

@ApiTags('Shopping')
@Controller('shopping')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, FamilyTermCheckGuard, MemberFamilyGuard)
@Permission([PERMISSION_SHOPPING])
export class ShoppingController {
  constructor(private readonly shoppingService: ShoppingService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get shopping item type' })
  @ApiQuery({ name: 'search', required: false })
  @Get('getShoppingItemType')
  async getShoppingItemType(@Query('search') search: string) {
    return this.shoppingService.getShoppingItemType(search);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get shopping list' })
  @Get('getShoppingList')
  async getShoppingList(
    @CurrentUser() currentUser,
    @Query() dto: GetShoppingListDto,
  ) {
    return this.shoppingService.getShoppingList(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get shopping item' })
  @Get('getShoppingIte')
  async getShoppingItem(
    @CurrentUser() currentUser,
    @Query() dto: GetShoppingItemDto,
  ) {
    return this.shoppingService.getShoppingItem(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create shopping list' })
  @Post('createShoppingList')
  async createShoppingList(
    @CurrentUser() currentUser,
    @Body() dto: CreateShoppingListDto,
  ) {
    return this.shoppingService.createShoppingList(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get shopping list type' })
  @ApiQuery({ name: 'search', required: false })
  @Get('getShoppingListType')
  async getShoppingListType(@Query('search') search: string) {
    return this.shoppingService.getShoppingListType(search);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create shopping item' })
  @Post('createShoppingItem')
  async createShoppingItem(
    @CurrentUser() currentUser,
    @Body() dto: CreateShoppingItemDto,
  ) {
    return this.shoppingService.createShoppingItem(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update shopping list' })
  @Put('updateShoppingList')
  async updateShoppingList(
    @CurrentUser() currentUser,
    @Body() dto: UpdateShoppingListDto,
  ) {
    return this.shoppingService.updateShoppingList(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update shopping item' })
  @Put('updateShoppingItem')
  async updateShoppingItem(
    @CurrentUser() currentUser,
    @Body() dto: UpdateShoppingItemDto,
  ) {
    return this.shoppingService.updateShoppingItem(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete shopping list' })
  @Delete('deleteShoppingList/:id_family/:id_list')
  async deleteShoppingList(
    @CurrentUser() currentUser,
    @Param('id_list') id_list: number,
    @Param('id_family') id_family: number,
  ) {
    return this.shoppingService.deleteShoppingList(
      currentUser.id_user,
      id_family,
      id_list,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete shopping item' })
  @Delete('deleteShoppingItem/:id_family/:id_list/:id_item')
  async deleteShoppingItem(
    @CurrentUser() currentUser,
    @Param('id_list') id_list: number,
    @Param('id_item') id_item: number,
    @Param('id_family') id_family: number,
  ) {
    return this.shoppingService.deleteShoppingItem(
      currentUser.id_user,
      id_family,
      id_list,
      id_item,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get suggestions' })
  @Get('getSuggestions/:id_family/:id_list/:id_item')
  async getSuggestions(
    @CurrentUser() currentUser,
    @Param('id_list') id_list: number,
    @Param('id_item') id_item: number,
    @Param('id_family') id_family: number,
  ) {
    return this.shoppingService.getSuggestions(
      currentUser.id_user,
      id_family,
      id_list,
      id_item,
    );
  }
}
