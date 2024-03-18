import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, IsDateString, IsOptional } from "class-validator";

export class UpdateCalendarDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1 })
  id_calendar: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Vinh Ha Long trip' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'The family\'s off to Ha Long Bay, bonding over its stunning vistas and creating lasting memories' })
  description: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ example: '2021-12-31T18:00:00.000Z' })
  datetime: string;
}