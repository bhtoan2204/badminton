import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AddStepGuidelineDto {
  @ApiProperty({ description: 'The ID of the family' })
  @IsNumber()
  @IsNotEmpty()
  id_family: number;

  @ApiProperty({ description: 'The ID of the guideline' })
  @IsNumber()
  @IsNotEmpty()
  id_guideline: number;

  @ApiProperty({ description: 'The title of the step' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'The description of the step' })
  @IsString()
  @IsOptional()
  description: string;
}