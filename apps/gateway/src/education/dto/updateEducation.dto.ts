import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateEducationDto {
  @ApiProperty({ description: 'The ID of the education progress' })
  @IsNotEmpty()
  @IsNumber()
  id_education_progress: number

  @ApiProperty({ description: 'The ID of the family' })
  @IsNotEmpty()
  @IsNumber()
  id_family: number

  @ApiProperty({ description: 'The title of the education' })
  @IsOptional()
  @IsString()
  title: string

  @ApiProperty({ description: 'The description of the education' })
  @IsOptional()
  @IsString()
  progress_notes: string

  @ApiProperty({ description: 'The school information of the education' })
  @IsOptional()
  @IsString()
  school_info: string
}