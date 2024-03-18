import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, IsDateString } from "class-validator";

export class CreateCalendarDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Vinh Ha Long trip' })
  title: string;

  @IsString()
  @ApiProperty({ example: 'The family\'s off to Ha Long Bay, bonding over its stunning vistas and creating lasting memories' })
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 28 })
  id_family: number;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ example: '2021-12-31T18:00:00.000Z' })
  datetime: string;
}