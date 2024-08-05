import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class AddComponentScoreDto {
  @ApiProperty({
    description: 'Name of component score',
    example: 'Homework 1',
  })
  @IsString()
  @IsNotEmpty()
  component_name: string;

  @ApiProperty({ description: 'Score of component', example: 8.9 })
  @IsNumber()
  @IsOptional()
  @Min(0.0, { message: 'Score must be at least 0.0' })
  @Max(1000, { message: 'Score must not be greater than 1000' })
  score: number;

  @ApiProperty({ description: 'Score of component', example: 9.5 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0.0, { message: 'Score must be at least 0.0' })
  @Max(1000, { message: 'Score must not be greater than 1000' })
  target_score: number;

  @ApiProperty({ description: 'Score of component', example: 10 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0.0, { message: 'Score must be at least 0.0' })
  @Max(1000, { message: 'Score must not be greater than 1000' })
  maximum_score: number;
}

export class AddComponentScoreArrayDto {
  @ApiProperty({ description: 'Subject id', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  id_subject: number;

  @ApiProperty({ description: 'Education progress id', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  id_education_progress: number;

  @ApiProperty({ description: 'Family id', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  id_family: number;

  @ApiProperty({
    description: 'Array of component score',
    example: [
      {
        id_subject: 1,
        id_education_progress: 1,
        id_family: 1,
        component_name: 'Homework 1',
        score: 8.9,
        target_score: 9.5,
        maximum_score: 10,
      },
      {
        id_subject: 1,
        id_education_progress: 1,
        id_family: 1,
        component_name: 'Homework 2',
        score: 8.9,
        target_score: 9.5,
        maximum_score: 10,
      },
    ],
  })
  @IsNotEmpty()
  component_scores: AddComponentScoreDto[];
}
