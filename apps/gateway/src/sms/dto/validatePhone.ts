import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class ValidatePhoneDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '8d6d5d26-57f9-4f24-8c31-d273791737ea' })
    id_user: string;

    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber('VN')
    @ApiProperty({ example: '+84971308623' })
    phone: string;
}