import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSubjectDto {
  @ApiProperty({ description: 'Education progress id' })
  @IsNumber()
  @IsNotEmpty()
  id_education_progress: number

  @ApiProperty({ description: 'Family id' })
  @IsNumber()
  @IsNotEmpty()
  id_family: number

  @ApiProperty({ example: 'Math', description: 'Subject name' })
  @IsString()
  @IsNotEmpty()
  subject_name: string

  @ApiProperty({ example: 'Mathematics', description: 'Subject description' })
  @IsString()
  @IsOptional()
  description: string
}