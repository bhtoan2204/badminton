import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { FamilyService } from "./family.service";
import { createFamilyDto } from "./dto/createFamilyDto.dto";

@ApiTags('Family')
@Controller('family')
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}
  
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a family' })
  @Get('getoneFamily')
  async getFamily(@Query('id') id: number) {
    return this.familyService.getFamily(id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a family' })
  @Post('createFamily')
  async createFamily(@Body() createFamilyDto: createFamilyDto) {
    return this.familyService.createFamily(createFamilyDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a family' })
  @Put('updateFamily')
  async updateFamily(@Query('id') id: number, @Body() createFamilyDto: createFamilyDto) {
    return this.familyService.updateFamily(id, createFamilyDto);
  }

  @HttpCode(HttpStatus.OK)// trar veef code
  @ApiOperation({ summary: 'Delete a family' })
  @Delete('deleteFamily')
  async deleteFamily(@Query('id') id: number) {
    return this.familyService.deleteFamily(id);
  }
}