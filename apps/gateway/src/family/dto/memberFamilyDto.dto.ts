import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class MemberFamilyDto {
    @ApiProperty({ example: 60 })
    id_family: number;

    @IsString()
    @ApiProperty({ example: 'Test@gmail.com' })
    gmail: string;

    @IsString()
    @ApiProperty({ example: '' })
    phone: string;

    @ApiProperty({ example: 1 })
    role: number;

}