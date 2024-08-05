import { EducationStatus } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class ChangeStatusSubjectDto {
  @ApiProperty({ description: 'Subject id' })
  @IsNumber()
  @IsNotEmpty()
  id_subject: number;

  @ApiProperty({ description: 'Education progress id' })
  @IsNumber()
  @IsNotEmpty()
  id_education_progress: number;

  @ApiProperty({ description: 'Family id' })
  @IsNumber()
  @IsNotEmpty()
  id_family: number;

  @ApiProperty({ description: 'Status' })
  @IsEnum(EducationStatus, {
    message: `Status must be either ${EducationStatus.in_progress} or ${EducationStatus.completed}`,
  })
  @IsNotEmpty()
  status: string;
}
