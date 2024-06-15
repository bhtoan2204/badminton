import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateChecklistDto {
  @ApiProperty({
    type: Number,
    description: 'ID of family',
    required: true,
    example: 97,
  })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({
    type: String,
    description: 'Name of checklist',
    required: true,
    example: 'Name of checklist',
  })
  @IsNotEmpty()
  @IsString()
  task_name: string;

  @ApiProperty({
    type: String,
    description: 'Description of checklist',
    required: false,
    example: 'Description of checklist',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Due date of checklist',
    required: true,
    example: '2024-06-06T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  due_date: string;
}
