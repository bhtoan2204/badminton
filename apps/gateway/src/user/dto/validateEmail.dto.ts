import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumberString, IsString } from "class-validator";

export class ValidateEmailDto {
    @IsNotEmpty()
    @IsNumberString()
    @ApiProperty({ example: '123456' })
    otp: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @ApiProperty({ example: 'banhhaotoan2002@gmail.com' })
    email: string;
}