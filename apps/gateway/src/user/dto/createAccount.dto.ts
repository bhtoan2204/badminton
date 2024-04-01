import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'banhhaotoan2002@gmail.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '0971308623' })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[a-z]).{8,}$/, {
    message: 'newPassword must be at least 8 characters, include at least one uppercase letter, one lowercase letter, and one number.'
  })
  @ApiProperty({ example: 'Password123' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Bành' })
  firstname: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Toàn' })
  lastname: string;

}