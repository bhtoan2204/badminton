import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteComponentScoreDto {
  @ApiProperty({ description: 'Id subject' })
  @IsNumber()
  @IsNotEmpty()
  id_subject: number;

  @ApiProperty({ description: 'Id family' })
  @IsNumber()
  @IsNotEmpty()
  id_family: number;

  @ApiProperty({ description: 'Id education progress' })
  @IsNumber()
  @IsNotEmpty()
  id_education_progress: number;

  @ApiProperty({ description: 'Index' })
  @IsNumber()
  @IsNotEmpty()
  index: number;
}
