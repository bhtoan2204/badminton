import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class NewFamilyMessageDto {
  @ApiProperty({ example: 'Hello, family!' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ example: 96 })
  @IsNumber()
  @IsNotEmpty()
  familyId: number;
}
