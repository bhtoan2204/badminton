import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator"

export class ModifyScoreDto {
  @ApiProperty({ description: 'Id subject' })
  @IsNumber()
  @IsNotEmpty()
  id_subject: number

  @ApiProperty({ description: 'Id family' })
  @IsNumber()
  @IsNotEmpty()
  id_family: number

  @ApiProperty({ description: 'Id education progress' })
  @IsNumber()
  @IsNotEmpty()
  id_education_progress: number

  @ApiProperty({ description: 'Midterm score' })
  @IsNumber()
  @IsOptional()
  @Min(0.0, { message: 'Score must be at least 0.0' })
  @Max(10.0, { message: 'Score must not be greater than 10.0' })
  midterm_score: number

  @ApiProperty({ description: 'Final score' })
  @IsNumber()
  @IsOptional()
  @Min(0.0, { message: 'Score must be at least 0.0' })
  @Max(10.0, { message: 'Score must not be greater than 10.0' })
  final_score: number

  @ApiProperty({ description: 'Bonus score' })
  @IsNumber()
  @IsOptional()
  @Min(0.0, { message: 'Score must be at least 0.0' })
  @Max(10.0, { message: 'Score must not be greater than 10.0' })
  bonus_score: number
}