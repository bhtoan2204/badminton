import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'email' })
    email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'password' })
    password: string;
}