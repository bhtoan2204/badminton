import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, isNumber } from "class-validator";

export class CreateFamilyDto {


    @IsString()
    @ApiProperty({ example: 'abc' })
    description: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'family' })
    name: string;

}