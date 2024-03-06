import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class MemberFamilyDto {
    @IsString()
    @ApiProperty({ example: 'Test@gmail.com' })
    gmail: string;

    @IsString()
    @ApiProperty({ example: '' })
    phone: string;

    @ApiProperty({ example: 1 })
    role: number;
}