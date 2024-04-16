import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class NewNotificationDto {
  @ApiProperty({ description: 'Title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Content' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: 'Type' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ description: 'Data' })
  @IsNotEmpty()
  @IsString()
  data: string;

  @IsNumber()
  @IsNotEmpty()
  family_id: number;
}