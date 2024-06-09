import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';

enum Gender {
  Male = 'male',
  Female = 'female',
  GenderNotSpecified = 'not_specified',
}

export class CreateAccountDto {
  @ApiProperty({ example: 'banhhaotoan2002@gmail.com' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: '+84971308623' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: 'Password123' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[a-z]).{8,}$/, {
    message:
      'newPassword must be at least 8 characters, include at least one uppercase letter, one lowercase letter, and one number.',
  })
  password: string;

  @ApiProperty({ example: 'Bành' })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({ example: 'Toàn' })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({ example: 'male', description: 'male, female, not_specified' })
  @IsNotEmpty()
  @IsString()
  @IsEnum(Gender, {
    message: 'Invalid gender value (male, female, not_specified)',
  })
  genre: string;

  @ApiProperty({ example: '2002-06-20' })
  @IsNotEmpty()
  @IsString()
  birthdate: string;
}
