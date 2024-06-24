import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({ type: 'string', description: 'Feedback content' })
  @IsNotEmpty()
  @IsString()
  comment: string;

  @ApiProperty({ type: 'number', description: 'Rating' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
