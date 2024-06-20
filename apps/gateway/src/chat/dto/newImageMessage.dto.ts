import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NewImageMessageDto {
  @ApiProperty({ example: '0ad6f5b5-f6f8-4035-84d2-779966235b1c' })
  @IsString()
  @IsNotEmpty()
  receiverId: string;
}
