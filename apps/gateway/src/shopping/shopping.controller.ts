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
import { CurrentUser, JwtAuthGuard, MemberFamilyGuard } from '../utils';
import { CreateShoppingListDto } from './dto/createShoppingList.dto';
import { CreateShoppingItemDto } from './dto/createShoppingItem.dto';
import { UpdateShoppingListDto } from './dto/updateShoppingList.dto';
import { UpdateShoppingItemDto } from './dto/updateShoppingItem.dto';

@ApiTags('Shopping')
@Controller('shopping')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, MemberFamilyGuard)
export class ShoppingController {
  constructor(private readonly shoppingService: ShoppingService) {}

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
  async getShoppingList(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
    @Query('page') page: number,
    @Query('itemsPerPage') itemsPerPage: number,
  ) {
    if (!page) page = 1;
    if (!itemsPerPage) itemsPerPage = 10;
    return this.shoppingService.getShoppingList(
      currentUser.id_user,
      id_family,
      page,
      itemsPerPage,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get shopping item' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @Get('getShoppingItem/:id_list')
  async getShoppingItem(
    @CurrentUser() currentUser,
    @Param('id_list') id_list: number,
    @Query('page') page: number,
    @Query('itemsPerPage') itemsPerPage: number,
  ) {
    if (!page) page = 1;
    if (!itemsPerPage) itemsPerPage = 10;
    return this.shoppingService.getShoppingItem(
      currentUser.id_user,
      id_list,
      page,
      itemsPerPage,
    );
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
}
