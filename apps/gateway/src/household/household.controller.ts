import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { HouseholdService } from "./household.service";
import { CurrentUser } from "../utils";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImageFileInterceptor } from "../user/interceptor/imageFile.interceptor";

@ApiTags('Household')
@Controller('household')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class HouseholdController {
  constructor(
    private readonly householdService: HouseholdService
  ) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get household category' })
  @Get('getHouseholdCategory')
  async getHousehold() {
    return this.householdService.getCategory();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get household item' })
  @Get('getHouseholdItem/:id_family')
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'itemsPerPage', required: false, type: String })
  @ApiParam({ name: 'id_family', required: true, description: 'The ID of the family' })
  async getHouseholdItem(@CurrentUser() currentUser, @Param('id_family') id_family: number, @Query('page') page: number, @Query('itemsPerPage') itemsPerPage: number) {
    return this.householdService.getItem(currentUser.id_user, id_family, page, itemsPerPage);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get household item detail' })
  @Get('getHouseholdItemDetail/:id_family/:id_item')
  @ApiParam({ name: 'id_family', required: true, description: 'The ID of the family' })
  @ApiParam({ name: 'id_item', required: true, description: 'The ID of the item' })
  async getHouseholdItemDetail(@CurrentUser() currentUser, @Param('id_family') id_family: number, @Param('id_item') id_item: number) {
    return this.householdService.getItemDetail(currentUser.id_user, id_family, id_item);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create household item' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id_family: {
          type: 'string',
          description: 'The ID of the family',
        },
        item_image: {
          type: 'string',
          format: 'binary',
          description: 'The image of the item (optional)',
        },
        item_name: {
          type: 'string',
          description: 'The name of the household item',
        },
        id_category: {
          type: 'string',
          description: 'The id of the category of the household item',
        },
        item_description: {
          type: 'string',
          description: 'The description of the household item (optional)',
        },
        item_type: {
          type: "string",
          enum: ["consumable", "durable"],
          description: "The type of the item, whether it is consumable or durable"
        }
      },
      required: ["id_family", "item_name", "id_category", "item_type"],
    },
  })
  @UseInterceptors(FileInterceptor('item_image', new ImageFileInterceptor().createMulterOptions()))
  @Post('createHouseholdItem')
  async createHouseholdItem(@CurrentUser() currentUser, @Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    dto.id_family = parseInt(dto.id_family);
    dto.id_category = parseInt(dto.id_category);
    return this.householdService.createItem(currentUser.id_user, dto, file);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete household item' })
  @ApiParam({ name: 'id_family', required: true, description: 'The ID of the family' })
  @ApiParam({ name: 'id_item', required: true, description: 'The ID of the item' })
  @Delete('deleteHouseholdItem/:id_family/:id_item')
  async deleteHouseholdItem(@CurrentUser() currentUser, @Param('id_family') id_family: number, @Param('id_item') id_item: number) {
    return this.householdService.deleteItem(currentUser.id_user, id_family, id_item);
  }
}