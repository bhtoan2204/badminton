import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class UpdateComponentScoreDto {
  @ApiProperty({ description: "Subject id", example: 1 })
  @IsNumber()
  @IsNotEmpty()
  id_subject: number
  
  @ApiProperty({ description: "Education progress id", example: 1 })
  @IsNumber()
  @IsNotEmpty()
  id_education_progress: number

  @ApiProperty({ description: "Family id", example: 1 })
  @IsNumber()
  @IsNotEmpty()
  id_family: number

  @ApiProperty({ description: "Index", example: "1" })
  @IsNumber()
  @IsNotEmpty()
  index: number

  @ApiProperty({ description: "Name of component score", example: "Homework 1" })
  @IsString()
  @IsOptional()
  component_name: string

  @ApiProperty({ description: "Score of component", example: 8.9 })
  @IsNumber()
  @IsOptional()
  @Min(0.0, { message: 'Score must be at least 0.0' })
  @Max(10.0, { message: 'Score must not be greater than 10.0' })
  score: number
  
}