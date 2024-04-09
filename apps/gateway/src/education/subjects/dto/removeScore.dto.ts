import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator"

enum ScoreName {
  MIDTERM_SCORE = "midterm_score",
  FINAL_SCORE = "final_score",
  BONUS_SCORE = "bonus_score",
}

export class RemoveScoreDto {
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

  @ApiProperty({ 
    description: 'Name of score (midterm_score, final_score, bonus_score)',
    enum: ScoreName
  })
  @IsEnum(ScoreName, {
    message: 'score_name must be one of the following: midterm_score, final_score, bonus_score',
  })
  @IsNotEmpty()
  score_name: string
}