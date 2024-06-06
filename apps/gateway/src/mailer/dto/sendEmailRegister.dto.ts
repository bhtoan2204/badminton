import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendEmailRegisterDto {
  @ApiProperty({ example: 'banhhaotoan2002@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
