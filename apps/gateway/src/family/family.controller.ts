import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { FamilyService } from "./family.service";

@ApiTags('Family')
@Controller('family')
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}
  
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Family' })
  @Get()
  async getFamily(@Query('id') id: number) {
    return this.familyService.getFamily(id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send register OTP' })
  @Post()
  async createFamily(@Body() data: any) {
    
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send register OTP' })
  @Put()
  async updateFamily(@Body() data: any) {
    
  }

  @HttpCode(HttpStatus.OK)// trar veef code
  @ApiOperation({ summary: 'Delete cái family' })
  @Delete()
  async deleteFamily(@Body() data: any) {
    
  }
}