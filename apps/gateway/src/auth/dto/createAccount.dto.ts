import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

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