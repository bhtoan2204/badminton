import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Validate,
} from 'class-validator';
import { IsEmailOrPhone } from './checkOtpForgot.dto';

export class VerifyAccountDto {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  @Validate(IsEmailOrPhone)
  email: string;

  @ApiProperty()
  @IsPhoneNumber()
  @IsOptional()
  @Validate(IsEmailOrPhone)
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;
}
